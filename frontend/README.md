# Lightweight ERP — Frontend (React)

A simple React app for your Spring Boot backend. You don't need to build it —
it's here so you can **see and use** what you build in Java.

## Start it

You need **two** things running:

1. **Spring Boot** (your backend) on port 8080 — start it as usual
   (`./mvnw spring-boot:run` from the project folder, or the ▶ button in VS Code).
2. **This frontend**, in a second terminal:

   ```bash
   cd frontend
   npm install      # only the first time (downloads React and Vite)
   npm run dev
   ```

Then open **http://localhost:5173**.

The Home page tells you if the frontend can reach Spring ("Backend connected ✓").

## How it talks to Spring

```
Browser ──► http://localhost:5173  (React, Vite dev server)
                 │
                 │  any request starting with /api is forwarded
                 ▼
            http://localhost:8080  (Spring Boot)
```

That forwarding is set in `vite.config.js`. Because of it you get **no CORS errors**
and don't need to change any Java code.

## What works today, and what's waiting on the backend

The sidebar shows a small dot next to modules that aren't fully working yet:
🟡 = page built, waiting on backend endpoints · ⚪ = planned (placeholder page).

| Section | Page | Status | Needs in Spring |
|---|---|---|---|
| Sales | Customers | 🟡 TODO | `GET /api/customers`, `POST /api/customers` |
| Sales | Sales Orders | 🟡 TODO | `GET/POST /api/orders`, `GET /api/orders/{n}`, `PATCH .../confirm`, `.../ship`, `.../cancel` |
| Inventory | Products | ✅ works | nothing — uses your `ProductController` |
| Inventory | Stock Levels | ⚪ planned | see the page |
| Purchasing | Suppliers | ⚪ planned | see the page |
| Purchasing | Purchase Orders | ⚪ planned | see the page |
| Finance | Accounts Receivable | ⚪ planned | see the page |
| Finance | Accounts Payable | ⚪ planned | see the page |

Pages that are waiting show a **yellow "Backend TODO" box** listing the endpoints.
Once you build them, the page starts working — then delete the yellow box from that page.

Search the code for `TODO(backend` to find every spot.

## Adding a new page to the sidebar

Everything in the sidebar comes from **`src/navigation.js`**.

1. **Just a placeholder:** add one item with `status: 'planned'` plus a `description`,
   `features` and `endpoints`. A "coming soon" page is created for it automatically,
   and it shows up on the dashboard too.
2. **A real page:** create `src/pages/YourPage.jsx`, add a route for it in `src/App.jsx`,
   and change the item's status to `'todo'` or `'ready'`.

Icons live in `src/components/Icon.jsx` — pick an existing name or add a new one.

## The JSON the order pages expect

When you write `OrderResponse` in step 6, use these field names
(or change `src/api/orders.js` and the order pages to match yours):

```json
{
  "orderNumber": "SO-000001",
  "customerNumber": "CUST-0001",
  "customerName": "John Adams",
  "status": "DRAFT",
  "orderDate": "2026-10-22",
  "totalAmount": 69.85,
  "lines": [
    { "sku": "TAPE-100", "productName": "Medium Shipping Tape", "quantity": 5, "unitPrice": 3.99, "lineTotal": 19.95 }
  ]
}
```

## Built-in helpers you can reuse on new pages

| Helper | File | Use it for |
|---|---|---|
| Search, filter and sort | `src/useTableControls.js` + `src/components/TableToolbar.jsx` | any table (see `ProductsPage.jsx` for an example) |
| Success messages | `useFeedback().toast('Saved')` from `src/feedback.jsx` | telling the user an action worked |
| "Are you sure?" popup | `await useFeedback().confirm({...})` | anything that can't be undone |
| Printing | `window.print()` + the `print-only` / `no-print` CSS classes | documents like sales orders (see `OrderDetailPage.jsx`) |

Company details on printed documents are in `src/company.js`.

## Light and dark mode

The switch at the bottom of the sidebar has three choices:
**System** (follows your Mac's Appearance setting), **Light** and **Dark**.
Your choice is remembered in the browser. Colors are defined once at the top of
`src/index.css`; the logic is in `src/theme.js`.

## Where things are

```
frontend/
├─ index.html            the one HTML page; React fills in <div id="root">
├─ vite.config.js        dev server + /api forwarding to Spring
└─ src/
   ├─ main.jsx           starting point
   ├─ App.jsx            the list of pages (which URL shows which page)
   ├─ navigation.js      ← the sidebar: every module, grouped into sections
   ├─ router.jsx         tiny page switcher (URLs like /#/products)
   ├─ useLoad.js         loads data when a page opens
   ├─ format.js          money / number / enum formatting
   ├─ theme.js           light / dark / system mode
   ├─ index.css          all the styles
   ├─ api/               ← one file per backend area — the only code that calls Spring
   │  ├─ client.js       sends requests, turns errors into readable messages
   │  ├─ products.js
   │  ├─ customers.js
   │  └─ orders.js
   ├─ components/        shared pieces: Layout (sidebar), Icon, PlaceholderPage,
   │                     error box, TODO box, badges, form field
   └─ pages/             one file per screen
```

**Rule of thumb:** if you add an endpoint in Java, add one matching function in the
right `src/api/*.js` file. Pages never call `fetch` directly.
