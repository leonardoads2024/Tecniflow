import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import MetricCard from '../../components/ui/MetricCard';
import PanelCard from '../../components/ui/PanelCard';
import StatusBadge from '../../components/ui/StatusBadge';
import { getClientServiceRequests } from '../../services/clientRequestService';
import './ClienteSolicitacoes.css';

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

export default function ClienteSolicitacoesFlow() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('todos');
  const [selectedPriority, setSelectedPriority] = useState('todas');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadRequests() {
      try {
        setLoading(true);
        setError('');

        const data = await getClientServiceRequests();
        setRequests(data);
      } catch (err) {
        setError(err?.message || 'Erro ao carregar solicitacoes do cliente.');
      } finally {
        setLoading(false);
      }
    }

    loadRequests();
  }, []);

  const metrics = useMemo(
    () => ({
      total: requests.length,
      solicitadas: requests.filter((item) => item.status === 'solicitado').length,
      andamento: requests.filter((item) => item.status === 'em_andamento').length,
      concluidas: requests.filter((item) => item.status === 'concluido').length,
    }),
    [requests]
  );

  const filteredRequests = useMemo(() => {
    return requests.filter((item) => {
      const matchesStatus = selectedStatus === 'todos' || item.status === selectedStatus;
      const matchesPriority =
        selectedPriority === 'todas' || item.prioridade === selectedPriority;

      return matchesStatus && matchesPriority;
    });
  }, [requests, selectedPriority, selectedStatus]);

  return (
    <DashboardLayout title="Minhas Solicitacoes">
      <section className="client-requests-page">
        <section className="client-requests-overview">
          <div className="client-requests-overview-card highlight">
            <strong>{filteredRequests.length}</strong>
            <span>pedidos no recorte atual</span>
          </div>
          <div className="client-requests-overview-card">
            <strong>{requests.filter((item) => item.encaminhamentoPendente).length}</strong>
            <span>em triagem de encaminhamento</span>
          </div>
          <div className="client-requests-overview-card">
            <strong>{requests.filter((item) => item.totalProfissionais > 1).length}</strong>
            <span>pedidos com pool distribuido</span>
          </div>
        </section>

        <div className="client-requests-summary">
          <MetricCard
            label="Total de pedidos"
            value={metrics.total}
            info="Pedidos agrupados por necessidade"
          />
          <MetricCard
            label="Solicitados"
            value={metrics.solicitadas}
            info="Aguardando resposta inicial"
            highlight
            accent="yellow"
          />
          <MetricCard
            label="Em andamento"
            value={metrics.andamento}
            info="Pedidos com atendimento ativo"
          />
          <MetricCard
            label="Concluidos"
            value={metrics.concluidas}
            info="Pedidos finalizados"
            highlight
            accent="green"
          />
        </div>

        <PanelCard
          title="Acompanhamento das solicitacoes"
          subtitle="Veja o pedido do cliente como uma jornada unica, mesmo quando a plataforma aciona mais de um profissional"
        >
          <div className="client-requests-toolbar">
            <div className="client-requests-filter-group">
              <label htmlFor="clientStatusFilter">Filtrar por status</label>
              <select
                id="clientStatusFilter"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="todos">Todos</option>
                <option value="solicitado">Solicitado</option>
                <option value="aceito">Aceito</option>
                <option value="em_andamento">Em andamento</option>
                <option value="aguardando_confirmacao">Aguardando confirmacao</option>
                <option value="concluido">Concluido</option>
                <option value="cancelado">Cancelado</option>
                <option value="recusado">Recusado</option>
              </select>
            </div>

            <div className="client-requests-filter-group">
              <label htmlFor="clientPriorityFilter">Filtrar por prioridade</label>
              <select
                id="clientPriorityFilter"
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
              >
                <option value="todas">Todas</option>
                <option value="baixa">Baixa</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </div>
          </div>

          {loading && <div className="client-requests-feedback">Carregando solicitacoes...</div>}
          {error && <div className="client-requests-error">{error}</div>}

          {!loading && !error && filteredRequests.length === 0 && (
            <div className="client-requests-empty">
              Nenhuma solicitacao encontrada para o filtro selecionado.
            </div>
          )}

          {!loading && !error && filteredRequests.length > 0 && (
            <div className="client-requests-list">
              {filteredRequests.map((request) => (
                <div className="client-request-card" key={request.id}>
                  <div className="client-request-main">
                    <div className="client-request-header">
                      <strong>{request.titulo}</strong>
                      <StatusBadge status={request.status}>{request.statusLabel}</StatusBadge>
                    </div>

                    <div className="client-request-meta">
                      <span>
                        <strong>Pool:</strong> {request.totalProfissionais} profissional(is)
                      </span>
                      <span>
                        <strong>Destaque atual:</strong>{' '}
                        {request.encaminhamentoPendente ? 'Aguardando encaminhamento' : request.profissional}
                      </span>
                      <span>
                        <strong>Prioridade:</strong> {request.prioridade || 'Nao informada'}
                      </span>
                      <span>
                        <strong>Endereco:</strong> {request.endereco}
                      </span>
                      <span>
                        <strong>Custo por lead:</strong> {request.precoLead ?? 'Nao informado'}
                      </span>
                      <span>
                        <strong>Data:</strong> {formatDate(request.data)}
                      </span>
                      {request.encaminhamentoPendente && (
                        <span className="client-request-inline-note">
                          A plataforma registrou o pedido e vai encaminha-lo assim que houver oferta
                          compativel.
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="client-request-actions">
                    <button
                      type="button"
                      className="client-action-button"
                      onClick={() => navigate(`/cliente/solicitacoes/${request.id}`)}
                    >
                      Ver detalhes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </PanelCard>
      </section>
    </DashboardLayout>
  );
}
