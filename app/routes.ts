import {
  index,
  layout,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  // Public / Auth Routes
  index("home.tsx"),
  route("signup", "signup.tsx"),
  route("forgot-password", "forgot-password.tsx"),
  route("reset-password", "reset-password.tsx"),

  // App / API Routes
  route("ref/:code", "routes/ref.tsx"),

  // Test Routes
  route("test/conversion", "routes/test/conversion.tsx"),

  // Protected Routes
  layout("routes/layouts/dashboard-layout.tsx", [
    route("dashboard", "routes/dashboard/overview.tsx"),
    route("affiliate/products", "routes/affiliate/products.tsx"),
    route("affiliate/wallet", "routes/affiliate/wallet.tsx"),

    // Admin Routes
    route("admin/products", "routes/admin/products.tsx"),
    route("admin/withdrawals", "routes/admin/withdrawals.tsx"),
  ]),
] satisfies RouteConfig;
