import { useState } from 'react';
import { createOrder } from '../api/orders';
import { listProducts } from '../api/products';
import BackendTodo from '../components/BackendTodo';
import ErrorMessage from '../components/ErrorMessage';
import Field from '../components/Field';
import { formatMoney, toNumberOrNull, toTextOrNull } from '../format';
import { useFeedback } from '../feedback';
import { Link, navigate } from '../router';
import { useLoad } from '../useLoad';

const EMPTY_LINE = { sku: '', quantity: '1' };

// Rounds like Java's RoundingMode.HALF_UP to 2 decimals (for the preview only).
function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export default function OrderCreatePage() {
  // The product picker uses your existing GET /api/products, so it works today.
  const { data: products, error: productsError } = useLoad(() => listProducts(), []);
  const [customerNumber, setCustomerNumber] = useState('');
  const [lines, setLines] = useState([EMPTY_LINE]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useFeedback();

  const productBySku = Object.fromEntries((products || []).map((product) => [product.sku, product]));

  function updateLine(index, fieldName, value) {
    setLines(lines.map((line, i) => (i === index ? { ...line, [fieldName]: value } : line)));
  }

  function addLine() {
    setLines([...lines, EMPTY_LINE]);
  }

  function removeLine(index) {
    setLines(lines.filter((_, i) => i !== index));
  }

  // Preview only: the backend does the real calculation in SalesOrder.addLine().
  function previewLineTotal(line) {
    const product = productBySku[line.sku];
    const quantity = Number(line.quantity);
    if (!product || !quantity) return null;
    return roundMoney(quantity * Number(product.sellingPrice));
  }

  const previewTotal = lines.reduce((sum, line) => sum + (previewLineTotal(line) || 0), 0);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    // Exactly the shape of your CreateOrderRequest + OrderLineRequest records.
    const request = {
      customerNumber: toTextOrNull(customerNumber),
      lines: lines.map((line) => ({ sku: toTextOrNull(line.sku), quantity: toNumberOrNull(line.quantity) })),
    };

    try {
      const order = await createOrder(request);
      toast(`Order ${order.orderNumber} created`);
      navigate(`/orders/${encodeURIComponent(order.orderNumber)}`);
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  }

  const fieldErrors = error?.fieldErrors || {};

  return (
    <>
      <div className="page-header">
        <h1>New order</h1>
        <Link to="/orders" className="button">
          Back
        </Link>
      </div>

      {/* TODO(frontend): delete this box once POST /api/orders exists. */}
      <BackendTodo step="steps 5b-4 and 6" endpoints={['POST /api/orders']} />

      <ErrorMessage error={productsError || error} />

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <Field
            label="Customer number"
            name="customerNumber"
            error={fieldErrors.customerNumber}
            hint="Must be an ACTIVE customer."
          >
            <input
              id="customerNumber"
              value={customerNumber}
              onChange={(event) => setCustomerNumber(event.target.value)}
              placeholder="CUST-0001"
            />
          </Field>
        </div>

        <h2>Lines</h2>
        {fieldErrors.lines && <div className="field-error">{fieldErrors.lines}</div>}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th className="num">Quantity</th>
                <th className="num">Unit price</th>
                <th className="num">Line total</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {lines.map((line, index) => {
                const product = productBySku[line.sku];
                return (
                  <tr key={index}>
                    <td>
                      <select
                        aria-label="Product"
                        value={line.sku}
                        onChange={(event) => updateLine(index, 'sku', event.target.value)}
                      >
                        <option value="">Choose a product…</option>
                        {(products || []).map((p) => (
                          // Inactive products are listed but can't be picked: the backend would reject them.
                          <option key={p.sku} value={p.sku} disabled={!p.active}>
                            {p.sku} — {p.name}
                            {p.active ? '' : ' (inactive)'}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="num">
                      <input
                        aria-label="Quantity"
                        className="input-qty"
                        type="number"
                        step="0.001"
                        min="0"
                        value={line.quantity}
                        onChange={(event) => updateLine(index, 'quantity', event.target.value)}
                      />
                    </td>
                    <td className="num">{product ? formatMoney(product.sellingPrice) : '—'}</td>
                    <td className="num">{formatMoney(previewLineTotal(line))}</td>
                    <td className="actions">
                      {lines.length > 1 && (
                        <button type="button" className="button button-small" onClick={() => removeLine(index)}>
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="num">
                  Estimated total
                </td>
                <td className="num total">{formatMoney(previewTotal)}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="form-actions">
          <button type="button" className="button" onClick={addLine}>
            Add line
          </button>
          <button type="submit" className="button button-primary" disabled={saving}>
            {saving ? 'Creating…' : 'Create order'}
          </button>
        </div>
        <p className="muted">The total here is a preview. The backend calculates the real total when it saves.</p>
      </form>
    </>
  );
}
