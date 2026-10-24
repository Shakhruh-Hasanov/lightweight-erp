// ---------------------------------------------------------------------------
// router.jsx — a tiny page switcher, so we don't need an extra library.
//
// The current page lives in the URL after the "#":
//   http://localhost:5173/#/products         → products list
//   http://localhost:5173/#/orders/SO-000001  → one order
//
// When the part after "#" changes, React shows a different page.
// ---------------------------------------------------------------------------
import { useEffect, useState } from 'react';

function currentPath() {
  return window.location.hash.slice(1) || '/';
}

// Gives the component the current path and re-renders when it changes.
export function useCurrentPath() {
  const [path, setPath] = useState(currentPath);

  useEffect(() => {
    const onChange = () => setPath(currentPath());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return path;
}

// Go to another page from code, e.g. after saving a form.
export function navigate(path) {
  window.location.hash = path;
}

// A link to another page: <Link to="/products">Products</Link>
export function Link({ to, children, ...rest }) {
  return (
    <a href={`#${to}`} {...rest}>
      {children}
    </a>
  );
}

// Checks a path against a pattern like "/orders/:orderNumber".
// Returns the values, e.g. { orderNumber: "SO-000001" }, or null if it doesn't match.
export function matchPath(pattern, path) {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = path.split('/').filter(Boolean);
  if (patternParts.length !== pathParts.length) return null;

  const params = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      params[patternParts[i].slice(1)] = decodeURIComponent(pathParts[i]);
    } else if (patternParts[i] !== pathParts[i]) {
      return null;
    }
  }
  return params;
}
