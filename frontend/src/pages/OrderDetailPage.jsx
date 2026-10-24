import { useState } from 'react';
import { cancelOrder, confirmOrder, getOrder, shipOrder } from '../api/orders';
import BackendTodo from '../components/BackendTodo';
import ErrorMessage from '../components/ErrorMessage';
import StatusBadge from '../components/StatusBadge';
import { COMPANY } from '../company';
import { useFeedback } from '../feedback';
import { formatMoney, formatQuantity } from '../format';
import { Link } from '../router';
import { useLoad } from '../useLoad';

// Which buttons to show for each status. This mirrors the rules the backend
// will enforce (confirm only DRAFT, ship only CONFIRMED, cancel before SHIPPED).
// The backend is still the boss: if it says no, the error is shown.
const ACTIONS_BY_STATUS = {
  DRAFT: ['confirm', 'cancel'],
  CONFIRMED: ['ship', 'cancel'],
  SHIPPED: [],
  CANCELLED: [],
};

// `ask` = show an "Are you sure?" popup first. Only for actions that can't be undone.
const ACTIONS = {
  confirm: { label: 'Confirm', run: confirmOrder, primary: true, done: 'confirmed' },
  ship: {
    label: 'Ship',
    run: shipOrder,
    primary: true,
    done: 'shipped',
    ask: { title: 'Ship this order?', message: 'A shipped order can’t be cancelled.', confirmLabel: 'Ship order' },
  },
  cancel: {
    label: 'Cancel order',
    run: cancelOrder,
    primary: false,
    done: 'cancelled',
    ask: { title: 'Cancel this order?', message: 'This can’t be undone.', confirmLabel: 'Cancel order', danger: true },
  },
};

export default function OrderDetailPage({ orderNumber }) {
  const { data: order, error, loading, reload } = useLoad(() => getOrder(orderNumber), [orderNumber]);
  const [actionError, setActionError] = useState(null);
  const [busy, setBusy] = useState(false);
  const { toast, confirm } = useFeedback();

  async function runAction(actionKey) {
    const action = ACTIONS[actionKey];
    if (action.ask && !(await confirm({ ...action.ask, title: `${action.ask.title} (${orderNumber})` }))) return;

    setBusy(true);
    setActionError(null);
    try {
      await action.run(orderNumber);
      toast(`Order ${orderNumber} ${action.done}`);
      reload();
    } catch (err) {
      setActionError(err);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="page-header no-print">
        <h1>Order {orderNumber}</h1>
        <div className="header-actions">
          {order && (
            <button className="button" onClick={() => window.print()}>
              Print / PDF
            </button>
          )}
          <Link to="/orders" className="button">
            Back
          </Link>
        </div>
      </div>

      {/* TODO(frontend): delete this box once these endpoints exist. */}
      <div className="no-print">
        <BackendTodo
          step="step 6 + status changes"
          endpoints={[
            'GET   /api/orders/{orderNumber}',
            'PATCH /api/orders/{orderNumber}/confirm',
            'PATCH /api/orders/{orderNumber}/ship',
            'PATCH /api/orders/{orderNumber}/cancel',
          ]}
        />
        <ErrorMessage error={error || actionError} />
        {loading && <p className="muted">Loading…</p>}
      </div>

      {!loading && order && (
        <div className="document">
          {/* Only shown when printing: a letterhead like a real sales order. */}
          <div className="print-only print-header">
            <div>
              <div className="print-company">{COMPANY.name}</div>
              {COMPANY.addressLines.map((line) => (
                <div key={line}>{line}</div>
              ))}
              <div>
                {COMPANY.phone} · {COMPANY.email}
              </div>
            </div>
            <div className="print-title">
              <div className="print-doc-type">SALES ORDER</div>
              <div className="mono">{order.orderNumber}</div>
            </div>
          </div>

          <div className="summary">
            <div>
              <span className="summary-label">Customer</span>
              {order.customerName ? `${order.customerName} (${order.customerNumber})` : order.customerNumber}
            </div>
            <div>
              <span className="summary-label">Date</span>
              {order.orderDate}
            </div>
            <div>
              <span className="summary-label">Status</span>
              <StatusBadge status={order.status} />
            </div>
            <div>
              <span className="summary-label">Total</span>
              <strong>{formatMoney(order.totalAmount)}</strong>
            </div>
          </div>

          <div className="form-actions no-print">
            {(ACTIONS_BY_STATUS[order.status] || []).map((key) => (
              <button
                key={key}
                className={`button ${ACTIONS[key].primary ? 'button-primary' : ''}`}
                disabled={busy}
                onClick={() => runAction(key)}
              >
                {ACTIONS[key].label}
              </button>
            ))}
          </div>

          <h2>Lines</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Product</th>
                  <th className="num">Quantity</th>
                  <th className="num">Unit price</th>
                  <th className="num">Line total</th>
                </tr>
              </thead>
              <tbody>
                {(order.lines || []).map((line, index) => (
                  <tr key={`${line.sku}-${index}`}>
                    <td className="mono">{line.sku}</td>
                    <td>{line.productName || '—'}</td>
                    <td className="num">{formatQuantity(line.quantity)}</td>
                    <td className="num">{formatMoney(line.unitPrice)}</td>
                    <td className="num">{formatMoney(line.lineTotal)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4" className="num">
                    Total
                  </td>
                  <td className="num total">{formatMoney(order.totalAmount)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <p className="print-only print-footer">Thank you for your business.</p>
        </div>
      )}
    </>
  );
}
