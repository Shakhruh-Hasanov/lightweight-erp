// A yellow box that reminds you which backend endpoints this page still needs.
// Delete it from a page once you've built those endpoints.
export default function BackendTodo({ step, endpoints }) {
  return (
    <div className="alert alert-todo">
      <strong>Backend TODO{step ? ` (${step})` : ''}:</strong> this page needs these endpoints in Spring.
      <ul>
        {endpoints.map((endpoint) => (
          <li key={endpoint}>
            <code>{endpoint}</code>
          </li>
        ))}
      </ul>
    </div>
  );
}
