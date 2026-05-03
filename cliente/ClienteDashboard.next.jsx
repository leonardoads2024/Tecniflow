// Legacy draft kept only as reference. Active route uses ClienteDashboard.jsx.
import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import MetricCard from '../../components/ui/MetricCard';
import PanelCard from '../../components/ui/PanelCard';
import StatusBadge from '../../components/ui/StatusBadge';
import { getClientDashboard } from '../../services/DashboardService';
import './ClienteDashboard.css';

function formatStatus(status) {
  const labels = {
    solicitado: 'Solicitado',
    aceito: 'Aceito',
    em_andamento: 'Em andamento',
    aguardando_confirmacao: 'Aguardando confirmacao',
    concluido: 'Concluido',
    cancelado: 'Cancelado',
    recusado: 'Recusado',
  };

  return labels[status] || 'Sem status';
}

function formatDate(value) {
  if (!value) {
    return 'Nao informado';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Nao informado';
  }

  return date.toLocaleDateString('pt-BR');
}

function getDominantStatus(solicitacoes) {
  const ranking = [
    { key: 'em_andamento', label: 'Em andamento' },
    { key: 'aguardando_confirmacao', label: 'Aguardando confirmacao' },
    { key: 'solicitadas', label: 'Solicitado' },
    { key: 'aceitas', label: 'Aceito' },
    { key: 'concluidas', label: 'Concluido' },
    { key: 'canceladas', label: 'Cancelado' },
    { key: 'recusadas', label: 'Recusado' },
  ];

  const topStatus = ranking.reduce(
    (current, item) => {
      const value = Number(solicitacoes?.[item.key] || 0);
      return value > current.value ? { label: item.label, value } : current;
    },
    { label: 'Sem historico', value: 0 }
  );

  return topStatus.label;
}

export default function ClienteDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError('');

        const data = await getClientDashboard();
        setDashboard(data);
      } catch (err) {
        setError(err.message || 'Erro ao carregar dashboard.');
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const solicitacoes = dashboard?.solicitacoes || {};
  const ultimaSolicitacao = dashboard?.ultima_solicitacao;

  return (
    <DashboardLayout title="Dashboard do Cliente">
      <section className="client-dashboard">
        {loading && (
          <div className="client-dashboard-feedback">
            Carregando dados do dashboard...
          </div>
        )}

        {error && <div className="client-dashboard-error">{error}</div>}

        {!loading && !error && (
          <>
            <div className="client-summary-cards">
              <MetricCard
                label="Solicitacoes abertas"
                value={solicitacoes.solicitadas ?? 0}
                info="Pedidos aguardando atendimento"
              />

              <MetricCard
                label="Em andamento"
                value={solicitacoes.em_andamento ?? 0}
                info="Servicos sendo executados"
              />

              <MetricCard
                label="Concluidos"
                value={solicitacoes.concluidas ?? 0}
                info="Historico de atendimentos finalizados"
              />

              <MetricCard
                label="Total de solicitacoes"
                value={solicitacoes.total ?? 0}
                info="Visao geral da sua conta"
                highlight
                accent="blue"
              />
            </div>

            <div className="client-dashboard-panels">
              <PanelCard
                title="Ultima solicitacao"
                subtitle="Acompanhe o pedido mais recente"
                className="client-dashboard-panel-large"
              >
                {ultimaSolicitacao ? (
                  <div className="client-service-list">
                    <div className="client-service-item">
                      <div>
                        <strong>
                          {ultimaSolicitacao.descricao_servico ||
                            'Servico sem descricao'}
                        </strong>
                        <p>
                          Profissional:{' '}
                          {ultimaSolicitacao.nome_profissional || 'Nao atribuido'}
                        </p>
                      </div>
                      <StatusBadge status={ultimaSolicitacao.status}>
                        {formatStatus(ultimaSolicitacao.status)}
                      </StatusBadge>
                    </div>

                    <div className="client-detail-grid">
                      <div className="client-detail-card">
                        <span>Endereco</span>
                        <strong>{ultimaSolicitacao.endereco || 'Nao informado'}</strong>
                      </div>

                      <div className="client-detail-card">
                        <span>Prioridade</span>
                        <strong>
                          {ultimaSolicitacao.prioridade || 'Nao informada'}
                        </strong>
                      </div>

                      <div className="client-detail-card">
                        <span>Data da solicitacao</span>
                        <strong>
                          {formatDate(ultimaSolicitacao.data_solicitacao)}
                        </strong>
                      </div>

                      <div className="client-detail-card">
                        <span>Conclusao</span>
                        <strong>
                          {formatDate(ultimaSolicitacao.data_conclusao)}
                        </strong>
                      </div>
                    </div>

                    <div className="client-contact-box">
                      <span>Contato do profissional</span>
                      <strong>
                        {ultimaSolicitacao.telefone_profissional ||
                          'Nao informado'}
                      </strong>
                    </div>
                  </div>
                ) : (
                  <div className="client-empty-state">
                    <strong>Nenhuma solicitacao encontrada.</strong>
                    <p>
                      Quando voce criar um pedido, os detalhes aparecerao aqui.
                    </p>
                  </div>
                )}
              </PanelCard>

              <PanelCard title="Resumo rapido" subtitle="Visao geral da conta">
                <div className="client-info-box">
                  <div className="client-info-row">
                    <span>Total de solicitacoes</span>
                    <strong>{solicitacoes.total ?? 0}</strong>
                  </div>

                  <div className="client-info-row">
                    <span>Aguardando confirmacao</span>
                    <strong>{solicitacoes.aguardando_confirmacao ?? 0}</strong>
                  </div>

                  <div className="client-info-row">
                    <span>Status predominante</span>
                    <strong>{getDominantStatus(solicitacoes)}</strong>
                  </div>
                </div>
              </PanelCard>

              <PanelCard title="Panorama da conta" subtitle="Indicadores atuais">
                <div className="client-info-box">
                  <div className="client-info-row">
                    <span>Aceitas</span>
                    <strong>{solicitacoes.aceitas ?? 0}</strong>
                  </div>

                  <div className="client-info-row">
                    <span>Canceladas</span>
                    <strong>{solicitacoes.canceladas ?? 0}</strong>
                  </div>

                  <div className="client-info-row">
                    <span>Recusadas</span>
                    <strong>{solicitacoes.recusadas ?? 0}</strong>
                  </div>
                </div>
              </PanelCard>
            </div>
          </>
        )}
      </section>
    </DashboardLayout>
  );
}
