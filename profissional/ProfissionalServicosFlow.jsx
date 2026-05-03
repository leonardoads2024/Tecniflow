import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  reportServiceRequestIncident,
} from '../../services/professionalActionService';
import './ProfissionalServicos.css';

const initialIncidentForm = {
  tipo: 'disputa',
  prioridade: 'media',
  titulo: '',
  descricao: '',
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

export default function ProfissionalServicosFlow() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [reportingRequestId, setReportingRequestId] = useState(null);
  const [incidentForms, setIncidentForms] = useState({});
  const [wallet, setWallet] = useState({ saldo: 0 });
  const [creditDashboard, setCreditDashboard] = useState({
    saldoCreditos: 0,
    leadsLiberados: 0,
    creditosComprados: 0,
    creditosUtilizados: 0,
  });

  async function loadRequests(showLoading = true) {
    try {
      if (showLoading) setLoading(true);
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
      if (showLoading) setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  const metrics = useMemo(
    () => ({
      total: requests.length,
      aguardando: requests.filter((item) => item.status === 'aguardando_confirmacao').length,
      andamento: requests.filter((item) => item.status === 'em_andamento').length,
      concluidas: requests.filter((item) => item.status === 'concluido').length,
      liberados: requests.filter((item) => item.leadLiberado).length,
    }),
    [requests]
  );

  const filteredRequests = useMemo(() => {
    if (selectedStatus === 'todos') return requests;
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
        label: 'Solicitar confirmação',
        action: awaitConfirmationServiceRequest,
        successMessage: 'Serviço enviado para confirmação do cliente.',
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

  function getIncidentForm(requestId) {
    return incidentForms[requestId] || initialIncidentForm;
  }

  function handleIncidentFieldChange(requestId, event) {
    const { name, value } = event.target;

    setIncidentForms((current) => ({
      ...current,
      [requestId]: {
        ...getIncidentForm(requestId),
        [name]: value,
      },
    }));
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
      setFeedback('10 créditos adicionados com sucesso.');
      await loadRequests(false);
    } catch (err) {
      setError(err?.message || 'Erro ao adicionar créditos.');
    } finally {
      setActionLoadingId(null);
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

  async function handleIncidentSubmit(requestId, event) {
    event.preventDefault();

    const form = getIncidentForm(requestId);

    try {
      setActionLoadingId(requestId);
      setError('');
      setFeedback('');

      await reportServiceRequestIncident(requestId, {
        tipo: form.tipo,
        prioridade: form.prioridade,
        titulo: form.titulo.trim(),
        descricao: form.descricao.trim(),
      });

      setFeedback('Incidente enviado para análise administrativa.');
      setIncidentForms((current) => ({
        ...current,
        [requestId]: initialIncidentForm,
      }));
      setReportingRequestId(null);
    } catch (err) {
      setError(err?.message || 'Erro ao reportar incidente.');
    } finally {
      setActionLoadingId(null);
    }
  }

  return (
    <DashboardLayout title="Serviços do Profissional">
      <section className="professional-services-page">
        <section className="professional-services-overview">
          <div className="professional-services-overview-card highlight">
            <strong>{filteredRequests.length}</strong>
            <span>leads no filtro atual</span>
          </div>
          <div className="professional-services-overview-card">
            <strong>{requests.filter((item) => !item.leadLiberado).length}</strong>
            <span>leads ainda protegidos</span>
          </div>
          <div className="professional-services-overview-card">
            <strong>{creditDashboard.creditosUtilizados}</strong>
            <span>creditos já convertidos em contato</span>
          </div>
        </section>

        <div className="professional-services-summary">
          <MetricCard
            label="Total de solicitações"
            value={metrics.total}
            info="Todas as oportunidades recebidas"
          />
          <MetricCard
            label="Aguardando confirmação"
            value={metrics.aguardando}
            info="Pendentes de resposta do cliente"
            highlight
            accent="yellow"
          />
          <MetricCard
            label="Em andamento"
            value={metrics.andamento}
            info="Serviços ativos"
          />
          <MetricCard
            label="Leads liberados"
            value={metrics.liberados}
            info={`Saldo atual: ${wallet.saldo ?? 0} créditos`}
            highlight
            accent="blue"
          />
        </div>

        <PanelCard
          title="Carteira e desbloqueio"
          subtitle="Use créditos para acessar os dados completos dos clientes"
        >
          <div className="professional-wallet-grid">
            <div className="professional-wallet-card">
              <span>Saldo atual</span>
              <strong>{creditDashboard.saldoCreditos} créditos</strong>
            </div>
            <div className="professional-wallet-card">
              <span>Leads liberados</span>
              <strong>{creditDashboard.leadsLiberados}</strong>
            </div>
            <div className="professional-wallet-card">
              <span>Créditos comprados</span>
              <strong>{creditDashboard.creditosComprados}</strong>
            </div>
            <div className="professional-wallet-card">
              <span>Créditos utilizados</span>
              <strong>{creditDashboard.creditosUtilizados}</strong>
            </div>
          </div>

          <div className="professional-wallet-actions">
            <button
              type="button"
              className="service-action-button primary"
              onClick={handleAddCredits}
            >
              Adicionar 10 créditos
            </button>
          </div>
        </PanelCard>

        <PanelCard
          title="Gerenciamento de solicitações"
          subtitle="Acompanhe os leads, libere dados e avance no fluxo do serviço"
        >
          <div className="professional-services-journey">
            <div className="professional-services-journey-step">
              <span>01</span>
              <div>
                <strong>O lead chega protegido</strong>
                <p>Você vê contexto, prioridade e custo antes de decidir liberar o contato.</p>
              </div>
            </div>
            <div className="professional-services-journey-step">
              <span>02</span>
              <div>
                <strong>O atendimento avança no funil</strong>
                <p>Aceite, início e confirmação mantêm a operação clara para cliente e plataforma.</p>
              </div>
            </div>
            <div className="professional-services-journey-step">
              <span>03</span>
              <div>
                <strong>Reputação e recorrência crescem</strong>
                <p>Conclusão e avaliação fortalecem seu perfil e aumentam tração futura.</p>
              </div>
            </div>
          </div>

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

          {feedback && <div className="professional-services-success">{feedback}</div>}
          {loading && <div className="professional-services-feedback">Carregando solicitações...</div>}
          {error && <div className="professional-services-error">{error}</div>}

          {!loading && !error && filteredRequests.length === 0 && (
            <div className="professional-services-empty">
              <strong>Nenhuma solicitacao encontrada para o filtro selecionado.</strong>
              <p>
                Enquanto nao houver novos leads, vale revisar seu perfil, assinatura e estrategia
                de visibilidade dentro da plataforma.
              </p>
              <div className="professional-services-empty-actions">
                <button
                  type="button"
                  className="service-action-button"
                  onClick={() => setSelectedStatus('todos')}
                >
                  Mostrar tudo
                </button>
                <button
                  type="button"
                  className="service-action-button primary"
                  onClick={() => navigate('/profissional/assinatura')}
                >
                  Ver plano premium
                </button>
              </div>
            </div>
          )}

          {!loading && !error && filteredRequests.length > 0 && (
            <div className="professional-services-list">
              {filteredRequests.map((request) => {
                const primaryAction = getPrimaryAction(request);
                const secondaryAction = getSecondaryAction(request);
                const isActing = actionLoadingId === request.id;
                const reportForm = getIncidentForm(request.id);
                const isReportingOpen = reportingRequestId === request.id;

                return (
                  <div className="professional-service-card" key={request.id}>
                    <div className="professional-service-main">
                      <div className="professional-service-header">
                        <strong>{request.titulo}</strong>
                        <StatusBadge status={request.status}>{request.statusLabel}</StatusBadge>
                      </div>

                      <div className="professional-service-meta">
                        <span>
                          <strong>Cliente:</strong> {request.cliente}
                        </span>
                        <span>
                          <strong>Telefone:</strong>{' '}
                          {request.leadLiberado
                            ? request.telefoneCliente || 'Não informado'
                            : 'Disponível após liberar lead'}
                        </span>
                        <span>
                          <strong>Endereço:</strong> {request.endereco}
                        </span>
                        <span>
                          <strong>Prioridade:</strong> {request.prioridade || 'Não informada'}
                        </span>
                        <span>
                          <strong>Custo do lead:</strong> {request.precoLead ?? 0} crédito(s)
                        </span>
                        <span>
                          <strong>Data:</strong> {formatDate(request.data)}
                        </span>
                      </div>
                    </div>

                    <div className="professional-service-actions">
                      {!request.leadLiberado && (
                        <button
                          type="button"
                          className="service-action-button unlock"
                          disabled={isActing}
                          onClick={() => handleUnlockLead(request)}
                        >
                          {isActing ? 'Processando...' : 'Liberar lead'}
                        </button>
                      )}

                      {secondaryAction && (
                        <button
                          type="button"
                          className={secondaryAction.className}
                          disabled={isActing}
                          onClick={() => handleRequestAction(request, secondaryAction)}
                        >
                          {isActing ? 'Processando...' : secondaryAction.label}
                        </button>
                      )}

                      {primaryAction && (
                        <button
                          type="button"
                          className={primaryAction.className}
                          disabled={isActing}
                          onClick={() => handleRequestAction(request, primaryAction)}
                        >
                          {isActing ? 'Processando...' : primaryAction.label}
                        </button>
                      )}

                      <button
                        type="button"
                        className="service-action-button alert"
                        disabled={isActing}
                        onClick={() =>
                          setReportingRequestId((current) =>
                            current === request.id ? null : request.id
                          )
                        }
                      >
                        {isReportingOpen ? 'Fechar relato' : 'Reportar incidente'}
                      </button>

                      {!primaryAction && !secondaryAction && request.leadLiberado && (
                        <button type="button" className="service-action-button muted" disabled>
                          Sem ação disponível
                        </button>
                      )}
                    </div>

                    {isReportingOpen && (
                      <form
                        className="professional-incident-form"
                        onSubmit={(event) => handleIncidentSubmit(request.id, event)}
                      >
                        <div className="professional-incident-header">
                          <strong>Registrar disputa ou denúncia</strong>
                          <p>Use este relato para acionar a operação com contexto claro.</p>
                        </div>

                        <div className="professional-incident-grid">
                          <label className="professional-incident-field">
                            <span>Tipo</span>
                            <select
                              name="tipo"
                              value={reportForm.tipo}
                              onChange={(event) => handleIncidentFieldChange(request.id, event)}
                            >
                              <option value="disputa">Disputa</option>
                              <option value="denuncia">Denúncia</option>
                            </select>
                          </label>

                          <label className="professional-incident-field">
                            <span>Prioridade</span>
                            <select
                              name="prioridade"
                              value={reportForm.prioridade}
                              onChange={(event) => handleIncidentFieldChange(request.id, event)}
                            >
                              <option value="baixa">Baixa</option>
                              <option value="media">Média</option>
                              <option value="alta">Alta</option>
                            </select>
                          </label>
                        </div>

                        <label className="professional-incident-field">
                          <span>Título</span>
                          <input
                            name="titulo"
                            value={reportForm.titulo}
                            onChange={(event) => handleIncidentFieldChange(request.id, event)}
                            placeholder="Ex.: divergência no escopo do atendimento"
                          />
                        </label>

                        <label className="professional-incident-field">
                          <span>Descrição</span>
                          <textarea
                            name="descricao"
                            value={reportForm.descricao}
                            onChange={(event) => handleIncidentFieldChange(request.id, event)}
                            placeholder="Descreva o ocorrido, impacto e a ajuda esperada do admin."
                          />
                        </label>

                        <button
                          type="submit"
                          className="service-action-button alert"
                          disabled={isActing}
                        >
                          {isActing ? 'Enviando...' : 'Enviar incidente'}
                        </button>
                      </form>
                    )}
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
