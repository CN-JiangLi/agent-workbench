/**
 * Standalone visit counter HTTP server (production / optional local).
 *
 * Usage: node server/visit-api.mjs
 * Env: VISIT_API_PORT (default 3948), VISIT_COUNTER_FILE (optional)
 */
import http from "node:http";
import { handleVisitsApi } from "./visit-handler.mjs";

const PORT = Number(process.env.VISIT_API_PORT || 3948);

const server = http.createServer((req, res) => {
  void handleVisitsApi(req, res);
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`[visit-api] http://127.0.0.1:${PORT}`);
});
