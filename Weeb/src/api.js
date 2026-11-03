const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const ACCESS_TOKEN_KEY = 'weeb_access_token';
const REFRESH_TOKEN_KEY = 'weeb_refresh_token';

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function saveTokens({ access, refresh }) {
  if (access) localStorage.setItem(ACCESS_TOKEN_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) return false;

  const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) {
    clearTokens();
    return false;
  }

  const data = await response.json();
  saveTokens(data);
  return Boolean(data.access);
}

export async function apiRequest(path, options = {}, canRefresh = true) {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  const access = getAccessToken();
  if (access) headers.set('Authorization', `Bearer ${access}`);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && canRefresh && (await refreshAccessToken())) {
    return apiRequest(path, options, false);
  }

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : null;

  if (!response.ok) {
    const error = new Error(
      data?.detail || data?.message || 'Une erreur est survenue.'
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const authApi = {
  signup: (payload) =>
    apiRequest('/auth/signup/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  signin: async (payload) => {
    const tokens = await apiRequest('/auth/signin/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    saveTokens(tokens);
    return tokens;
  },
  requestPasswordReset: (email) =>
    apiRequest('/auth/reset-password/request/', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  confirmPasswordReset: (payload) =>
    apiRequest('/auth/reset-password/confirm/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

export const articlesApi = {
  list: () => apiRequest('/blog/articles/'),
  get: (id) => apiRequest(`/blog/articles/${id}/`),
  create: (payload) =>
    apiRequest('/blog/articles/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  update: (id, payload) =>
    apiRequest(`/blog/articles/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  remove: (id) =>
    apiRequest(`/blog/articles/${id}/`, {
      method: 'DELETE',
    }),
  mine: () => apiRequest('/blog/articles/my_articles/'),
  publish: (id) =>
    apiRequest(`/blog/articles/${id}/publish/`, {
      method: 'POST',
    }),
};
