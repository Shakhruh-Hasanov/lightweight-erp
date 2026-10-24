// ---------------------------------------------------------------------------
// navigation.js — THE list of every page in the sidebar.
//
// To add a new module (e.g. "Reports"), add ONE item to a section below.
//   status: 'ready'   → the backend is built, the page works
//           'todo'    → the page is built, waiting for backend endpoints
//           'planned' → just a placeholder page for now
//
// Items with status 'planned' automatically get a placeholder page that shows
// their `description`, `features` and `endpoints` — no extra file needed.
// When you're ready to build one for real, create a page in src/pages/,
// add its route in App.jsx, and change its status here.
// ---------------------------------------------------------------------------

export const NAV_SECTIONS = [
  {
    title: null, // no heading for the top group
    items: [{ to: '/', label: 'Dashboard', icon: 'dashboard', status: 'ready' }],
  },
  {
    title: 'Sales',
    items: [
      { to: '/customers', label: 'Customers', icon: 'users', status: 'todo' },
      { to: '/orders', label: 'Sales Orders', icon: 'cart', status: 'todo' },
    ],
  },
  {
    title: 'Inventory',
    items: [
      { to: '/products', label: 'Products', icon: 'box', status: 'ready' },
      {
        to: '/inventory',
        label: 'Stock Levels',
        icon: 'layers',
        status: 'planned',
        description: 'How many of each product you have on hand, and every movement in or out.',
        features: [
          'Quantity on hand per product',
          'Stock adjustments (count corrections, damage, returns)',
          'Stock goes down when a sales order ships',
          'Stock goes up when a purchase order is received',
          'Low-stock warnings',
        ],
        endpoints: ['GET  /api/inventory', 'GET  /api/inventory/{sku}', 'POST /api/inventory/adjustments'],
      },
    ],
  },
  {
    title: 'Purchasing',
    items: [
      {
        to: '/suppliers',
        label: 'Suppliers',
        icon: 'truck',
        status: 'planned',
        description: 'The companies you buy products from — like Customers, but on the buying side.',
        features: ['Supplier list with contact details', 'Active / inactive suppliers', 'Payment terms (e.g. Net 30)'],
        endpoints: ['GET  /api/suppliers', 'POST /api/suppliers', 'GET  /api/suppliers/{supplierNumber}'],
      },
      {
        to: '/purchase-orders',
        label: 'Purchase Orders',
        icon: 'clipboard',
        status: 'planned',
        description: 'Orders you send to suppliers to restock — the mirror image of Sales Orders.',
        features: [
          'Create a PO with lines (product, quantity, cost)',
          'Statuses: DRAFT → SENT → RECEIVED / CANCELLED',
          'Receiving a PO adds stock to inventory',
        ],
        endpoints: [
          'GET   /api/purchase-orders',
          'POST  /api/purchase-orders',
          'PATCH /api/purchase-orders/{poNumber}/receive',
        ],
      },
    ],
  },
  {
    title: 'Finance',
    items: [
      {
        to: '/accounts-receivable',
        label: 'Accounts Receivable',
        icon: 'invoice',
        status: 'planned',
        description: 'Money customers owe you: invoices from shipped sales orders, and the payments you receive.',
        features: [
          'Create an invoice from a shipped sales order',
          'Record customer payments (full or partial)',
          'Open balance per customer',
          'Overdue invoices',
        ],
        endpoints: ['GET  /api/invoices', 'POST /api/invoices', 'POST /api/invoices/{invoiceNumber}/payments'],
      },
      {
        to: '/accounts-payable',
        label: 'Accounts Payable',
        icon: 'wallet',
        status: 'planned',
        description: 'Money you owe suppliers: bills from received purchase orders, and the payments you make.',
        features: [
          'Record a supplier bill from a received purchase order',
          'Record payments to suppliers',
          'Open balance per supplier',
          'Bills due soon',
        ],
        endpoints: ['GET  /api/bills', 'POST /api/bills', 'POST /api/bills/{billNumber}/payments'],
      },
    ],
  },
];

// Every item in one flat list (handy for routes and the dashboard).
export const NAV_ITEMS = NAV_SECTIONS.flatMap((section) =>
  section.items.map((item) => ({ ...item, section: section.title }))
);
