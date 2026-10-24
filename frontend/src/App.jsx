import Layout from './components/Layout';
import PlaceholderPage from './components/PlaceholderPage';
import { NAV_ITEMS } from './navigation';
import CustomersPage from './pages/CustomersPage';
import HomePage from './pages/HomePage';
import OrderCreatePage from './pages/OrderCreatePage';
import OrderDetailPage from './pages/OrderDetailPage';
import OrdersPage from './pages/OrdersPage';
import ProductFormPage from './pages/ProductFormPage';
import ProductsPage from './pages/ProductsPage';
import { matchPath, useCurrentPath } from './router';

// Pages that have their own file. The first pattern that matches the URL wins,
// so "/orders/new" must come before "/orders/:orderNumber".
const ROUTES = [
  { pattern: '/', render: () => <HomePage /> },
  { pattern: '/products', render: () => <ProductsPage /> },
  { pattern: '/products/new', render: () => <ProductFormPage /> },
  { pattern: '/products/:sku/edit', render: ({ sku }) => <ProductFormPage key={sku} sku={sku} /> },
  { pattern: '/customers', render: () => <CustomersPage /> },
  { pattern: '/orders', render: () => <OrdersPage /> },
  { pattern: '/orders/new', render: () => <OrderCreatePage /> },
  { pattern: '/orders/:orderNumber', render: ({ orderNumber }) => <OrderDetailPage key={orderNumber} orderNumber={orderNumber} /> },
];

// Modules marked 'planned' in navigation.js get a placeholder page automatically.
const PLACEHOLDER_ROUTES = NAV_ITEMS.filter((item) => item.status === 'planned').map((item) => ({
  pattern: item.to,
  render: () => <PlaceholderPage item={item} />,
}));

export default function App() {
  const path = useCurrentPath();

  let page = (
    <div className="empty">
      Page not found. <a href="#/">Back to the dashboard</a>
    </div>
  );
  for (const route of [...ROUTES, ...PLACEHOLDER_ROUTES]) {
    const params = matchPath(route.pattern, path);
    if (params) {
      page = route.render(params);
      break;
    }
  }

  return <Layout currentPath={path}>{page}</Layout>;
}
