import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatusBadge from '../../components/ui/StatusBadge';
import PanelCard from '../../components/ui/PanelCard';
import MetricCard from '../../components/ui/MetricCard';
import { getProfessionalServiceRequests } from '../../services/serviceRequestService';
import {
  addCredits,
  getCreditDashboard,
  getWallet,
  unlockLead,
} from '../../services/creditWalletService';
import {
  acceptServiceRequest,
  startServiceRequest,
  awaitConfirmationServiceRequest,
  concludeServiceRequest,
  rejectServiceRequest,
} from '../../services/professionalActionService';
import './ProfissionalServicos.css';

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

export default function ProfissionalServicos() {
  const [requests, setRequests] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [wallet, setWallet] = useState({ saldo: 0 });
  const [creditDashboard, setCreditDashboard] = useState({
    saldoCreditos: 0,
    leadsLiberados: 0,
    creditosComprados: 0,
    creditosUtilizados: 0,
  });

  async function loadRequests(showLoading = true) {
    try {
      if (showLoading) {
        setLoading(true);
      }

      setError('');

      const [data, walletData, creditData] = await Promise.all([
        getProfessionalServiceRequests(),
        getWallet(),
        getCreditDashboard(),
      ]);

      setRequests(data);
      setWallet(walletData);
      setCreditDashboard(creditData);
    } catch (err) {
      setError(err?.message || 'Erro ao carregar solicitações do profissional.');
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  const metrics = useMemo(() => {
    return {
      total: requests.length,
      aguardando: requests.filter(
        (item) => item.status === 'aguardando_confirmacao'
      ).length,
      andamento: requests.filter(
        (item) => item.status === 'em_andamento'
      ).length,
      concluidas: requests.filter(
        (item) => item.status === 'concluido'
      ).length,
      liberados: requests.filter((item) => item.leadLiberado).length,
    };
  }, [requests]);

  const filteredRequests = useMemo(() => {
    if (selectedStatus === 'todos') {
      return requests;
    }

    return requests.filter((item) => item.status === selectedStatus);
  }, [requests, selectedStatus]);

  function getPrimaryAction(request) {
    if (request.status === 'solicitado') {
      return {
        label: 'Aceitar',
        action: acceptServiceRequest,
        successMessage: 'Solicitação aceita com sucesso.',
        className: 'service-action-button primary',
      };
    }

    if (request.status === 'aceito') {
      return {
        label: 'Iniciar',
        action: startServiceRequest,
        successMessage: 'Serviço iniciado com sucesso.',
        className: 'service-action-button primary',
      };
    }

    if (request.status === 'em_andamento') {
      return {
        label: 'Aguardar confirmação',
        action: awaitConfirmationServiceRequest,
        successMessage: 'Serviço enviado para aguardando confirmação.',
        className: 'service-action-button primary',
      };
    }

    if (request.status === 'aguardando_confirmacao') {
      return {
        label: 'Concluir',
        action: concludeServiceRequest,
        successMessage: 'Serviço concluído com sucesso.',
        className: 'service-action-button primary',
      };
    }

    return null;
  }

  function getSecondaryAction(request) {
    if (request.status === 'solicitado') {
      return {
        label: 'Recusar',
        action: rejectServiceRequest,
        successMessage: 'Solicitação recusada com sucesso.',
        className: 'service-action-button danger',
      };
    }

    return null;
  }

  async function handleRequestAction(request, actionConfig) {
    if (!actionConfig) return;

    try {
      setActionLoadingId(request.id);
      setError('');
      setFeedback('');

      await actionConfig.action(request.id);

      setFeedback(actionConfig.successMessage);
      await loadRequests(false);
    } catch (err) {
      setError(err?.message || 'Erro ao executar ação na solicitação.');
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleAddCredits() {
    try {
      setError('');
      setFeedback('');
      await addCredits(10);
      setFeedback('10 creditos adicionados com sucesso.');
      await loadRequests(false);
    } catch (err) {
      setError(err?.message || 'Erro ao adicionar creditos.');
    }
  }

  async function handleUnlockLead(request) {
    try {
      setActionLoadingId(request.id);
      setError('');
      setFeedback('');
      await unlockLead(request.id);
      setFeedback('Lead liberado com sucesso.');
      await loadRequests(false);
    } catch (err) {
      setError(err?.message || 'Erro ao liberar lead.');
    } finally {
      setActionLoadingId(null);
    }
  }

  return (
    <DashboardLayout title="Serviços do Profissional">
      <section className="professional-services-page">
        <div className="professional-services-summary">
          <MetricCard
            label="Total de solicitações"
            value={metrics.total}
            info="Todas as solicitações recebidas"
          />
          <MetricCard
            label="Aguardando confirmação"
            value={metrics.aguardando}
            info="Pendentes de confirmação"
            highlight
            accent="yellow"
          />
          <MetricCard
            label="Em andamento"
            value={metrics.andamento}
            info="Serviços ativos"
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
          title="Gerenciamento de solicitações"
          subtitle="Acompanhe e filtre os serviços por status"
        >
          <div className="professional-services-toolbar">
            <div className="professional-services-filter-group">
              <label htmlFor="statusFilter">Filtrar por status</label>
              <select
                id="statusFilter"
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

          {feedback && (
            <div className="professional-services-success">
              {feedback}
            </div>
          )}

          {loading && (
            <div className="professional-services-feedback">
              Carregando solicitações...
            </div>
          )}

          {error && (
            <div className="professional-services-error">
              {error}
            </div>
          )}

          {!loading && !error && filteredRequests.length === 0 && (
            <div className="professional-services-empty">
              Nenhuma solicitação encontrada para o filtro selecionado.
            </div>
          )}

          {!loading && !error && filteredRequests.length > 0 && (
            <div className="professional-services-list">
              {filteredRequests.map((request) => {
                const primaryAction = getPrimaryAction(request);
                const secondaryAction = getSecondaryAction(request);
                const isActing = actionLoadingId === request.id;

                return (
                  <div className="professional-service-card" key={request.id}>
                    <div className="professional-service-main">
                      <div className="professional-service-header">
                        <strong>{request.titulo}</strong>
                        <StatusBadge status={request.status}>
                          {request.statusLabel}
                        </StatusBadge>
                      </div>

                      <div className="professional-service-meta">
                        <span>
                          <strong>Cliente:</strong> {request.cliente}
                        </span>
                        <span>
                          <strong>Endereço:</strong> {request.endereco}
                        </span>
                        <span>
                          <strong>Data:</strong> {formatDate(request.data)}
                        </span>
                      </div>
                    </div>

                    <div className="professional-service-actions">
                      {secondaryAction && (
                        <button
                          type="button"
                          className={secondaryAction.className}
                          disabled={isActing}
                          onClick={() =>
                            handleRequestAction(request, secondaryAction)
                          }
                        >
                          {isActing ? 'Processando...' : secondaryAction.label}
                        </button>
                      )}

                      {primaryAction && (
                        <button
                          type="button"
                          className={primaryAction.className}
                          disabled={isActing}
                          onClick={() =>
                            handleRequestAction(request, primaryAction)
                          }
                        >
                          {isActing ? 'Processando...' : primaryAction.label}
                        </button>
                      )}

                      {!primaryAction && !secondaryAction && (
                        <button
                          type="button"
                          className="service-action-button muted"
                          disabled
                        >
                          Sem ação disponível
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </PanelCard>
      </section>
    </DashboardLayout>
  );
}
