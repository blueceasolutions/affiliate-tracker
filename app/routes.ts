import {
  type RouteConfig,
  index,
  route,
  layout,
} from '@react-router/dev/routes'

export default [
  // index('routes/home.tsx'),
  index('routes/auth/login.tsx'),
  route('signup', 'routes/auth/signup.tsx'),
  route('ref/:code', 'routes/ref.tsx'),

  // Test Routes
  route('test/conversion', 'routes/test/conversion.tsx'),

  // Protected Routes
  layout('routes/layouts/dashboard-layout.tsx', [
    route('dashboard', 'routes/dashboard/overview.tsx'),
    route('affiliate/products', 'routes/affiliate/products.tsx'),
    route('affiliate/wallet', 'routes/affiliate/wallet.tsx'),

    // Admin Routes
    route('admin/products', 'routes/admin/products.tsx'),
    route('admin/withdrawals', 'routes/admin/withdrawals.tsx'),
  ]),
] satisfies RouteConfig
