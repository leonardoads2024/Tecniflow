const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  console.error('VITE_API_URL não foi definida no arquivo .env');
}

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || data?.error || 'Erro na requisição');
  }

  return data;
}

export async function loginRequest(email, senha) {
  const response = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha }),
  });

  return response?.data || response;
}

export async function registerRequest(payload) {
  const response = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return response?.data || response;
}

export async function requestPasswordResetRequest(payload) {
  const response = await apiRequest('/auth/request-password-reset', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return response?.data ?? response;
}

export async function confirmPasswordResetRequest(payload) {
  const response = await apiRequest('/auth/confirm-password-reset', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return response?.data ?? response;
}
