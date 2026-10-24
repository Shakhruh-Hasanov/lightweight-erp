// ---------------------------------------------------------------------------
// orders.js — /api/orders
//
// TODO(backend, step 6): build SalesOrderController with these endpoints:
//
//   POST  /api/orders                          body: CreateOrderRequest ✅ (you built it)
//   GET   /api/orders                          → List<OrderResponse>
//   GET   /api/orders/{orderNumber}            → OrderResponse
//   PATCH /api/orders/{orderNumber}/confirm    → OrderResponse
//   PATCH /api/orders/{orderNumber}/ship       → OrderResponse
//   PATCH /api/orders/{orderNumber}/cancel     → OrderResponse
//
// The JSON shape the pages expect. When you write the OrderResponse and
// OrderLineResponse records in Java, use these exact names (or change the
// pages to match yours):
//
//   OrderResponse {
//     orderNumber, customerNumber, customerName,
//     status, orderDate, totalAmount,
//     lines: [ OrderLineResponse ]
//   }
//   OrderLineResponse { sku, productName, quantity, unitPrice, lineTotal }
// ---------------------------------------------------------------------------
import { apiRequest } from './client';

// Same values as your OrderStatus enum in Java.
export const ORDER_STATUSES = ['DRAFT', 'CONFIRMED', 'SHIPPED', 'CANCELLED'];

// body = { customerNumber: "CUST-0001", lines: [ { sku: "TAPE-100", quantity: 5 } ] }
export function createOrder(createOrderRequest) {
  return apiRequest('/orders', { method: 'POST', body: createOrderRequest });
}

export function listOrders() {
  return apiRequest('/orders');
}

export function getOrder(orderNumber) {
  return apiRequest(`/orders/${encodeURIComponent(orderNumber)}`);
}

export function confirmOrder(orderNumber) {
  return apiRequest(`/orders/${encodeURIComponent(orderNumber)}/confirm`, { method: 'PATCH' });
}

export function shipOrder(orderNumber) {
  return apiRequest(`/orders/${encodeURIComponent(orderNumber)}/ship`, { method: 'PATCH' });
}

export function cancelOrder(orderNumber) {
  return apiRequest(`/orders/${encodeURIComponent(orderNumber)}/cancel`, { method: 'PATCH' });
}
