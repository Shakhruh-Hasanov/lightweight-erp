// ---------------------------------------------------------------------------
// customers.js — /api/customers
//
// TODO(backend): your CustomerController is still empty. The page will show
// "the backend doesn't have ... yet" until you add these endpoints:
//
//   GET  /api/customers                    → List<Customer>
//   GET  /api/customers/{customerNumber}   → Customer   (uses getCustomerByNumber ✅)
//   POST /api/customers                    → Customer   (201 Created)
//
// Customer JSON the page expects (same names as your Customer getters):
//   { customerNumber, displayName, customerType, email, phone, customerStatus }
// ---------------------------------------------------------------------------
import { apiRequest } from './client';

// Same values as your CustomerType enum in Java.
export const CUSTOMER_TYPES = ['INDIVIDUAL', 'BUSINESS', 'GOVERNMENT', 'NON_PROFIT'];

export function listCustomers() {
  return apiRequest('/customers');
}

export function getCustomer(customerNumber) {
  return apiRequest(`/customers/${encodeURIComponent(customerNumber)}`);
}

export function createCustomer(customer) {
  return apiRequest('/customers', { method: 'POST', body: customer });
}
