// A small coloured label, e.g. ACTIVE / DRAFT / SHIPPED.
const TONES = {
  ACTIVE: 'good',
  CONFIRMED: 'info',
  SHIPPED: 'good',
  DRAFT: 'neutral',
  INACTIVE: 'neutral',
  CANCELLED: 'bad',
  BLOCKED: 'bad',
};

export default function StatusBadge({ status }) {
  const tone = TONES[status] || 'neutral';
  return <span className={`badge badge-${tone}`}>{status ?? '—'}</span>;
}
