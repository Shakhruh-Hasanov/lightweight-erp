// ---------------------------------------------------------------------------
// products.js — matches your ProductController (/api/products). READY ✅
// ---------------------------------------------------------------------------
import { apiRequest } from './client';

// Same values as your UnitOfMeasure enum in Java.
export const UNITS_OF_MEASURE = ['EACH', 'KILOGRAM', 'LITER', 'POUND', 'METER', 'BOX', 'INCH', 'FOOT'];

// GET /api/products
export function listProducts() {
  return apiRequest('/products');
}

// GET /api/products/{sku}
export function getProduct(sku) {
  return apiRequest(`/products/${encodeURIComponent(sku)}`);
}

// POST /api/products   body: the Product fields
export function createProduct(product) {
  return apiRequest('/products', { method: 'POST', body: product });
}

// PUT /api/products/{sku}   body: ProductUpdateRequest (everything except sku)
export function updateProduct(sku, updateRequest) {
  return apiRequest(`/products/${encodeURIComponent(sku)}`, { method: 'PUT', body: updateRequest });
}

// PATCH /api/products/{sku}/deactivate
export function deactivateProduct(sku) {
  return apiRequest(`/products/${encodeURIComponent(sku)}/deactivate`, { method: 'PATCH' });
}

// TODO(backend — backlog: product approval workflow)
// When you build PATCH /api/products/{sku}/approve, uncomment this and
// add an "Approve" button in ProductsPage.jsx.
//
// export function approveProduct(sku) {
//   return apiRequest(`/products/${encodeURIComponent(sku)}/approve`, { method: 'PATCH' });
// }
