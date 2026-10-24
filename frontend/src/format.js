// Small helpers for showing values nicely.

const moneyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export function formatMoney(value) {
  if (value === null || value === undefined || value === '') return '—';
  return moneyFormatter.format(Number(value));
}

export function formatQuantity(value) {
  if (value === null || value === undefined || value === '') return '—';
  return Number(value).toLocaleString('en-US', { maximumFractionDigits: 3 });
}

// "NON_PROFIT" → "Non profit"
export function formatEnum(value) {
  if (!value) return '—';
  const text = value.toLowerCase().replace(/_/g, ' ');
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Empty input → null, otherwise a number. Used before sending forms to the backend.
export function toNumberOrNull(value) {
  return value === '' || value === null || value === undefined ? null : Number(value);
}

// Empty input → null, otherwise the trimmed text.
export function toTextOrNull(value) {
  const text = (value ?? '').trim();
  return text === '' ? null : text;
}
