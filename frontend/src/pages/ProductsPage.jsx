import { useState } from 'react';
import { deactivateProduct, listProducts } from '../api/products';
import ErrorMessage from '../components/ErrorMessage';
import StatusBadge from '../components/StatusBadge';
import TableToolbar, { SortHeader } from '../components/TableToolbar';
import { useFeedback } from '../feedback';
import { formatEnum, formatMoney } from '../format';
import { Link } from '../router';
import { useLoad } from '../useLoad';
import { useTableControls } from '../useTableControls';

const productStatus = (product) => (product.active ? 'ACTIVE' : 'INACTIVE');

export default function ProductsPage() {
  const { data: products, error, loading, reload } = useLoad(() => listProducts(), []);
  const [actionError, setActionError] = useState(null);
  const { toast, confirm } = useFeedback();

  const table = useTableControls(products, {
    searchFields: ['sku', 'name', 'description'],
    filters: { status: productStatus },
    initialSort: { key: 'sku', direction: 'asc' },
  });

  async function handleDeactivate(product) {
    const ok = await confirm({
      title: `Deactivate ${product.sku}?`,
      message: `"${product.name}" can't be added to new orders while it's inactive.`,
      confirmLabel: 'Deactivate',
      danger: true,
    });
    if (!ok) return;

    setActionError(null);
    try {
      await deactivateProduct(product.sku);
      toast(`${product.sku} deactivated`);
      reload();
    } catch (err) {
      setActionError(err);
    }
  }

  return (
    <>
      <div className="page-header">
        <h1>Products</h1>
        <Link to="/products/new" className="button button-primary">
          New product
        </Link>
      </div>

      <p className="muted">
        New products start as <strong>inactive</strong> until they're approved. The approval workflow is on the
        backlog.
      </p>

      <ErrorMessage error={error || actionError} />

      {loading && <p className="muted">Loading…</p>}

      {!loading && products && products.length === 0 && (
        <div className="empty">No products yet. Create your first one.</div>
      )}

      {!loading && products && products.length > 0 && (
        <>
        <TableToolbar
          table={table}
          placeholder="Search SKU, name or description…"
          filters={[{ name: 'status', label: 'Statuses', options: ['ACTIVE', 'INACTIVE'] }]}
        />
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <SortHeader table={table} column="sku">SKU</SortHeader>
                <SortHeader table={table} column="name">Name</SortHeader>
                <SortHeader table={table} column="unitOfMeasure">Unit</SortHeader>
                <SortHeader table={table} column="costPrice" className="num">Cost</SortHeader>
                <SortHeader table={table} column="sellingPrice" className="num">Price</SortHeader>
                <SortHeader table={table} column="active">Status</SortHeader>
                <th />
              </tr>
            </thead>
            <tbody>
              {table.rows.length === 0 && (
                <tr>
                  <td colSpan="7" className="no-match">No products match your search.</td>
                </tr>
              )}
              {table.rows.map((product) => (
                <tr key={product.sku}>
                  <td className="mono">{product.sku}</td>
                  <td>{product.name}</td>
                  <td>{formatEnum(product.unitOfMeasure)}</td>
                  <td className="num">{formatMoney(product.costPrice)}</td>
                  <td className="num">{formatMoney(product.sellingPrice)}</td>
                  {/* Your Java field is "isActive", but Jackson sends it as "active". */}
                  <td>
                    <StatusBadge status={product.active ? 'ACTIVE' : 'INACTIVE'} />
                  </td>
                  <td className="actions">
                    <Link to={`/products/${encodeURIComponent(product.sku)}/edit`} className="button button-small">
                      Edit
                    </Link>
                    {product.active && (
                      <button className="button button-small" onClick={() => handleDeactivate(product)}>
                        Deactivate
                      </button>
                    )}
                    {/* TODO(backend — approval workflow): add an "Approve" button for inactive products. */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      )}
    </>
  );
}
