// ---------------------------------------------------------------------------
// useLoad — loads data from the backend when a page opens.
//
//   const { data, error, loading, reload } = useLoad(() => listProducts(), []);
//
//   loading → true while waiting for the backend
//   data    → the result once it arrives
//   error   → an ApiError if it failed
//   reload  → call it to load again (e.g. after deactivating a product)
// ---------------------------------------------------------------------------
import { useCallback, useEffect, useState } from 'react';

export function useLoad(loadFn, deps) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const load = useCallback(loadFn, deps);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await load());
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [load]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, error, loading, reload };
}
