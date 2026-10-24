# Lightweight ERP

![CI](https://github.com/Shakhruh-Hasanov/lightweight-erp/actions/workflows/ci.yml/badge.svg)

A lightweight ERP (business management) system I'm building to learn
professional backend development with Spring Boot.

## About

## About

In October 2025 I traveled back to Uzbekistan, where I was born, and noticed
how many small, family-owned mini stores line the streets, often several on the
same block, each selling a similar mix of everyday goods. My aunt runs one of
these convenience-style shops, and she tracks her entire inventory, sales and
paperwork by hand in a physical notebook.

That made me ask: what would a simple, affordable system for a store like hers
look like? Small businesses in Uzbekistan are growing quickly and adopting
technology fast, but most ERP software is built for large companies: complex,
expensive and hard to set up.

**Lightweight ERP** is my answer: a focused system for small retailers that
covers the essentials (products, customers, sales orders, and soon inventory
and invoicing) without the overhead of enterprise software. I'm building it
with professional practices from day one: a layered Spring Boot architecture,
automated tests, and CI on every pull request.

## Features

- **Products**: create, list, update, deactivate (with validation and duplicate-SKU checks)
- **Customers**: customer records with types and statuses
- **Sales Orders**: orders with line items, price snapshots and automatic totals *(in progress)*
- **React frontend**: dashboard with sidebar navigation, light/dark mode, search and printable orders

## Roadmap

- [x] Products: catalog with validation
- [x] Customers: records, types and statuses
- [ ] Sales orders: create, confirm, ship and cancel *(in progress)*
- [ ] **Inventory tracking**: stock on hand per product, with every stock
      movement recorded (sales, purchases, adjustments) and low-stock alerts
- [ ] **Invoicing**: generate invoices from shipped orders, record customer
      payments (full or partial), track open balances and overdue invoices
- [ ] **Purchasing**: suppliers and purchase orders; receiving a purchase
      order adds stock automatically
- [ ] **Accounts payable**: supplier bills and payments
- [ ] **Users and roles**: secure login, with permissions for owner, cashier
      and stock keeper
- [ ] **Audit trail**: who changed what, and when
- [ ] **Dashboard and reports**: daily sales, best-selling products, stock value
- [ ] **Localization**: Uzbek, Russian and English, with Uzbek som (UZS) currency
- [ ] **Deployment**: Docker image and cloud hosting

## Tech stack

| Area | Technology |
|---|---|
| Backend | Java 21, Spring Boot 4, Spring Data JPA (Hibernate) |
| Database | PostgreSQL |
| Testing | JUnit 5, Mockito |
| Frontend | React, Vite |
| CI | GitHub Actions |

## Running locally

### Backend
Requires Java 21 and PostgreSQL.

Set your database connection with environment variables (they override `application.properties`):

    SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/lightweight_erp
    SPRING_DATASOURCE_USERNAME=your-user
    SPRING_DATASOURCE_PASSWORD=your-password

Then:

    ./mvnw spring-boot:run      # macOS / Linux
    .\mvnw.cmd spring-boot:run  # Windows

Run the tests:

    ./mvnw test

### Frontend
Requires Node.js 22+.

    cd frontend
    npm install
    npm run dev

Open http://localhost:5173

## Development workflow

- Work happens on feature branches (`feature/<issue>-<name>`)
- Every pull request runs CI: backend tests + frontend build
- `main` only receives changes through pull requests