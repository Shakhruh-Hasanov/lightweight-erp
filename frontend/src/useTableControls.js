// ---------------------------------------------------------------------------
// useTableControls — search, filter and sort for any table, all in the browser.
//
//   const table = useTableControls(products, {
//     searchFields: ['sku', 'name'],                     // which fields the search box looks in
//     filters: { status: (product) => (product.active ? 'ACTIVE' : 'INACTIVE') },
//     initialSort: { key: 'sku', direction: 'asc' },
//   });
//
//   table.rows                  → the rows after search + filter + sort
//   table.search / setSearch    → the search box text
//   table.filterValues / setFilter('status', 'ACTIVE')
//   table.sort / toggleSort('name')
//
// Doing this in the browser is fine for hundreds of rows. When you have
// thousands, the backend should do it instead (paging + ?search= in Spring).
// ---------------------------------------------------------------------------
import { useMemo, useState } from 'react';

export function useTableControls(data, { searchFields = [], filters = {}, initialSort = null } = {}) {
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [sort, setSort] = useState(initialSort);

  function setFilter(name, value) {
    setFilterValues((current) => ({ ...current, [name]: value }));
  }

  // Click a column once → A to Z. Click again → Z to A.
  function toggleSort(key) {
    setSort((current) =>
      current?.key === key ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' } : { key, direction: 'asc' }
    );
  }

  const rows = useMemo(() => {
    let result = data || [];

    const text = search.trim().toLowerCase();
    if (text) {
      result = result.filter((row) =>
        searchFields.some((field) => String(row[field] ?? '').toLowerCase().includes(text))
      );
    }

    for (const [name, getValue] of Object.entries(filters)) {
      const wanted = filterValues[name];
      if (wanted) result = result.filter((row) => getValue(row) === wanted);
    }

    if (sort) {
      const direction = sort.direction === 'asc' ? 1 : -1;
      result = [...result].sort((a, b) => compare(a[sort.key], b[sort.key]) * direction);
    }

    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, search, filterValues, sort]);

  return {
    rows,
    total: (data || []).length,
    search,
    setSearch,
    filterValues,
    setFilter,
    sort,
    toggleSort,
  };
}

// Numbers sort as numbers (2 before 10), text sorts alphabetically, empty values go last.
function compare(a, b) {
  if (a === b) return 0;
  if (a === null || a === undefined || a === '') return 1;
  if (b === null || b === undefined || b === '') return -1;
  const numberA = Number(a);
  const numberB = Number(b);
  if (!Number.isNaN(numberA) && !Number.isNaN(numberB)) return numberA - numberB;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}
