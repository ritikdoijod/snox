import { route, index, prefix, layout } from "@react-router/dev/routes";

export default [
  ...prefix("auth", [
    layout("./routes/auth/layout.jsx", [
      route("login", "./routes/auth/login.jsx"),
      route("logout", "./routes/auth/logout.jsx"),
      route("signup", "./routes/auth/signup.jsx"),
    ]),
  ]),
  ...prefix("workspaces", [
    index("./routes/workspaces/index.jsx"),
    layout("./routes/workspaces/layout.jsx", [
      route(":workspaceId", "./routes/workspaces/workspace.jsx"),
      route(":workspaceId/edit", "./routes/workspaces/workspace-edit.jsx"),
      route(":workspaceId/delete", "./routes/workspaces/workspace-delete.jsx"),
      route(
        ":workspaceId/settings",
        "./routes/workspaces/workspace-settings.jsx"
      ),
      route(
        ":workspaceId/members",
        "./routes/workspaces/workspace-members.jsx"
      ),
      route(
        ":workspaceId/members/:memberId",
        "./routes/workspaces/workspace-member.jsx"
      ),
      route(
        ":workspaceId/projects/:projectId",
        "./routes/workspaces/workspace-project.jsx"
      ),
    ]),
  ]),
  ...prefix("members", [index("./routes/members/index.jsx")]),
  ...prefix("projects", [index("./routes/projects/index.js")]),
];
