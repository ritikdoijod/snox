import { Hono } from "hono";

// middlewares
import { format } from "@/middlewares/format";
import { authn } from "@/middlewares/auth";
import { parseQueryString } from "@/middlewares/qs";

// routes
import authRoutes from "@/routes/auth";
import userRoutes from "@/routes/user";
import workspaceRoutes from "@/routes/workspace";
import memberRoutes from "@/routes/member";
import projectRoutes from "@/routes/project";
import eventRoutes from "@/routes/event";

const app = new Hono();

app.use(async (c, next) => {
  const start = Date.now();
  await next();
  const end = Date.now();
  c.res.headers.set("X-Response-Time", `${end - start}`);
});

app.onError((error, c) => {
  console.log(error);
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
app.route("/events", eventRoutes);

export { app };
