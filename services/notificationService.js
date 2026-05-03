import { apiRequest } from './api';

function pick(source, keys, fallback = null) {
  for (const key of keys) {
    if (source?.[key] !== undefined && source?.[key] !== null && source?.[key] !== '') {
      return source[key];
    }
  }

  return fallback;
}

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

export async function getNotifications() {
  const response = await apiRequest('/notifications');
  const source = response?.data ?? {};
  const notificationsRaw =
    source?.notificacoes ||
    source?.items ||
    source?.data ||
    source;

  return toArray(notificationsRaw).map((item, index) => ({
    id: pick(item, ['id_notificacao', 'id'], `notification-${index}`),
    titulo: pick(item, ['titulo'], 'Notificacao'),
    mensagem: pick(item, ['mensagem'], ''),
    tipo: pick(item, ['tipo'], ''),
    lida: Boolean(pick(item, ['lida'], false)),
    dataCriacao: pick(item, ['data_criacao', 'dataCriacao'], ''),
  }));
}

export async function getUnreadNotificationsCount() {
  const response = await apiRequest('/notifications/unread-count');
  const source = response?.data ?? response ?? {};

  return Number(pick(source, ['total'], 0) || 0);
}

export async function markNotificationAsRead(id) {
  return apiRequest(`/notifications/${id}/read`, {
    method: 'PATCH',
  });
}

export async function markAllNotificationsAsRead() {
  return apiRequest('/notifications/read-all', {
    method: 'PATCH',
  });
}
