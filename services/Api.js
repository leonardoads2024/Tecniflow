const API_BASE_URL = import.meta.env.VITE_API_URL;

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

  console.log('API REQUEST URL:', `${API_BASE_URL}${endpoint}`);
  console.log('API REQUEST TOKEN:', token);
  console.log('API REQUEST CONFIG:', config);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  console.log('API RESPONSE STATUS:', response.status);
  console.log('API RESPONSE DATA:', data);

  if (!response.ok) {
    throw new Error(
      data?.message ||
      data?.erro ||
      data?.error ||
      `Erro ${response.status} ao acessar ${endpoint}`
    );
  }

  return data;
}