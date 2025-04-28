import { route, prefix, layout } from "@react-router/dev/routes";

export default [
  ...prefix("auth", [
    layout("./routes/auth/layout.jsx", [
      route("login", "./routes/auth/login.jsx"),
      route("signup", "./routes/auth/signup.jsx"),
    ])
  ])
];
