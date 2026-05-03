import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PanelCard from '../../components/ui/PanelCard';
import RatingStars from '../../components/ui/RatingStars';
import StatusBadge from '../../components/ui/StatusBadge';
import {
  cancelClientServiceRequest,
  confirmClientServiceRequest,
  getClientServiceRequests,
  reportClientServiceRequestIncident,
} from '../../services/clientRequestService';
import { createReview } from '../../services/reviewService';
import './ClienteSolicitacoes.css';

const initialIncidentForm = {
  tipo: 'disputa',
  prioridade: 'media',
  titulo: '',
  descricao: '',
};

const initialReviewForm = {
  nota: 5,
  comentario: '',
};

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

export default function ClienteSolicitacaoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [reportForm, setReportForm] = useState(initialIncidentForm);
  const [reportOpen, setReportOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState(initialReviewForm);
  const [reviewOpen, setReviewOpen] = useState(false);

  const loadRequest = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getClientServiceRequests();
      const selectedRequest = data.find((item) => String(item.id) === String(id));

      if (!selectedRequest) {
        setError('Solicitacao nao encontrada.');
        return;
      }

      setRequest(selectedRequest);
    } catch (err) {
      setError(err?.message || 'Erro ao carregar detalhes da solicitacao.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadRequest();
  }, [loadRequest]);

  const availableActions = useMemo(() => {
    if (!request?.idReferencia) return [];

    const actions = [];

    if (request.status === 'solicitado' || request.status === 'aceito') {
      actions.push({
        key: 'cancel',
        label: 'Cancelar solicitacao',
        className: 'client-action-button danger',
        run: cancelClientServiceRequest,
        successMessage: 'Solicitacao cancelada com sucesso.',
      });
    }

    if (request.status === 'aguardando_confirmacao') {
      actions.push({
        key: 'confirm',
        label: 'Confirmar conclusao',
        className: 'client-action-button confirm',
        run: confirmClientServiceRequest,
        successMessage: 'Conclusao confirmada com sucesso.',
      });
    }

    return actions;
  }, [request]);

  async function handleAction(action) {
    if (!request?.idReferencia) return;

    try {
      setActionLoading(true);
      setError('');
      setFeedback('');

      await action.run(request.idReferencia);
      await loadRequest();
      setFeedback(action.successMessage);
    } catch (err) {
      setError(err?.message || 'Erro ao executar acao.');
    } finally {
      setActionLoading(false);
    }
  }

  function handleIncidentFieldChange(event) {
    const { name, value } = event.target;
    setReportForm((current) => ({ ...current, [name]: value }));
  }

  function handleReviewFieldChange(event) {
    const { name, value } = event.target;
    setReviewForm((current) => ({
      ...current,
      [name]: name === 'nota' ? Number(value) : value,
    }));
  }

  async function handleIncidentSubmit(event) {
    event.preventDefault();

    if (!request?.idReferencia) return;

    try {
      setActionLoading(true);
      setError('');
      setFeedback('');

      await reportClientServiceRequestIncident(request.idReferencia, {
        tipo: reportForm.tipo,
        prioridade: reportForm.prioridade,
        titulo: reportForm.titulo.trim(),
        descricao: reportForm.descricao.trim(),
      });

      setFeedback('Incidente enviado para analise do admin com sucesso.');
      setReportForm(initialIncidentForm);
      setReportOpen(false);
    } catch (err) {
      setError(err?.message || 'Erro ao reportar incidente.');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReviewSubmit(event) {
    event.preventDefault();

    if (!request?.idReferencia) return;

    try {
      setActionLoading(true);
      setError('');
      setFeedback('');

      await createReview({
        id_solicitacao: request.idReferencia,
        nota: reviewForm.nota,
        comentario: reviewForm.comentario.trim(),
      });

      await loadRequest();
      setReviewForm(initialReviewForm);
      setReviewOpen(false);
      setFeedback('Avaliacao enviada com sucesso. Obrigado por fechar o ciclo da solicitacao.');
    } catch (err) {
      setError(err?.message || 'Erro ao enviar avaliacao.');
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <DashboardLayout
      title="Detalhe da Solicitacao"
      showBackButton
      onBack={() => navigate('/cliente/solicitacoes')}
    >
      <section className="client-requests-page">
        {loading && <div className="client-requests-feedback">Carregando detalhes da solicitacao...</div>}
        {error && <div className="client-requests-error">{error}</div>}

        {!loading && !error && request && (
          <>
            {feedback && <div className="client-requests-success">{feedback}</div>}

            <section className="client-request-intent-strip">
              <div className="client-request-intent-card highlight">
                <strong>{request.totalProfissionais}</strong>
                <span>profissionais acionados para esta necessidade</span>
              </div>
              <div className="client-request-intent-card">
                <strong>{request.prioridade || 'Nao informada'}</strong>
                <span>prioridade registrada no pedido</span>
              </div>
              <div className="client-request-intent-card">
                <strong>{request.statusLabel}</strong>
                <span>estado atual da jornada dentro da plataforma</span>
              </div>
            </section>

            <PanelCard
              title={request.titulo}
              subtitle="Acompanhe o pedido agrupado, os profissionais acionados e os proximos passos"
            >
              <div className="client-request-detail-layout">
                <div className="client-request-detail-main">
                  <div className="client-request-header">
                    <strong>{request.titulo}</strong>
                    <StatusBadge status={request.status}>{request.statusLabel}</StatusBadge>
                  </div>

                  <div className="client-request-detail-grid">
                    <div className="client-request-detail-card">
                      <span>Profissionais acionados</span>
                      <strong>{request.totalProfissionais}</strong>
                    </div>
                    <div className="client-request-detail-card">
                      <span>Destaque atual</span>
                      <strong>
                        {request.encaminhamentoPendente
                          ? 'Aguardando encaminhamento'
                          : request.profissional}
                      </strong>
                    </div>
                    <div className="client-request-detail-card">
                      <span>Data da solicitacao</span>
                      <strong>{formatDate(request.data)}</strong>
                    </div>
                    <div className="client-request-detail-card">
                      <span>Data de conclusao</span>
                      <strong>{formatDate(request.dataConclusao)}</strong>
                    </div>
                    <div className="client-request-detail-card">
                      <span>Prioridade</span>
                      <strong>{request.prioridade || 'Nao informada'}</strong>
                    </div>
                    <div className="client-request-detail-card">
                      <span>Custo por lead</span>
                      <strong>
                        {request.precoLead !== null && request.precoLead !== undefined
                          ? `${request.precoLead} credito(s)`
                          : 'Nao informado'}
                      </strong>
                    </div>
                  </div>

                  <div className="client-request-description">
                    <span>Endereco do atendimento</span>
                    <strong>{request.endereco}</strong>
                  </div>

                  {request.encaminhamentoPendente && (
                    <div className="client-request-pending-card">
                      <span>Encaminhamento em aberto</span>
                      <strong>
                        Ainda nao encontramos profissionais disponiveis para esta categoria.
                      </strong>
                      <p>
                        Seu pedido foi salvo com sucesso e segue disponivel para triagem da
                        plataforma. Voce tambem pode explorar a vitrine manualmente enquanto isso.
                      </p>
                    </div>
                  )}

                  {request.profissionaisIndicados?.length > 0 && (
                    <div className="client-request-matches">
                      <div className="client-request-description">
                        <span>Profissionais indicados pela plataforma</span>
                        <strong>O admin e o cliente acompanham este pedido como um unico grupo.</strong>
                      </div>

                      <div className="client-request-matches-list">
                        {request.profissionaisIndicados.map((professional) => (
                          <div className="client-request-match-card" key={professional.idSolicitacao}>
                            <div>
                              <strong>{professional.nomeProfissional}</strong>
                              <p>{professional.descricaoProfissional || 'Sem descricao informada.'}</p>
                            </div>
                            <StatusBadge status={professional.status}>
                              {professional.statusLabel}
                            </StatusBadge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {request.status === 'concluido' && (
                    <div className="client-request-next-step review-state">
                      <span>Etapa final da jornada</span>
                      <strong>
                        {request.jaAvaliada
                          ? 'Sua avaliacao ja foi registrada nesta solicitacao.'
                          : 'Servico concluido. Agora voce pode avaliar o profissional.'}
                      </strong>
                      <p>
                        {request.jaAvaliada
                          ? 'A reputacao do profissional e a qualidade da plataforma ja foram alimentadas com esse feedback.'
                          : 'A avaliacao fecha o fluxo do atendimento e ajuda a plataforma a priorizar os melhores profissionais.'}
                      </p>
                    </div>
                  )}
                </div>

                <div className="client-request-detail-actions">
                  <button
                    type="button"
                    className="client-action-button secondary"
                    onClick={() => navigate('/cliente/solicitacoes')}
                  >
                    Voltar para lista
                  </button>

                  {request.encaminhamentoPendente && (
                    <button
                      type="button"
                      className="client-action-button secondary"
                      onClick={() => navigate('/cliente/profissionais')}
                    >
                      Buscar profissionais
                    </button>
                  )}

                  {availableActions.map((action) => (
                    <button
                      key={action.key}
                      type="button"
                      className={action.className}
                      disabled={actionLoading}
                      onClick={() => handleAction(action)}
                    >
                      {actionLoading ? 'Processando...' : action.label}
                    </button>
                  ))}

                  {request.status === 'concluido' && !request.encaminhamentoPendente && !request.jaAvaliada && (
                    <button
                      type="button"
                      className="client-action-button review"
                      disabled={actionLoading || !request.idReferencia}
                      onClick={() => setReviewOpen((current) => !current)}
                    >
                      {reviewOpen ? 'Fechar avaliacao' : 'Avaliar profissional'}
                    </button>
                  )}

                  {!request.encaminhamentoPendente && (
                    <button
                      type="button"
                      className="client-action-button alert"
                      disabled={actionLoading || !request.idReferencia}
                      onClick={() => setReportOpen((current) => !current)}
                    >
                      {reportOpen ? 'Fechar relato' : 'Reportar problema'}
                    </button>
                  )}

                  {request.jaAvaliada && request.status === 'concluido' && (
                    <div className="client-request-next-step reviewed">
                      A avaliacao deste servico ja foi enviada e nao precisa ser repetida.
                    </div>
                  )}

                  {reviewOpen && request.status === 'concluido' && !request.jaAvaliada && (
                    <form className="incident-report-card review-card" onSubmit={handleReviewSubmit}>
                      <div className="incident-report-header">
                        <strong>Avaliar profissional</strong>
                        <p>Registre sua experiencia para encerrar o atendimento com clareza.</p>
                      </div>

                      <label className="incident-report-field">
                        <span>Nota</span>
                        <select name="nota" value={reviewForm.nota} onChange={handleReviewFieldChange}>
                          <option value={5}>5 - Excelente</option>
                          <option value={4}>4 - Muito bom</option>
                          <option value={3}>3 - Bom</option>
                          <option value={2}>2 - Regular</option>
                          <option value={1}>1 - Ruim</option>
                        </select>
                      </label>

                      <div className="client-review-preview">
                        <RatingStars value={reviewForm.nota} size={16} />
                        <span>Sua nota atual para este atendimento</span>
                      </div>

                      <label className="incident-report-field">
                        <span>Comentario</span>
                        <textarea
                          name="comentario"
                          value={reviewForm.comentario}
                          onChange={handleReviewFieldChange}
                          placeholder="Conte como foi o atendimento, pontualidade, qualidade e confianca."
                        />
                      </label>

                      <button type="submit" className="client-action-button review" disabled={actionLoading}>
                        {actionLoading ? 'Enviando...' : 'Enviar avaliacao'}
                      </button>
                    </form>
                  )}

                  {reportOpen && !request.encaminhamentoPendente && (
                    <form className="incident-report-card" onSubmit={handleIncidentSubmit}>
                      <div className="incident-report-header">
                        <strong>Abrir disputa ou denuncia</strong>
                        <p>Explique o contexto para que a operacao acompanhe o caso.</p>
                      </div>

                      <div className="incident-report-grid">
                        <label className="incident-report-field">
                          <span>Tipo</span>
                          <select name="tipo" value={reportForm.tipo} onChange={handleIncidentFieldChange}>
                            <option value="disputa">Disputa</option>
                            <option value="denuncia">Denuncia</option>
                          </select>
                        </label>

                        <label className="incident-report-field">
                          <span>Prioridade</span>
                          <select
                            name="prioridade"
                            value={reportForm.prioridade}
                            onChange={handleIncidentFieldChange}
                          >
                            <option value="baixa">Baixa</option>
                            <option value="media">Media</option>
                            <option value="alta">Alta</option>
                          </select>
                        </label>
                      </div>

                      <label className="incident-report-field">
                        <span>Titulo</span>
                        <input
                          name="titulo"
                          value={reportForm.titulo}
                          onChange={handleIncidentFieldChange}
                          placeholder="Ex.: divergencia sobre conclusao do servico"
                        />
                      </label>

                      <label className="incident-report-field">
                        <span>Descricao</span>
                        <textarea
                          name="descricao"
                          value={reportForm.descricao}
                          onChange={handleIncidentFieldChange}
                          placeholder="Descreva o ocorrido, impacto e o que espera da plataforma."
                        />
                      </label>

                      <button type="submit" className="client-action-button alert" disabled={actionLoading}>
                        {actionLoading ? 'Enviando...' : 'Enviar para analise'}
                      </button>
                    </form>
                  )}

                  {availableActions.length === 0 && !request.encaminhamentoPendente && (
                    <div className="client-request-next-step">
                      Nenhuma acao disponivel para o status atual do pedido agrupado.
                    </div>
                  )}
                </div>
              </div>
            </PanelCard>
          </>
        )}
      </section>
    </DashboardLayout>
  );
}
