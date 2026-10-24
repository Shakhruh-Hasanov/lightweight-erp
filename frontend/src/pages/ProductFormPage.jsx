import { useEffect, useState } from 'react';
import { createProduct, getProduct, UNITS_OF_MEASURE, updateProduct } from '../api/products';
import ErrorMessage from '../components/ErrorMessage';
import Field from '../components/Field';
import { formatEnum, toNumberOrNull, toTextOrNull } from '../format';
import { useFeedback } from '../feedback';
import { Link, navigate } from '../router';

const EMPTY_FORM = {
  sku: '',
  name: '',
  description: '',
  unitOfMeasure: 'EACH',
  costPrice: '',
  sellingPrice: '',
  color: '',
  size: '',
};

// One page for both "new product" and "edit product".
// If `sku` is given we're editing, otherwise we're creating.
export default function ProductFormPage({ sku }) {
  const isEdit = Boolean(sku);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useFeedback();

  // When editing, load the product and fill the form with it.
  useEffect(() => {
    if (!isEdit) return;
    getProduct(sku)
      .then((product) =>
        setForm({
          sku: product.sku,
          name: product.name ?? '',
          description: product.description ?? '',
          unitOfMeasure: product.unitOfMeasure ?? 'EACH',
          costPrice: product.costPrice ?? '',
          sellingPrice: product.sellingPrice ?? '',
          color: product.color ?? '',
          size: product.size ?? '',
        })
      )
      .catch(setError)
      .finally(() => setLoading(false));
  }, [isEdit, sku]);

  function update(fieldName) {
    return (event) => setForm({ ...form, [fieldName]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    // The same fields your ProductUpdateRequest record has.
    const body = {
      name: toTextOrNull(form.name),
      description: toTextOrNull(form.description),
      unitOfMeasure: form.unitOfMeasure,
      costPrice: toNumberOrNull(form.costPrice),
      sellingPrice: toNumberOrNull(form.sellingPrice),
      color: toTextOrNull(form.color),
      size: toTextOrNull(form.size),
    };

    try {
      if (isEdit) {
        await updateProduct(sku, body);
        toast(`${sku} saved`);
      } else {
        const created = await createProduct({ sku: toTextOrNull(form.sku), ...body });
        toast(`${created?.sku ?? 'Product'} created — it's inactive until approved`);
      }
      navigate('/products');
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  }

  const fieldErrors = error?.fieldErrors || {};

  if (loading) return <p className="muted">Loading…</p>;

  return (
    <>
      <div className="page-header">
        <h1>{isEdit ? `Edit ${sku}` : 'New product'}</h1>
        <Link to="/products" className="button">
          Back
        </Link>
      </div>

      <ErrorMessage error={error} />

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <Field label="SKU" name="sku" error={fieldErrors.sku} hint={isEdit ? 'SKU can’t be changed.' : undefined}>
            <input id="sku" value={form.sku} onChange={update('sku')} disabled={isEdit} placeholder="TAPE-100" />
          </Field>

          <Field label="Name" name="name" error={fieldErrors.name}>
            <input id="name" value={form.name} onChange={update('name')} placeholder="Medium Shipping Tape" />
          </Field>

          <Field label="Unit of measure" name="unitOfMeasure" error={fieldErrors.unitOfMeasure}>
            <select id="unitOfMeasure" value={form.unitOfMeasure} onChange={update('unitOfMeasure')}>
              {UNITS_OF_MEASURE.map((unit) => (
                <option key={unit} value={unit}>
                  {formatEnum(unit)}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Cost price" name="costPrice" error={fieldErrors.costPrice}>
            <input id="costPrice" type="number" step="0.01" min="0" value={form.costPrice} onChange={update('costPrice')} />
          </Field>

          <Field label="Selling price" name="sellingPrice" error={fieldErrors.sellingPrice}>
            <input
              id="sellingPrice"
              type="number"
              step="0.01"
              min="0"
              value={form.sellingPrice}
              onChange={update('sellingPrice')}
            />
          </Field>

          <Field label="Color" name="color" error={fieldErrors.color}>
            <input id="color" value={form.color} onChange={update('color')} />
          </Field>

          <Field label="Size" name="size" error={fieldErrors.size}>
            <input id="size" value={form.size} onChange={update('size')} />
          </Field>

          <Field label="Description" name="description" error={fieldErrors.description}>
            <textarea id="description" rows="3" value={form.description} onChange={update('description')} />
          </Field>
        </div>

        <div className="form-actions">
          <button type="submit" className="button button-primary" disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create product'}
          </button>
        </div>
      </form>
    </>
  );
}
