import BackendTodo from './BackendTodo';

// A "coming soon" page for modules that aren't built yet.
// Everything it shows comes from that module's entry in navigation.js.
export default function PlaceholderPage({ item }) {
  return (
    <>
      <div className="page-header">
        <h1>{item.label}</h1>
        <span className="badge badge-neutral">Planned</span>
      </div>

      <p className="lead">{item.description}</p>

      {item.features?.length > 0 && (
        <div className="panel">
          <h2 className="panel-title">What this module will do</h2>
          <ul className="checklist">
            {item.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>
      )}

      {item.endpoints?.length > 0 && <BackendTodo step="planned" endpoints={item.endpoints} />}
    </>
  );
}
