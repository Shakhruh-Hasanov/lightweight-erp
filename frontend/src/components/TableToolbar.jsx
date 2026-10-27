// The bar above a table: a search box, optional filter dropdowns, and a row count.
//
//   <TableToolbar
//     table={table}
//     placeholder="Search SKU or name…"
//     filters={[{ name: 'status', label: 'Status', options: ['ACTIVE', 'INACTIVE'] }]}
//   />
import { formatEnum } from '../format';
import { exportCsv } from '../exportCsv';

export default function TableToolbar({ table, placeholder = 'Search…', filters = [], exportName, exportColumns, exportPick }) {
  const isFiltered = table.search || Object.values(table.filterValues).some(Boolean);
  const canExport = Boolean(exportName && exportColumns && exportPick && table.rows.length > 0);

  return (
    <div className="toolbar">
      <input
        className="toolbar-search"
        type="search"
        placeholder={placeholder}
        value={table.search}
        onChange={(event) => table.setSearch(event.target.value)}
        aria-label="Search"
      />
      {filters.map((filter) => (
        <select
          key={filter.name}
          className="toolbar-filter"
          value={table.filterValues[filter.name] || ''}
          onChange={(event) => table.setFilter(filter.name, event.target.value)}
          aria-label={filter.label}
        >
          <option value="">All {filter.label.toLowerCase()}</option>
          {filter.options.map((option) => (
            <option key={option} value={option}>
              {formatEnum(option)}
            </option>
          ))}
        </select>
      ))}
      <span className="toolbar-count">
        {isFiltered ? `${table.rows.length} of ${table.total}` : `${table.total}`} {table.total === 1 ? 'row' : 'rows'}
      </span>
      {canExport && (
        <button
          type="button"
          className="button toolbar-export"
          onClick={() => exportCsv(exportName, exportColumns, table.rows, exportPick)}
        >
          Export CSV
        </button>
      )}
    </div>
  );
}

// A clickable column header that shows ▲ / ▼ when the table is sorted by it.
//   <SortHeader table={table} column="name">Name</SortHeader>
export function SortHeader({ table, column, children, className = '' }) {
  const active = table.sort?.key === column;
  const arrow = active ? (table.sort.direction === 'asc' ? '▲' : '▼') : '';
  return (
    <th className={className} aria-sort={active ? (table.sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'}>
      <button type="button" className="sort-button" onClick={() => table.toggleSort(column)}>
        {children}
        <span className="sort-arrow">{arrow}</span>
      </button>
    </th>
  );
}
