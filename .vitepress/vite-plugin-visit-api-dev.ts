import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import type { Plugin } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const handlerModuleUrl = pathToFileURL(path.join(projectRoot, "server", "visit-handler.mjs")).href;

/** Serve /api/visits inside `vitepress dev` so计数无需单独跑 visit-server。 */
export function visitApiDevPlugin(): Plugin {
  return {
    name: "mcp-docs-visit-api-dev",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const pathname = (req.url ?? "").split(/[?#]/)[0] ?? "";
        if (!pathname.startsWith("/api/visits")) {
          next();
          return;
        }
        void import(handlerModuleUrl)
          .then(({ handleVisitsApi }) => handleVisitsApi(req, res))
          .catch((err: unknown) => {
            res.statusCode = 500;
            res.setHeader("Content-Type", "text/plain; charset=utf-8");
            res.end(`visit-api dev error: ${String(err)}`);
          });
      });
    },
  };
}
