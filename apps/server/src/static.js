import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { logger } from "@/configs/logger";

const app = new Hono();

// serve static files
app.use(
  '/x/*',
  serveStatic({
    root: './',
    rewriteRequestPath: (path) =>
      path.replace(/^\/x/, '/uploads'),
  })
)


serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    logger.info(
      `Static file server is running on http://localhost:${info.port}`
    );
  }
);

