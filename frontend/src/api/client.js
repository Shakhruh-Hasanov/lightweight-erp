// ---------------------------------------------------------------------------
// client.js — the ONE place that talks to the Spring backend.
//
// Every other api file (products.js, customers.js, orders.js) calls
// apiRequest(). It turns the backend's responses into either:
//   - data (when the request worked), or
//   - an ApiError with a readable message (when it didn't).
// ---------------------------------------------------------------------------

export class ApiError extends Error {
  constructor(status, message, fieldErrors = null) {
    super(message);
    this.status = status;
    // For 400 validation errors your GlobalExceptionHandler returns
    // { "fieldName": "message", ... } — we keep that so forms can show
    // the message right under the matching input.
    this.fieldErrors = fieldErrors;
  }
}

export async function apiRequest(path, { method = 'GET', body } = {}) {
  let response;
  try {
    response = await fetch(`/api${path}`, {
      method,
      headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, 'Cannot reach the backend. Is Spring Boot running on port 8080?');
  }

  const text = await response.text();
  const data = text ? parseJson(text) : null;

  if (response.ok) {
    return data;
  }

  throw toApiError(response.status, data, method, path);
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// Turns each kind of backend error into a clear message.
function toApiError(status, data, method, path) {
  // 1. Your own handlers: { "error": "Product with SKU X not found" }
  //    (Spring's default error page ALSO has an "error" key, but it comes with
  //    "timestamp" and "path", so we check for those first.)
  const isSpringDefaultError = data && data.timestamp && data.path;

  if (data && typeof data.error === 'string' && !isSpringDefaultError) {
    return new ApiError(status, data.error);
  }

  // 2. Validation errors: { "sku": "must not be blank", "name": "..." }
  if (status === 400 && data && !isSpringDefaultError && typeof data === 'object') {
    return new ApiError(status, 'Please fix the highlighted fields.', data);
  }

  // 3. The endpoint doesn't exist yet (you haven't built it in Java).
  if (status === 404 || status === 405) {
    return new ApiError(
      status,
      `The backend doesn't have ${method} /api${path} yet. Build it in Spring, then try again.`
    );
  }

  // 4. The dev server couldn't reach Spring at all (proxy error, empty body).
  if (!data && status >= 500) {
    return new ApiError(status, 'Cannot reach the backend. Is Spring Boot running on port 8080?');
  }

  // 5. Anything else, e.g. an unexpected Java exception.
  return new ApiError(status, `The server returned an error (${status}). Check the Spring console for details.`);
}
