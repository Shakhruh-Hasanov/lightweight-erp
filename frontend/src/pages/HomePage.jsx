import { listProducts } from '../api/products';
import Icon from '../components/Icon';
import { NAV_SECTIONS } from '../navigation';
import { Link } from '../router';
import { useLoad } from '../useLoad';

const STATUS_LABEL = { ready: 'Ready', todo: 'Backend TODO', planned: 'Planned' };
const STATUS_BADGE = { ready: 'badge-good', todo: 'badge-todo', planned: 'badge-neutral' };

// The dashboard: is the backend running, and a card for every module.
// The cards come from navigation.js, so new modules show up here automatically.
export default function HomePage() {
  // We ask for the product list just to check that Spring is reachable.
  const { data: products, error, loading } = useLoad(() => listProducts(), []);

  const activeProducts = (products || []).filter((product) => product.active).length;

  return (
    <>
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>

      <div className={`alert ${loading ? '' : error ? 'alert-error' : 'alert-ok'}`}>
        {loading && 'Checking the backend…'}
        {!loading && !error && 'Backend connected ✓ (Spring Boot is answering on port 8080)'}
        {!loading && error && error.message}
      </div>

      {/* Quick numbers. Add more tiles here as you build more endpoints. */}
      <div className="stats">
        <div className="stat">
          <span className="stat-label">Products</span>
          <span className="stat-value">{products ? products.length : '—'}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Active products</span>
          <span className="stat-value">{products ? activeProducts : '—'}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Customers</span>
          <span className="stat-value">—</span>
          <span className="stat-hint">needs GET /api/customers</span>
        </div>
        <div className="stat">
          <span className="stat-label">Open orders</span>
          <span className="stat-value">—</span>
          <span className="stat-hint">needs GET /api/orders</span>
        </div>
      </div>

      {NAV_SECTIONS.filter((section) => section.title).map((section) => (
        <section key={section.title}>
          <h2>{section.title}</h2>
          <div className="cards">
            {section.items.map((item) => (
              <Link key={item.to} to={item.to} className="card">
                <div className="card-title">
                  <span className="card-name">
                    <Icon name={item.icon} />
                    {item.label}
                  </span>
                  <span className={`badge ${STATUS_BADGE[item.status]}`}>{STATUS_LABEL[item.status]}</span>
                </div>
                {item.description && <p>{item.description}</p>}
              </Link>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
