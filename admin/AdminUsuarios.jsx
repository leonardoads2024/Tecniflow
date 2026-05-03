import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PanelCard from '../../components/ui/PanelCard';
import { getAdminUsers, updateAdminUserStatus } from '../../services/adminService';
import '../profissional/ProfissionalDashboard.css';
import './AdminPages.css';

function formatDate(value) {
  if (!value) return 'Nao informado';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}

export default function AdminUsuarios() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  async function loadUsers(showLoading = true) {
    try {
      if (showLoading) setLoading(true);
      setError('');
      const data = await getAdminUsers();
      setUsers(data);
    } catch (err) {
      setError(err?.message || 'Erro ao carregar usuarios.');
    } finally {
      if (showLoading) setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return users.filter((user) => {
      const matchesFilter = filter === 'todos' || user.tipoUsuario === filter;
      const matchesSearch =
        !normalizedSearch ||
        user.nome.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch) ||
        user.telefone.toLowerCase().includes(normalizedSearch);

      return matchesFilter && matchesSearch;
    });
  }, [filter, searchTerm, users]);

  const activeUsers = users.filter((user) => user.status === 1).length;
  const professionalsCount = users.filter((user) => user.tipoUsuario === 'profissional').length;

  async function handleToggleStatus(user) {
    try {
      setSavingId(user.id);
      setError('');
      setFeedback('');
      await updateAdminUserStatus(user.id, user.status === 1 ? 0 : 1);
      setFeedback(`Status de ${user.nome} atualizado com sucesso.`);
      await loadUsers(false);
    } catch (err) {
      setError(err?.message || 'Erro ao atualizar status do usuario.');
    } finally {
      setSavingId(null);
    }
  }

  return (
    <DashboardLayout
      title="Admin Usuarios"
      showSearch
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Buscar por nome, email ou telefone"
    >
      <section className="admin-page">
        {feedback && <div className="dashboard-feedback">{feedback}</div>}
        {loading && <div className="dashboard-feedback">Carregando usuarios...</div>}
        {error && <div className="dashboard-error">{error}</div>}

        <section className="admin-management-overview">
          <div className="admin-management-card highlight">
            <strong>{filteredUsers.length}</strong>
            <span>usuarios no recorte atual</span>
          </div>
          <div className="admin-management-card">
            <strong>{activeUsers}</strong>
            <span>contas ativas na base</span>
          </div>
          <div className="admin-management-card">
            <strong>{professionalsCount}</strong>
            <span>profissionais cadastrados</span>
          </div>
        </section>

        <PanelCard
          title="Base de usuarios"
          subtitle="Gestao operacional de clientes, profissionais e administradores"
        >
          <div className="admin-actions-row">
            <label className="admin-form-group">
              <span className="admin-muted">Filtrar por perfil</span>
              <select value={filter} onChange={(event) => setFilter(event.target.value)}>
                <option value="todos">Todos</option>
                <option value="cliente">Clientes</option>
                <option value="profissional">Profissionais</option>
                <option value="admin">Admins</option>
              </select>
            </label>
          </div>

          {!searchTerm.trim() ? (
            <div className="admin-search-empty">
              <strong>Use a busca para localizar usuarios</strong>
              <p>Pesquise por nome, e-mail ou telefone para manter o painel mais limpo e objetivo.</p>
            </div>
          ) : (
            <div className="admin-list">
              {filteredUsers.length === 0 ? (
                <div className="admin-list-item">
                  <div>
                    <strong>Nenhum usuario encontrado</strong>
                    <p>Nao ha registros para o filtro selecionado.</p>
                  </div>
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div className="admin-list-item" key={user.id}>
                    <div>
                      <strong>{user.nome}</strong>
                      <p>{user.email}</p>
                      <p>Telefone: {user.telefone}</p>
                      <p>Perfil: {user.tipoUsuario} | Criado em: {formatDate(user.dataCriacao)}</p>
                    </div>

                    <div className="admin-item-actions">
                      <span className={`status-badge-ui ${user.status === 1 ? 'green' : 'red'}`}>
                        {user.status === 1 ? 'Ativo' : 'Inativo'}
                      </span>
                      <button
                        type="button"
                        className="topbar-logout-button"
                        onClick={() => handleToggleStatus(user)}
                        disabled={savingId === user.id}
                      >
                        {savingId === user.id
                          ? 'Salvando...'
                          : user.status === 1
                            ? 'Desativar'
                            : 'Ativar'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </PanelCard>
      </section>
    </DashboardLayout>
  );
}
