import { ArrowLeft, Bell, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';
import { getUnreadNotificationsCount } from '../../services/notificationService';
import './DashboardLayout.css';

function getInitial(name = '') {
  return String(name || 'U').trim().charAt(0).toUpperCase() || 'U';
}

function getRoleLabel(user) {
  const role = String(user?.tipo_usuario || user?.tipo || user?.role || '').toLowerCase().trim();

  if (role === 'admin') return 'Admin';
  if (role === 'cliente') return 'Cliente';
  if (role === 'profissional') return 'Profissional';
  return 'Perfil';
}

export default function Topbar({
  title,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Buscar no painel',
  showSearch = false,
  showBackButton = false,
  onBack,
}) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    async function loadUnreadCount() {
      try {
        const total = await getUnreadNotificationsCount();
        setUnreadCount(total);
      } catch {
        setUnreadCount(0);
      }
    }

    loadUnreadCount();
  }, []);

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  function handleBack() {
    if (typeof onBack === 'function') {
      onBack();
      return;
    }

    navigate(-1);
  }

  const roleLabel = getRoleLabel(user);

  return (
    <header className="topbar">
      <div>
        {showBackButton && (
          <button type="button" className="topbar-back-button" onClick={handleBack}>
            <ArrowLeft size={16} />
            Voltar
          </button>
        )}
        <h2 className="topbar-title">{title}</h2>
        <p className="topbar-subtitle">
          {user?.nome ? `Bem-vindo, ${user.nome}` : 'Acompanhe suas informacoes em tempo real'}
        </p>
        <div className="topbar-context-row">
          <span className="topbar-context-chip">{roleLabel}</span>
          {unreadCount > 0 && (
            <span className="topbar-context-note">
              {unreadCount} notificacao{unreadCount > 1 ? 'oes' : ''} aguardando leitura
            </span>
          )}
        </div>
      </div>

      <div className="topbar-actions">
        {showSearch && (
          <label className="topbar-search" aria-label="Buscar no painel">
            <Search size={16} />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(event) => onSearchChange?.(event.target.value)}
            />
          </label>
        )}

        <button
          type="button"
          className="topbar-icon-button"
          aria-label="Notificacoes"
          onClick={() => navigate('/notificacoes')}
        >
          <Bell size={18} />
          {unreadCount > 0 && <span className="topbar-notification-badge">{unreadCount}</span>}
        </button>

        <div className="topbar-user-chip">
          {user?.foto_url || user?.fotoUrl ? (
            <img
              src={user?.foto_url || user?.fotoUrl}
              alt={`Foto de ${user?.nome || 'Usuario'}`}
              className="topbar-user-avatar"
            />
          ) : (
            <div className="topbar-user-avatar topbar-user-avatar-fallback">
              {getInitial(user?.nome)}
            </div>
          )}
          <div className="topbar-user-copy">
            <strong>{user?.nome || 'Usuario'}</strong>
            <span>{user?.tipo_usuario || user?.tipo || user?.role || 'perfil'}</span>
          </div>
        </div>

        <button type="button" className="topbar-logout-button" onClick={handleLogout}>
          Sair
        </button>
      </div>
    </header>
  );
}
