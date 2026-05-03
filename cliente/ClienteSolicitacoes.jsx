import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import MetricCard from '../../components/ui/MetricCard';
import PanelCard from '../../components/ui/PanelCard';
import StatusBadge from '../../components/ui/StatusBadge';
import { getClientServiceRequests } from '../../services/clientRequestService';
import './ClienteSolicitacoes.css';

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

export default function ClienteSolicitacoes() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('todos');
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
        setError(err?.message || 'Erro ao carregar solicitações do cliente.');
      } finally {
        setLoading(false);
      }
    }

    loadRequests();
  }, []);

  const metrics = useMemo(() => {
    return {
      total: requests.length,
      solicitadas: requests.filter((item) => item.status === 'solicitado').length,
      andamento: requests.filter((item) => item.status === 'em_andamento').length,
      concluidas: requests.filter((item) => item.status === 'concluido').length,
    };
  }, [requests]);

  const filteredRequests = useMemo(() => {
    if (selectedStatus === 'todos') {
      return requests;
    }

    return requests.filter((item) => item.status === selectedStatus);
  }, [requests, selectedStatus]);

  return (
    <DashboardLayout title="Minhas Solicitações">
      <section className="client-requests-page">
        <div className="client-requests-summary">
          <MetricCard
            label="Total de solicitações"
            value={metrics.total}
            info="Todas as solicitações registradas"
          />
          <MetricCard
            label="Solicitadas"
            value={metrics.solicitadas}
            info="Aguardando aceite"
            highlight
            accent="yellow"
          />
          <MetricCard
            label="Em andamento"
            value={metrics.andamento}
            info="Serviços em execução"
          />
          <MetricCard
            label="Concluídas"
            value={metrics.concluidas}
            info="Serviços finalizados"
            highlight
            accent="green"
          />
        </div>

        <PanelCard
          title="Acompanhamento das solicitações"
          subtitle="Veja e filtre o histórico dos seus pedidos"
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
                <option value="aguardando_confirmacao">Aguardando confirmação</option>
                <option value="concluido">Concluído</option>
                <option value="cancelado">Cancelado</option>
                <option value="recusado">Recusado</option>
              </select>
            </div>
          </div>

          {loading && (
            <div className="client-requests-feedback">
              Carregando solicitações...
            </div>
          )}

          {error && (
            <div className="client-requests-error">
              {error}
            </div>
          )}

          {!loading && !error && filteredRequests.length === 0 && (
            <div className="client-requests-empty">
              Nenhuma solicitação encontrada para o filtro selecionado.
            </div>
          )}

          {!loading && !error && filteredRequests.length > 0 && (
            <div className="client-requests-list">
              {filteredRequests.map((request) => (
                <div className="client-request-card" key={request.id}>
                  <div className="client-request-main">
                    <div className="client-request-header">
                      <strong>{request.titulo}</strong>
                      <StatusBadge status={request.status}>
                        {request.statusLabel}
                      </StatusBadge>
                    </div>

                    <div className="client-request-meta">
                      <span>
                        <strong>Profissional:</strong> {request.profissional}
                      </span>
                      <span>
                        <strong>Endereço:</strong> {request.endereco}
                      </span>
                      <span>
                        <strong>Data:</strong> {formatDate(request.data)}
                      </span>
                    </div>
                  </div>

                  <div className="client-request-actions">
                    <button type="button" className="client-action-button">
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
