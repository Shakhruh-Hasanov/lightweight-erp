// One labelled form input, with the backend's validation message under it.
// `error` comes from ApiError.fieldErrors, e.g. { sku: "must not be blank" }.
export default function Field({ label, name, error, children, hint }) {
  return (
    <label className={`field ${error ? 'field-has-error' : ''}`} htmlFor={name}>
      <span className="field-label">{label}</span>
      {children}
      {hint && !error && <span className="field-hint">{hint}</span>}
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}
