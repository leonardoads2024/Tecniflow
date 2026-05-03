import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PanelCard from '../../components/ui/PanelCard';
import StatusBadge from '../../components/ui/StatusBadge';
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../../services/notificationService';
import './NotificacoesPage.css';

function formatDate(value) {
  if (!value) return 'Agora mesmo';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}

export default function NotificacoesPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    async function loadNotifications() {
      try {
        setLoading(true);
        setError('');
        const data = await getNotifications();
        setNotifications(data);
      } catch (err) {
        setError(err?.message || 'Erro ao carregar notificações.');
      } finally {
        setLoading(false);
      }
    }

    loadNotifications();
  }, []);

  async function handleRead(id) {
    try {
      setError('');
      setFeedback('');
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, lida: true } : item))
      );
    } catch (err) {
      setError(err?.message || 'Erro ao marcar notificação.');
    }
  }

  async function handleReadAll() {
    try {
      setError('');
      setFeedback('');
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((item) => ({ ...item, lida: true })));
      setFeedback('Todas as notificações foram marcadas como lidas.');
    } catch (err) {
      setError(err?.message || 'Erro ao marcar todas as notificações.');
    }
  }

  const unreadCount = notifications.filter((item) => !item.lida).length;
  const readCount = Math.max(0, notifications.length - unreadCount);

  return (
    <DashboardLayout title="Notificações">
      <section className="notifications-page">
        <section className="notifications-overview">
          <div className="notifications-overview-card highlight">
            <strong>{unreadCount}</strong>
            <span>pendentes agora</span>
          </div>
          <div className="notifications-overview-card">
            <strong>{notifications.length}</strong>
            <span>eventos no histórico</span>
          </div>
          <div className="notifications-overview-card">
            <strong>{readCount}</strong>
            <span>já tratados por você</span>
          </div>
        </section>

        <PanelCard
          title="Central de notificações"
          subtitle="Acompanhe eventos importantes da sua operação dentro da plataforma"
        >
          <div className="notifications-toolbar">
            <div className="notifications-toolbar-copy">
              <strong>{unreadCount} pendente(s)</strong>
              <span>Use esta central para manter sua operação em dia.</span>
            </div>

            <button
              type="button"
              className="notifications-action-button"
              onClick={handleReadAll}
            >
              Marcar tudo como lido
            </button>
          </div>

          {feedback && <div className="notifications-success">{feedback}</div>}
          {loading && <div className="notifications-feedback">Carregando notificações...</div>}
          {error && <div className="notifications-error">{error}</div>}

          {!loading && !error && notifications.length === 0 && (
            <div className="notifications-empty">
              <strong>Nenhuma notificacao por enquanto.</strong>
              <p>
                Quando novos eventos surgirem na sua jornada, eles aparecerao aqui para ajudar a
                manter a operacao em dia.
              </p>
              <div className="notifications-empty-actions">
                <button
                  type="button"
                  className="notifications-action-button secondary"
                  onClick={() => navigate('/ajuda')}
                >
                  Ver ajuda
                </button>
                <button
                  type="button"
                  className="notifications-action-button secondary"
                  onClick={() => navigate(-1)}
                >
                  Voltar ao painel
                </button>
              </div>
            </div>
          )}

          {!loading && !error && notifications.length > 0 && (
            <div className="notifications-list">
              {notifications.map((notification) => (
                <article
                  className={`notification-card ${notification.lida ? 'read' : 'unread'}`}
                  key={notification.id}
                >
                  <div className="notification-main">
                    <div className="notification-header">
                      <strong>{notification.titulo}</strong>
                      <StatusBadge status={notification.lida ? 'concluido' : 'solicitado'}>
                        {notification.lida ? 'Lida' : 'Nova'}
                      </StatusBadge>
                    </div>

                    <p>{notification.mensagem}</p>

                    <div className="notification-meta">
                      <span>Tipo: {notification.tipo || 'geral'}</span>
                      <span>Data: {formatDate(notification.dataCriacao)}</span>
                    </div>
                  </div>

                  {!notification.lida && (
                    <button
                      type="button"
                      className="notifications-action-button secondary"
                      onClick={() => handleRead(notification.id)}
                    >
                      Marcar como lida
                    </button>
                  )}
                </article>
              ))}
            </div>
          )}
        </PanelCard>
      </section>
    </DashboardLayout>
  );
}


