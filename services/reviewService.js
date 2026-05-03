import { apiRequest } from './api';

export async function createReview(payload) {
  const response = await apiRequest('/reviews', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return response?.data ?? response;
}
