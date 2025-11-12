import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("logout", "routes/logout.tsx"),
  ...prefix("auth", [
    layout("routes/auth/layout.tsx", [route("login", "routes/auth/login.tsx")]),
  ]),
  ...prefix("dashboard", [
    layout("routes/dashboard/layout.tsx", [
      index("routes/dashboard/dashboard.tsx"),
      ...prefix("users", [
        index("routes/dashboard/users/users.tsx"),
        route("create", "routes/dashboard/users/new.tsx"),
        route("edit/:id", "routes/dashboard/users/$id.edit.tsx"),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
