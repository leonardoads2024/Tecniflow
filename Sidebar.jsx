import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Search,
  PlusCircle,
  Wallet,
  Star,
  Bell,
  CircleHelp,
  Crown,
  UserCircle2,
  Shield,
  Users,
  Tags,
  BadgeDollarSign,
  BadgeCheck,
  ClipboardList,
  MessageSquareWarning,
  ScrollText,
  Siren,
} from 'lucide-react';
import { useAuth } from '../../contexts/useAuth';
import './DashboardLayout.css';

function getInitial(name = '') {
  return String(name || 'U').trim().charAt(0).toUpperCase() || 'U';
}

function getRoleMeta(role) {
  if (role === 'admin') {
    return {
      label: 'Operacao admin',
      footer: 'Governanca, moderacao e saude do marketplace',
    };
  }

  if (role === 'cliente') {
    return {
      label: 'Jornada do cliente',
      footer: 'Solicitacoes, descoberta e acompanhamento de servicos',
    };
  }

  return {
    label: 'Modo profissional',
    footer: 'Leads, reputacao e crescimento comercial do perfil',
  };
}

export default function Sidebar() {
  const { user } = useAuth();

  const userRole = String(
    user?.tipo_usuario || user?.tipo || user?.role || ''
  )
    .toLowerCase()
    .trim();

  const profissionalSections = [
    {
      title: 'Operacao',
      links: [
        { to: '/profissional/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
        { to: '/profissional/servicos', label: 'Servicos', icon: <Briefcase size={18} /> },
        { to: '/profissional/avaliacoes', label: 'Avaliacoes', icon: <Star size={18} /> },
        { to: '/profissional/financeiro', label: 'Financeiro', icon: <Wallet size={18} /> },
        { to: '/profissional/assinatura', label: 'Premium', icon: <Crown size={18} /> },
      ],
    },
    {
      title: 'Conta',
      links: [
        { to: '/notificacoes', label: 'Notificacoes', icon: <Bell size={18} /> },
        { to: '/ajuda', label: 'Ajuda', icon: <CircleHelp size={18} /> },
        { to: '/profissional/perfil', label: 'Perfil', icon: <UserCircle2 size={18} /> },
      ],
    },
  ];

  const clienteSections = [
    {
      title: 'Principal',
      links: [
        { to: '/cliente/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
        { to: '/cliente/nova-solicitacao', label: 'Nova solicitacao', icon: <PlusCircle size={18} /> },
        { to: '/cliente/profissionais', label: 'Profissionais', icon: <Search size={18} /> },
        { to: '/cliente/solicitacoes', label: 'Solicitacoes', icon: <Briefcase size={18} /> },
      ],
    },
    {
      title: 'Conta',
      links: [
        { to: '/notificacoes', label: 'Notificacoes', icon: <Bell size={18} /> },
        { to: '/ajuda', label: 'Ajuda', icon: <CircleHelp size={18} /> },
        { to: '/cliente/perfil', label: 'Perfil', icon: <UserCircle2 size={18} /> },
      ],
    },
  ];

  const adminSections = [
    {
      title: 'Operacao',
      links: [
        { to: '/admin/dashboard', label: 'Dashboard', icon: <Shield size={18} /> },
        { to: '/admin/usuarios', label: 'Usuarios', icon: <Users size={18} /> },
        { to: '/admin/profissionais', label: 'Profissionais', icon: <BadgeCheck size={18} /> },
        { to: '/admin/solicitacoes', label: 'Solicitacoes', icon: <ClipboardList size={18} /> },
        { to: '/admin/avaliacoes', label: 'Avaliacoes', icon: <MessageSquareWarning size={18} /> },
        { to: '/admin/incidentes', label: 'Incidentes', icon: <Siren size={18} /> },
      ],
    },
    {
      title: 'Plataforma',
      links: [
        { to: '/admin/categorias', label: 'Categorias', icon: <Tags size={18} /> },
        { to: '/admin/planos', label: 'Planos', icon: <BadgeDollarSign size={18} /> },
        { to: '/admin/auditoria', label: 'Auditoria', icon: <ScrollText size={18} /> },
        { to: '/notificacoes', label: 'Notificacoes', icon: <Bell size={18} /> },
        { to: '/ajuda', label: 'Ajuda', icon: <CircleHelp size={18} /> },
      ],
    },
  ];

  const sections =
    userRole === 'admin' ? adminSections : userRole === 'cliente' ? clienteSections : profissionalSections;

  const roleMeta = getRoleMeta(userRole);

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <div className="sidebar-brand-badge">T</div>
          <div>
            <h1>TECNIFLOW</h1>
            <p>Painel de operacao</p>
          </div>
        </div>

        <div className="sidebar-role-chip">{roleMeta.label}</div>

        <nav className="sidebar-nav">
          {sections.map((section) => (
            <div className="sidebar-section" key={section.title}>
              <div className="sidebar-section-head">
                <span className="sidebar-section-title">{section.title}</span>
                <span className="sidebar-section-count">{section.links.length}</span>
              </div>

              {section.links.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
                >
                  <span className="sidebar-link-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-user-avatar-shell">
          {user?.foto_url || user?.fotoUrl ? (
            <img
              src={user?.foto_url || user?.fotoUrl}
              alt={`Foto de ${user?.nome || 'Usuario'}`}
              className="sidebar-user-avatar"
            />
          ) : (
            <div className="sidebar-user-avatar sidebar-user-avatar-fallback">
              {getInitial(user?.nome)}
            </div>
          )}

          <div>
            <p className="sidebar-user-name">{user?.nome || 'Usuario'}</p>
            <span className="sidebar-user-role">{userRole || 'perfil'}</span>
          </div>
        </div>

        <div className="sidebar-presence-card">
          <strong>Conta ativa</strong>
          <span>{roleMeta.footer}</span>
        </div>
      </div>
    </aside>
  );
}
