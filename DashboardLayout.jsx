import { useAuth } from '../../contexts/useAuth';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import './DashboardLayout.css';

export default function DashboardLayout({
  children,
  title,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Buscar no painel',
  showSearch = false,
  showBackButton = false,
  onBack,
}) {
  const { userType } = useAuth();
  const roleClass = userType ? `role-${String(userType).toLowerCase().trim()}` : 'role-default';

  return (
    <div className={`dashboard-layout ${roleClass}`}>
      <Sidebar />

      <div className="dashboard-content">
        <Topbar
          title={title}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          searchPlaceholder={searchPlaceholder}
          showSearch={showSearch}
          showBackButton={showBackButton}
          onBack={onBack}
        />
        <main className="dashboard-main">
          <div className="dashboard-main-shell">{children}</div>
        </main>
      </div>
    </div>
  );
}
