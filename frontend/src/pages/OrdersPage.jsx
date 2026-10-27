import { listOrders, ORDER_STATUSES } from '../api/orders';
import BackendTodo from '../components/BackendTodo';
import ErrorMessage from '../components/ErrorMessage';
import StatusBadge from '../components/StatusBadge';
import TableToolbar, { SortHeader } from '../components/TableToolbar';
import { formatMoney } from '../format';
import { Link } from '../router';
import { useLoad } from '../useLoad';
import { useTableControls } from '../useTableControls';

export default function OrdersPage() {
  const { data: orders, error, loading } = useLoad(() => listOrders(), []);

  const table = useTableControls(orders, {
    searchFields: ['orderNumber', 'customerNumber', 'customerName'],
    filters: { status: (order) => order.status },
    initialSort: { key: 'orderNumber', direction: 'desc' }, // newest first
  });

  return (
    <>
      <div className="page-header">
        <h1>Orders</h1>
        <Link to="/orders/new" className="button button-primary">
          New order
        </Link>
      </div>

      {/* TODO(frontend): delete this box once SalesOrderController exists. */}
      <BackendTodo step="step 6" endpoints={['GET  /api/orders']} />

      <ErrorMessage error={error} />

      {loading && <p className="muted">Loading…</p>}

      {!loading && orders && orders.length === 0 && <div className="empty">No orders yet.</div>}

      {!loading && orders && orders.length > 0 && (
        <>
        <TableToolbar
          table={table}
          placeholder="Search order number or customer…"
          filters={[{ name: 'status', label: 'Statuses', options: ORDER_STATUSES }]}
          exportName="orders"
          exportColumns={['Order', 'Customer', 'Date', 'Status', 'Total']}
          exportPick={(order) => [
            order.orderNumber,
            order.customerName,
            order.orderDate,
            order.status,
            order.totalAmount,
          ]}
        />
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <SortHeader table={table} column="orderNumber">Order</SortHeader>
                <SortHeader table={table} column="customerName">Customer</SortHeader>
                <SortHeader table={table} column="orderDate">Date</SortHeader>
                <SortHeader table={table} column="status">Status</SortHeader>
                <SortHeader table={table} column="totalAmount" className="num">Total</SortHeader>
              </tr>
            </thead>
            <tbody>
              {table.rows.length === 0 && (
                <tr>
                  <td colSpan="5" className="no-match">No orders match your search.</td>
                </tr>
              )}
              {table.rows.map((order) => (
                <tr key={order.orderNumber}>
                  <td className="mono">
                    <Link to={`/orders/${encodeURIComponent(order.orderNumber)}`}>{order.orderNumber}</Link>
                  </td>
                  <td>{order.customerName || order.customerNumber}</td>
                  <td>{order.orderDate}</td>
                  <td>
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="num">{formatMoney(order.totalAmount)}</td>
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
