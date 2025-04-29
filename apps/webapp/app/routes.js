import { route, prefix, layout } from "@react-router/dev/routes";

export default [
  ...prefix("auth", [
    layout("./routes/auth/layout.jsx", [
      route("login", "./routes/auth/login.jsx"),
      route("logout", "./routes/auth/logout.jsx"),
      route("signup", "./routes/auth/signup.jsx"),
    ])
  ]),
  ...prefix("dashboard", [
    layout("./routes/dashboard/layout.jsx", [
      route("test", "./routes/dashboard/dtest.jsx")
    ])
  ])
];
