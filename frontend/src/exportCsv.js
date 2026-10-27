// Build a CSV string from table rows and trigger a browser download.
//
//   exportCsv('products', ['sku', 'name'], rows, (row) => [row.sku, row.name]);
//
// Cells are quoted when they contain a comma, quote, or newline.

function cell(value) {
  const text = value === null || value === undefined ? '' : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCsv(columns, rows, pick) {
  const lines = [columns.map(cell).join(',')];
  for (const row of rows) {
    lines.push(pick(row).map(cell).join(','));
  }
  return lines.join('\r\n');
}

export function downloadCsv(filename, csv) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function exportCsv(filename, columns, rows, pick) {
  downloadCsv(filename, toCsv(columns, rows, pick));
}
