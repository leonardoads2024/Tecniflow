import { apiRequest } from './api';

export function acceptServiceRequest(id) {
  return apiRequest(`/service-requests/${id}/accept`, {
    method: 'PATCH',
  });
}

export function startServiceRequest(id) {
  return apiRequest(`/service-requests/${id}/start`, {
    method: 'PATCH',
  });
}

export function awaitConfirmationServiceRequest(id) {
  return apiRequest(`/service-requests/${id}/request-completion`, {
    method: 'PATCH',
  });
}

export function concludeServiceRequest(id) {
  return apiRequest(`/service-requests/${id}/finish`, {
    method: 'PATCH',
  });
}

export function rejectServiceRequest(id) {
  return apiRequest(`/service-requests/${id}/reject`, {
    method: 'PATCH',
  });
}

export function cancelServiceRequest(id) {
  return apiRequest(`/service-requests/${id}/cancel`, {
    method: 'PATCH',
  });
}

export function reportServiceRequestIncident(id, payload) {
  return apiRequest(`/service-requests/${id}/report`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
