import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PanelCard from '../../components/ui/PanelCard';
import { getAdminServiceRequests } from '../../services/adminService';
import '../profissional/ProfissionalDashboard.css';
import './AdminPages.css';

function formatDate(value) {
  if (!value) return 'Não informado';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}

function getStatusColor(status) {
  switch (status) {
    case 'concluido':
      return 'green';
    case 'aguardando_confirmacao':
      return 'yellow';
    case 'cancelado':
    case 'recusado':
      return 'red';
    case 'aceito':
    case 'em_andamento':
      return 'blue';
    default:
      return 'gray';
  }
}

export default function AdminSolicitacoes() {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadServiceRequests() {
      try {
        setLoading(true);
        setError('');
        const data = await getAdminServiceRequests();
        setServiceRequests(data);
      } catch (err) {
        setError(err?.message || 'Erro ao carregar solicitações.');
      } finally {
        setLoading(false);
      }
    }

    loadServiceRequests();
  }, []);

  const filteredRequests = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return serviceRequests.filter((request) => {
      const matchesStatus = statusFilter === 'todos' || request.status === statusFilter;
      const matchesSearch =
        !normalizedSearch ||
        [
          request.id,
          request.nomeCategoria,
          request.nomeCliente,
          request.nomeProfissional,
          request.descricaoServico,
          request.prioridade,
        ]
          .filter((value) => value !== null && value !== undefined)
          .some((value) => String(value).toLowerCase().includes(normalizedSearch));

      return matchesStatus && matchesSearch;
    });
  }, [searchTerm, serviceRequests, statusFilter]);

  const inProgressCount = serviceRequests.filter((request) =>
    ['aceito', 'em_andamento', 'aguardando_confirmacao'].includes(request.status),
  ).length;
  const criticalCount = serviceRequests.filter((request) => request.prioridade === 'urgente').length;
  const completedCount = serviceRequests.filter((request) => request.status === 'concluido').length;

  return (
    <DashboardLayout
      title="Admin Solicitações"
      showSearch
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Buscar por ID, cliente, profissional ou categoria"
    >
      <section className="admin-page">
        {loading && <div className="dashboard-feedback">Carregando funil de solicitações...</div>}
        {error && <div className="dashboard-error">{error}</div>}

        <section className="admin-management-overview">
          <div className="admin-management-card highlight">
            <strong>{filteredRequests.length}</strong>
            <span>solicitacoes no recorte atual</span>
          </div>
          <div className="admin-management-card">
            <strong>{inProgressCount}</strong>
            <span>pedidos em operacao agora</span>
          </div>
          <div className="admin-management-card">
            <strong>{completedCount}</strong>
            <span>solicitacoes concluidas na base</span>
          </div>
        </section>

        <PanelCard
          title="Operação do marketplace"
          subtitle="Visão global de atendimento, gargalos e status da plataforma"
        >
          <div className="admin-actions-row">
            <label className="admin-form-group">
              <span className="admin-muted">Filtrar por status</span>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="todos">Todos</option>
                <option value="solicitado">Solicitado</option>
                <option value="aceito">Aceito</option>
                <option value="em_andamento">Em andamento</option>
                <option value="aguardando_confirmacao">Aguardando confirmação</option>
                <option value="concluido">Concluído</option>
                <option value="cancelado">Cancelado</option>
                <option value="recusado">Recusado</option>
              </select>
            </label>
            <span className="admin-tag">Urgentes na base: {criticalCount}</span>
          </div>

          {!searchTerm.trim() ? (
            <div className="admin-search-empty">
              <strong>Faça uma busca para analisar o funil</strong>
              <p>Procure por ID, cliente, profissional ou categoria para investigar casos sem abrir tudo de uma vez.</p>
            </div>
          ) : (
            <div className="admin-list">
              {filteredRequests.length === 0 ? (
                <div className="admin-list-item">
                  <div>
                    <strong>Nenhuma solicitação encontrada</strong>
                    <p>Não há itens para o filtro selecionado.</p>
                  </div>
                </div>
              ) : (
                filteredRequests.map((request) => (
                  <div className="admin-list-item" key={request.id}>
                    <div>
                      <strong>
                        #{request.id} • {request.nomeCategoria}
                      </strong>
                      <p>{request.descricaoServico}</p>
                      <p>Cliente: {request.nomeCliente} | Profissional: {request.nomeProfissional}</p>
                      <p>Prioridade: {request.prioridade} | Lead: {request.precoLead} créditos</p>
                      <p>
                        Criada em: {formatDate(request.dataSolicitacao)} | Conclusão: {formatDate(request.dataConclusao)}
                      </p>
                    </div>

                    <div className="admin-item-actions">
                      <span className={`status-badge-ui ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
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
