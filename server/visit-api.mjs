/**
 * Minimal visit counter API. Persists to JSON on disk.
 *
 * Usage: node server/visit-api.mjs
 * Env: VISIT_API_PORT (default 3948), VISIT_COUNTER_FILE (optional override path)
 *
 * Routes:
 *   GET  /api/visits           → { count } (read only)
 *   GET  /api/visits?inc=1     → increment, → { count } (CDN / EdgeOne 友好，避免 POST 405)
 *   POST /api/visits           → increment, → { count } (本地或支持 POST 的源站)
 */
import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultDataFile = path.join(__dirname, "data", "home-visits.json");
const DATA_FILE = process.env.VISIT_COUNTER_FILE || defaultDataFile;
const PORT = Number(process.env.VISIT_API_PORT || 3948);

/** Serialize increments to avoid lost updates under concurrent POSTs. */
let chain = Promise.resolve();

function locked(fn) {
  const run = chain.then(fn, fn);
  chain = run.catch(() => {});
  return run;
}

async function readCount() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const j = JSON.parse(raw);
    const c = j.count;
    return typeof c === "number" && Number.isFinite(c) && c >= 0 ? Math.floor(c) : 0;
  } catch {
    return 0;
  }
}

async function writeCount(n) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(
    DATA_FILE,
    JSON.stringify({ count: n, updatedAt: new Date().toISOString() }, null, 0),
    "utf8",
  );
}

async function incrementCount() {
  return locked(async () => {
    const n = await readCount();
    const next = n + 1;
    await writeCount(next);
    return next;
  });
}

/** Simple per-IP sliding window (increment: POST or GET ?inc=1). */
const rateWindowMs = 60_000;
const rateMax = 120;
const rateState = new Map();

function rateAllow(ip) {
  const now = Date.now();
  let rec = rateState.get(ip);
  if (!rec || now - rec.start > rateWindowMs) {
    rec = { start: now, n: 0 };
  }
  rec.n += 1;
  rateState.set(ip, rec);
  if (rateState.size > 50_000) {
    for (const [k, v] of rateState) {
      if (now - v.start > rateWindowMs) rateState.delete(k);
    }
  }
  return rec.n <= rateMax;
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
  };
}

/** Avoid edge/CDN caching visit counts (especially GET ?inc=1). */
const noStoreHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  Pragma: "no-cache",
};

function sendJson(res, status, body, extraHeaders = {}) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    ...corsHeaders(),
    ...extraHeaders,
  });
  res.end(JSON.stringify(body));
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, corsHeaders());
    res.end();
    return;
  }

  const host = req.headers.host || "localhost";
  const url = new URL(req.url || "/", `http://${host}`);
  if (!url.pathname.startsWith("/api/visits")) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
    return;
  }

  const ip = req.socket.remoteAddress || "unknown";

  try {
    /** HEAD（如 curl -I / 部分 CDN 探测）不写计数、不返回 body，避免误把 ?inc=1 当 GET 用。 */
    if (req.method === "HEAD") {
      res.writeHead(200, { ...corsHeaders(), ...noStoreHeaders });
      res.end();
      return;
    }
    if (req.method === "GET") {
      const wantInc =
        url.searchParams.get("inc") === "1" || url.searchParams.get("increment") === "1";
      if (wantInc) {
        if (!rateAllow(ip)) {
          sendJson(res, 429, { error: "rate_limited" }, noStoreHeaders);
          return;
        }
        const count = await incrementCount();
        sendJson(res, 200, { count }, noStoreHeaders);
        return;
      }
      const count = await readCount();
      sendJson(res, 200, { count }, noStoreHeaders);
      return;
    }
    if (req.method === "POST") {
      if (!rateAllow(ip)) {
        sendJson(res, 429, { error: "rate_limited" }, noStoreHeaders);
        return;
      }
      const count = await incrementCount();
      sendJson(res, 200, { count }, noStoreHeaders);
      return;
    }
    sendJson(res, 405, { error: "method_not_allowed" }, noStoreHeaders);
  } catch (e) {
    sendJson(res, 500, { error: "internal", message: String(e?.message || e) });
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`[visit-api] http://127.0.0.1:${PORT}  (data: ${DATA_FILE})`);
});
