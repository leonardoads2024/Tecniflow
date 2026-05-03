import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PanelCard from '../../components/ui/PanelCard';
import {
  createAdminIncident,
  getAdminIncidents,
  updateAdminIncidentStatus,
} from '../../services/adminService';
import '../profissional/ProfissionalDashboard.css';
import './AdminPages.css';

const initialForm = {
  tipo: 'denuncia',
  idUsuarioOrigem: '',
  idSolicitacao: '',
  titulo: '',
  descricao: '',
  prioridade: 'media',
};

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
    case 'resolvido':
      return 'green';
    case 'em_analise':
      return 'yellow';
    case 'arquivado':
      return 'gray';
    default:
      return 'red';
  }
}

function getPriorityColor(priority) {
  switch (priority) {
    case 'alta':
      return 'red';
    case 'media':
      return 'yellow';
    default:
      return 'blue';
  }
}

export default function AdminIncidentes() {
  const [incidents, setIncidents] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [statusFilter, setStatusFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  async function loadIncidents(showLoading = true) {
    try {
      if (showLoading) setLoading(true);
      setError('');
      const data = await getAdminIncidents();
      setIncidents(data);
    } catch (err) {
      setError(err?.message || 'Erro ao carregar incidentes.');
    } finally {
      if (showLoading) setLoading(false);
    }
  }

  useEffect(() => {
    loadIncidents();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  const filteredIncidents = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return incidents.filter((incident) => {
      const matchesStatus = statusFilter === 'todos' || incident.status === statusFilter;
      const matchesSearch =
        !normalizedSearch ||
        [
          incident.id,
          incident.titulo,
          incident.tipo,
          incident.nomeUsuarioOrigem,
          incident.tipoUsuarioOrigem,
          incident.nomeResponsavelAdmin,
          incident.idSolicitacao,
          incident.nomeCliente,
          incident.nomeProfissional,
          incident.nomeCategoria,
          incident.statusSolicitacao,
          incident.prioridadeSolicitacao,
          incident.descricaoServico,
          incident.descricao,
        ]
          .filter((value) => value !== null && value !== undefined)
          .some((value) => String(value).toLowerCase().includes(normalizedSearch));

      return matchesStatus && matchesSearch;
    });
  }, [incidents, searchTerm, statusFilter]);

  const openIncidents = incidents.filter((incident) => incident.status === 'aberto').length;
  const highPriorityIncidents = incidents.filter((incident) => incident.prioridade === 'alta').length;
  const resolvedIncidents = incidents.filter((incident) => incident.status === 'resolvido').length;

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.titulo.trim()) {
      setError('Informe o título do incidente.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setFeedback('');

      await createAdminIncident({
        tipo: form.tipo,
        id_usuario_origem: form.idUsuarioOrigem ? Number(form.idUsuarioOrigem) : null,
        id_solicitacao: form.idSolicitacao ? Number(form.idSolicitacao) : null,
        titulo: form.titulo.trim(),
        descricao: form.descricao.trim(),
        prioridade: form.prioridade,
      });

      setForm(initialForm);
      setFeedback('Incidente criado com sucesso.');
      await loadIncidents(false);
    } catch (err) {
      setError(err?.message || 'Erro ao criar incidente.');
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(incident, status) {
    try {
      setSavingId(incident.id);
      setError('');
      setFeedback('');
      await updateAdminIncidentStatus(incident.id, status);
      setFeedback(`Incidente ${incident.id} atualizado para ${status}.`);
      await loadIncidents(false);
    } catch (err) {
      setError(err?.message || 'Erro ao atualizar status do incidente.');
    } finally {
      setSavingId(null);
    }
  }

  return (
    <DashboardLayout
      title="Admin Incidentes"
      showSearch
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Buscar por incidente, origem, solicitação ou tipo"
    >
      <section className="admin-page">
        {feedback && <div className="dashboard-feedback">{feedback}</div>}
        {loading && <div className="dashboard-feedback">Carregando central de incidentes...</div>}
        {error && <div className="dashboard-error">{error}</div>}

        <section className="admin-management-overview">
          <div className="admin-management-card highlight">
            <strong>{filteredIncidents.length}</strong>
            <span>casos no recorte atual</span>
          </div>
          <div className="admin-management-card">
            <strong>{openIncidents}</strong>
            <span>incidentes abertos</span>
          </div>
          <div className="admin-management-card">
            <strong>{resolvedIncidents}</strong>
            <span>casos resolvidos na base</span>
          </div>
        </section>

        <div className="admin-grid-two">
          <PanelCard
            title="Trust and safety"
            subtitle="Disputas, denúncias e revisões internas da operação"
          >
            <div className="admin-actions-row">
              <label className="admin-form-group">
                <span className="admin-muted">Filtrar por status</span>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                >
                  <option value="todos">Todos</option>
                  <option value="aberto">Aberto</option>
                  <option value="em_analise">Em análise</option>
                  <option value="resolvido">Resolvido</option>
                  <option value="arquivado">Arquivado</option>
                </select>
              </label>
              <span className="admin-tag">Alta prioridade: {highPriorityIncidents}</span>
            </div>

            {!searchTerm.trim() ? (
              <div className="admin-search-empty">
                <strong>Use a busca para localizar incidentes</strong>
                <p>Pesquise por titulo, tipo, origem ou ID da solicitacao para manter a central mais enxuta.</p>
                <p>
                  Para a demonstracao, voce tambem pode abrir um incidente manualmente ao lado usando
                  um pedido de exemplo como referencia.
                </p>
              </div>
            ) : (
              <div className="admin-list">
                {filteredIncidents.length === 0 ? (
                  <div className="admin-list-item">
                    <div>
                      <strong>Nenhum incidente encontrado</strong>
                      <p>A central ainda não possui registros para o filtro selecionado.</p>
                    </div>
                  </div>
                ) : (
                  filteredIncidents.map((incident) => (
                    <div className="admin-list-item" key={incident.id}>
                      <div>
                        <strong>
                          #{incident.id} • {incident.titulo}
                        </strong>
                        <p>
                          Tipo: {incident.tipo} | Prioridade: {incident.prioridade} | Solicitação:{' '}
                          {incident.idSolicitacao || 'n/a'}
                        </p>
                        <p>
                          Origem: {incident.nomeUsuarioOrigem} ({incident.tipoUsuarioOrigem}) | Responsável:{' '}
                          {incident.nomeResponsavelAdmin}
                        </p>
                        <p>
                          Cliente: {incident.nomeCliente} | Profissional: {incident.nomeProfissional}
                        </p>
                        <p>
                          Categoria: {incident.nomeCategoria} | Status da solicitação:{' '}
                          {incident.statusSolicitacao} | Prioridade da solicitação:{' '}
                          {incident.prioridadeSolicitacao}
                        </p>
                        {incident.descricaoServico && <p>Resumo do serviço: {incident.descricaoServico}</p>}
                        <p>{incident.descricao || 'Sem descrição detalhada.'}</p>
                        <p>
                          Criado em: {formatDate(incident.dataCriacao)} | Atualizado em:{' '}
                          {formatDate(incident.dataAtualizacao)}
                        </p>
                      </div>

                      <div className="admin-item-actions">
                        <span className={`status-badge-ui ${getPriorityColor(incident.prioridade)}`}>
                          {incident.prioridade}
                        </span>
                        <span className={`status-badge-ui ${getStatusColor(incident.status)}`}>
                          {incident.status}
                        </span>
                        <select
                          value={incident.status}
                          onChange={(event) => handleStatusChange(incident, event.target.value)}
                          disabled={savingId === incident.id}
                        >
                          <option value="aberto">Aberto</option>
                          <option value="em_analise">Em análise</option>
                          <option value="resolvido">Resolvido</option>
                          <option value="arquivado">Arquivado</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </PanelCard>

          <PanelCard
            title="Novo incidente"
            subtitle="Abra casos operacionais sem depender de fluxo externo"
          >
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label htmlFor="incidente-tipo">Tipo</label>
                  <select
                    id="incidente-tipo"
                    name="tipo"
                    value={form.tipo}
                    onChange={handleChange}
                  >
                    <option value="denuncia">Denúncia</option>
                    <option value="disputa">Disputa</option>
                    <option value="revisao">Revisão</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label htmlFor="incidente-prioridade">Prioridade</label>
                  <select
                    id="incidente-prioridade"
                    name="prioridade"
                    value={form.prioridade}
                    onChange={handleChange}
                  >
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-group">
                <label htmlFor="incidente-titulo">Título</label>
                <input
                  id="incidente-titulo"
                  name="titulo"
                  value={form.titulo}
                  onChange={handleChange}
                  placeholder="Ex.: disputa sobre serviço concluído"
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label htmlFor="incidente-usuario">ID usuário origem</label>
                  <input
                    id="incidente-usuario"
                    name="idUsuarioOrigem"
                    type="number"
                    min="1"
                    value={form.idUsuarioOrigem}
                    onChange={handleChange}
                    placeholder="Opcional"
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="incidente-solicitacao">ID solicitação</label>
                  <input
                    id="incidente-solicitacao"
                    name="idSolicitacao"
                    type="number"
                    min="1"
                    value={form.idSolicitacao}
                    onChange={handleChange}
                    placeholder="Opcional"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label htmlFor="incidente-descricao">Descrição</label>
                <textarea
                  id="incidente-descricao"
                  name="descricao"
                  value={form.descricao}
                  onChange={handleChange}
                  placeholder="Registre contexto, risco e ação esperada"
                />
              </div>

              <div className="admin-actions-row">
                <button type="submit" className="topbar-logout-button" disabled={saving}>
                  {saving ? 'Salvando...' : 'Abrir incidente'}
                </button>
              </div>
            </form>
          </PanelCard>
        </div>
      </section>
    </DashboardLayout>
  );
}
