// A red box that shows what went wrong. Shows nothing when there's no error.
export default function ErrorMessage({ error }) {
  if (!error) return null;
  return (
    <div className="alert alert-error" role="alert">
      {error.message || String(error)}
    </div>
  );
}
