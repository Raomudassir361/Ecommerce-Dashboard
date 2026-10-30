const apiBase = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/+$/, '');

export class AdminApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'AdminApiError';
    this.status = status;
  }
}

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${apiBase}${path}`, {
      ...options,
      credentials: 'include',
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new AdminApiError('Could not reach the API');
  }

  const text = await response.text();
  let result;
  try {
    result = text ? JSON.parse(text) : null;
  } catch {
    result = text;
  }

  if (!response.ok) {
    const message = result && typeof result === 'object'
      ? result.message || result.error
      : result;
    throw new AdminApiError(message || `Request failed (${response.status})`, response.status);
  }
  return result;
}

const json = (method, body) => ({ method, body: JSON.stringify(body) });

export const adminApi = {
  currentAdmin: () => request('/auth/me'),
  login: (email, password) => request('/auth/login', json('POST', { email, password })),
  logout: () => request('/auth/logout', json('POST', {})),
  products: () => request('/admin/products'),
  orders: () => request('/admin/orders'),
  users: () => request('/admin/users'),
  metrics: () => request('/admin/dashboard/metrics'),
  createProduct: (product) => request('/admin/products', json('POST', product)),
  updateProduct: (id, product) => request(`/admin/products/${encodeURIComponent(id)}`, json('PUT', product)),
  deleteProduct: (id) => request(`/admin/products/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  createOrder: (order) => request('/admin/orders', json('POST', order)),
  updateOrder: (id, patch) => request(`/admin/orders/${encodeURIComponent(id)}`, json('PATCH', patch)),
  deleteOrder: (id) => request(`/admin/orders/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  updateUser: (id, patch) => request(`/admin/users/${encodeURIComponent(id)}`, json('PATCH', patch)),
  deleteUser: (id) => request(`/admin/users/${encodeURIComponent(id)}`, { method: 'DELETE' }),
};

export function unwrap(value, key) {
  const data = value?.data ?? value;
  return key && data && !Array.isArray(data) ? data[key] ?? data : data;
}

export function getId(record) {
  return record?.id ?? record?._id ?? '';
}
