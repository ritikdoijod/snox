import { route, index, prefix, layout } from "@react-router/dev/routes";

export default [
  index("./routes/home.jsx"),
  layout("./routes/layout.jsx", [
    ...prefix("auth", [
      layout("./routes/auth/layout.jsx", [
        route("login", "./routes/auth/login.jsx"),
        route("signup", "./routes/auth/signup.jsx"),
        route("callback/google", "./routes/auth/callback/google.js"),
        route("logout", "./routes/auth/logout.jsx"),
      ]),
    ]),
    route("profile", "./routes/users/profile.jsx"),
    ...prefix("workspaces", [
      index("./routes/workspaces/index.jsx"),
      route("new", "./routes/workspaces/new.jsx"),
      layout("./routes/workspaces/layout.jsx", [
        route(":workspaceId", "./routes/workspaces/workspace.jsx"),
        route(":workspaceId/settings", "./routes/workspaces/settings.jsx"),
        route(":workspaceId/members", "./routes/workspaces/members/index.jsx"),

        ...prefix(":workspaceId/projects", [
          index("./routes/workspaces/projects/index.jsx"),
          route("new", "./routes/workspaces/projects/new.jsx"),
          layout("./routes/workspaces/projects/layout.jsx", [
            route(":projectId", "./routes/workspaces/projects/project.jsx"),
            route(
              ":projectId/settings",
              "./routes/workspaces/projects/settings.jsx"
            ),
            ...prefix(":projectId/tasks", [
              index("./routes/workspaces/tasks/index.jsx"),
              route("new", "./routes/workspaces/tasks/new.jsx"),
              route(":taskId", "./routes/workspaces/tasks/task.jsx"),
            ]),
          ]),
        ]),
      ]),
    ]),
  ]),
  route("comments", "./routes/workspaces/comments/index.js"),
];
