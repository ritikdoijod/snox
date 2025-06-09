import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";

// middlewares
import { format } from "@/middlewares/format";
import { authn } from "@/middlewares/auth";
import { parseQueryString } from "@/middlewares/qs";

import { logger } from "@/configs/logger";

// routes
import authRoutes from "@/routes/auth";
import userRoutes from "@/routes/user";
import workspaceRoutes from "@/routes/workspace";
import memberRoutes from "@/routes/member";
import projectRoutes from "@/routes/project";
import taskRoutes from "@/routes/task";
import commentRoutes from "@/routes/comment";

const app = new Hono();
app.use(
  "/x/*",
  serveStatic({
    root: "./",
    rewriteRequestPath: (path) => path.replace(/^\/x/, "/uploads"),
  })
);

app.use(async (c, next) => {
  const start = Date.now();
  await next();
  const end = Date.now();
  c.res.headers.set("X-Response-Time", `${end - start}`);
});

app.onError((error, c) => {
  logger.error(error);
  return c.json.error(error);
});

app.use(format({ apiVersion: "0.0.1" }));
app.use(parseQueryString);
app.route("/auth", authRoutes);

app.use(authn);
app.route("/users", userRoutes);
app.route("/workspaces", workspaceRoutes);
app.route("/members", memberRoutes);
app.route("/projects", projectRoutes);
app.route("/tasks", taskRoutes);
app.route("/comments", commentRoutes);

export { app };
