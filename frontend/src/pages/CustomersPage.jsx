import { useState } from 'react';
import { createCustomer, CUSTOMER_TYPES, listCustomers } from '../api/customers';
import BackendTodo from '../components/BackendTodo';
import ErrorMessage from '../components/ErrorMessage';
import Field from '../components/Field';
import StatusBadge from '../components/StatusBadge';
import TableToolbar, { SortHeader } from '../components/TableToolbar';
import { useFeedback } from '../feedback';
import { formatEnum, toTextOrNull } from '../format';
import { useLoad } from '../useLoad';
import { useTableControls } from '../useTableControls';

const EMPTY_FORM = { customerNumber: '', displayName: '', customerType: 'INDIVIDUAL', email: '', phone: '' };

export default function CustomersPage() {
  const { data: customers, error, loading, reload } = useLoad(() => listCustomers(), []);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const { toast } = useFeedback();

  const table = useTableControls(customers, {
    searchFields: ['customerNumber', 'displayName', 'email', 'phone'],
    filters: { status: (c) => c.customerStatus, type: (c) => c.customerType },
    initialSort: { key: 'customerNumber', direction: 'asc' },
  });

  function update(fieldName) {
    return (event) => setForm({ ...form, [fieldName]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setSaveError(null);
    try {
      await createCustomer({
        customerNumber: toTextOrNull(form.customerNumber),
        displayName: toTextOrNull(form.displayName),
        customerType: form.customerType,
        email: toTextOrNull(form.email),
        phone: toTextOrNull(form.phone),
      });
      toast(`Customer ${form.customerNumber} added`);
      setForm(EMPTY_FORM);
      reload();
    } catch (err) {
      setSaveError(err);
    } finally {
      setSaving(false);
    }
  }

  const fieldErrors = saveError?.fieldErrors || {};

  return (
    <>
      <div className="page-header">
        <h1>Customers</h1>
      </div>

      {/* TODO(frontend): delete this box once the endpoints below exist. */}
      <BackendTodo
        step="CustomerController"
        endpoints={['GET  /api/customers', 'POST /api/customers']}
      />

      <ErrorMessage error={error} />

      {loading && <p className="muted">Loading…</p>}

      {!loading && customers && customers.length === 0 && <div className="empty">No customers yet.</div>}

      {!loading && customers && customers.length > 0 && (
        <>
        <TableToolbar
          table={table}
          placeholder="Search number, name, email or phone…"
          filters={[
            { name: 'status', label: 'Statuses', options: ['ACTIVE', 'INACTIVE', 'BLOCKED'] },
            { name: 'type', label: 'Types', options: CUSTOMER_TYPES },
          ]}
        />
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <SortHeader table={table} column="customerNumber">Number</SortHeader>
                <SortHeader table={table} column="displayName">Name</SortHeader>
                <SortHeader table={table} column="customerType">Type</SortHeader>
                <SortHeader table={table} column="email">Email</SortHeader>
                <th>Phone</th>
                <SortHeader table={table} column="customerStatus">Status</SortHeader>
              </tr>
            </thead>
            <tbody>
              {table.rows.length === 0 && (
                <tr>
                  <td colSpan="6" className="no-match">No customers match your search.</td>
                </tr>
              )}
              {table.rows.map((customer) => (
                <tr key={customer.customerNumber}>
                  <td className="mono">{customer.customerNumber}</td>
                  <td>{customer.displayName}</td>
                  <td>{formatEnum(customer.customerType)}</td>
                  <td>{customer.email || '—'}</td>
                  <td>{customer.phone || '—'}</td>
                  <td>
                    <StatusBadge status={customer.customerStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      )}

      <h2>Add a customer</h2>
      <ErrorMessage error={saveError} />
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <Field label="Customer number" name="customerNumber" error={fieldErrors.customerNumber}>
            <input id="customerNumber" value={form.customerNumber} onChange={update('customerNumber')} placeholder="CUST-0001" />
          </Field>
          <Field label="Display name" name="displayName" error={fieldErrors.displayName}>
            <input id="displayName" value={form.displayName} onChange={update('displayName')} placeholder="John Adams" />
          </Field>
          <Field label="Type" name="customerType" error={fieldErrors.customerType}>
            <select id="customerType" value={form.customerType} onChange={update('customerType')}>
              {CUSTOMER_TYPES.map((type) => (
                <option key={type} value={type}>
                  {formatEnum(type)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Email" name="email" error={fieldErrors.email}>
            <input id="email" type="email" value={form.email} onChange={update('email')} />
          </Field>
          <Field label="Phone" name="phone" error={fieldErrors.phone}>
            <input id="phone" value={form.phone} onChange={update('phone')} />
          </Field>
        </div>
        <div className="form-actions">
          <button type="submit" className="button button-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Add customer'}
          </button>
        </div>
      </form>
    </>
  );
}
