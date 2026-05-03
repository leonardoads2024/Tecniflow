import { ArrowUpRight, Clock3, SearchCheck, ShieldCheck, Sparkles, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DistributionBars from '../../components/ui/DistributionBars';
import MetricCard from '../../components/ui/MetricCard';
import PanelCard from '../../components/ui/PanelCard';
import ProgressRing from '../../components/ui/ProgressRing';
import StatusBadge from '../../components/ui/StatusBadge';
import { getClientDashboard } from '../../services/DashboardService';
import './ClienteDashboard.css';

export default function ClienteDashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const quickJourneyActions = [
    {
      title: 'Explorar especialistas',
      description: 'Use filtros por categoria, premium e verificacao para encontrar mais aderencia.',
      icon: <SearchCheck size={16} />,
      path: '/cliente/profissionais',
    },
    {
      title: 'Abrir novo pedido',
      description: 'Descreva sua necessidade e deixe a plataforma organizar a melhor rota de atendimento.',
      icon: <ArrowUpRight size={16} />,
      path: '/cliente/nova-solicitacao',
    },
    {
      title: 'Avaliar atendimento',
      description: 'Feche o ciclo com reputacao e ajude a qualificar a operacao do marketplace.',
      icon: <Star size={16} />,
      path: '/cliente/solicitacoes',
    },
  ];

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await getClientDashboard();
        setDashboard(data);
      } catch (err) {
        setError(err?.message || 'Erro ao carregar dashboard do cliente.');
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const totalRequests = dashboard?.totalSolicitacoes ?? 0;
  const completionRate = totalRequests > 0 ? ((dashboard?.concluidas ?? 0) / totalRequests) * 100 : 0;
  const attentionRate =
    totalRequests > 0
      ? (((dashboard?.solicitacoesAbertas ?? 0) + (dashboard?.aguardandoConfirmacao ?? 0)) /
          totalRequests) *
        100
      : 0;
  const clientFlowDistribution = [
    { label: 'Solicitadas', value: dashboard?.solicitacoesAbertas ?? 0, tone: 'yellow' },
    { label: 'Em andamento', value: dashboard?.emAndamento ?? 0, tone: 'cyan' },
    {
      label: 'Aguardando confirmação',
      value: dashboard?.aguardandoConfirmacao ?? 0,
      tone: 'green',
    },
    { label: 'Concluídas', value: dashboard?.concluidas ?? 0, tone: 'green' },
    {
      label: 'Interrompidas',
      value: (dashboard?.canceladas ?? 0) + (dashboard?.recusadas ?? 0),
      tone: 'red',
    },
  ];

  return (
    <DashboardLayout title="Dashboard do Cliente">
      <section className="client-dashboard">
        {loading && <div className="dashboard-feedback">Carregando dashboard...</div>}
        {error && <div className="dashboard-error">{error}</div>}

        {!loading && !error && dashboard && (
          <>
            <section className="client-dashboard-hero">
              <div className="client-dashboard-hero-copy">
                <span className="client-dashboard-kicker">Painel de jornada do cliente</span>
                <h3>Abra pedidos com mais clareza e acompanhe o atendimento sem perder contexto.</h3>
                <p>
                  O TECNIFLOW foi desenhado para transformar uma necessidade tecnica em um fluxo com
                  matching, acompanhamento e fechamento mais confiavel.
                </p>
              </div>

              <div className="client-dashboard-hero-stack">
                <div className="client-hero-card standout">
                  <Sparkles size={18} />
                  <strong>{dashboard.totalSolicitacoes ?? 0}</strong>
                  <span>pedidos movendo sua jornada dentro da plataforma</span>
                </div>
                <div className="client-hero-card">
                  <ShieldCheck size={18} />
                  <strong>{dashboard.aguardandoConfirmacao ?? 0}</strong>
                  <span>servicos aguardando sua validacao final</span>
                </div>
              </div>
            </section>

            <div className="client-dashboard-actions">
              <button
                type="button"
                className="client-new-request-button"
                onClick={() => navigate('/cliente/nova-solicitacao')}
              >
                Nova solicitacao
                <ArrowUpRight size={16} />
              </button>

              <button
                type="button"
                className="client-secondary-action-button"
                onClick={() => navigate('/ajuda')}
              >
                Preciso de ajuda
              </button>
            </div>

            <section className="client-command-strip">
              {quickJourneyActions.map((action) => (
                <button
                  type="button"
                  key={action.title}
                  className="client-command-card"
                  onClick={() => navigate(action.path)}
                >
                  <div className="client-command-icon">{action.icon}</div>
                  <div>
                    <strong>{action.title}</strong>
                    <span>{action.description}</span>
                  </div>
                </button>
              ))}
            </section>

            <div className="client-summary-cards">
              <MetricCard
                label="Solicitações abertas"
                value={dashboard.solicitacoesAbertas ?? 0}
                info="Pedidos aguardando resposta inicial"
                highlight
                accent="yellow"
              />

              <MetricCard
                label="Em andamento"
                value={dashboard.emAndamento ?? 0}
                info="Atendimentos em execução"
              />

              <MetricCard
                label="Concluídos"
                value={dashboard.concluidas ?? 0}
                info="Histórico de serviços finalizados"
                highlight
                accent="green"
              />

              <MetricCard
                label="Aguardando confirmação"
                value={dashboard.aguardandoConfirmacao ?? 0}
                info="Serviços esperando resposta do cliente"
                highlight
                accent="blue"
              />
            </div>

            <div className="client-dashboard-panels">
              <PanelCard
                title="Último pedido em destaque"
                subtitle="A forma mais rápida de retomar a sua jornada atual"
                className="client-dashboard-panel-large"
              >
                <div className="client-service-list">
                  {(dashboard.solicitacoesRecentes || []).length > 0 ? (
                    dashboard.solicitacoesRecentes.map((item, index) => (
                      <div className="client-service-item" key={item.id || index}>
                        <div>
                          <strong>{item.titulo || item.descricao_servico || 'Solicitação'}</strong>
                          <p>Profissional: {item.nome_profissional || 'Em definição pelo fluxo'}</p>
                        </div>

                        <StatusBadge status={item.status || 'solicitado'}>
                          {item.status || 'Solicitado'}
                        </StatusBadge>
                      </div>
                    ))
                  ) : (
                    <div className="client-empty-state">
                      <strong>Nenhuma solicitacao recente ainda</strong>
                      <p>Comece explorando os profissionais da plataforma para abrir seu primeiro pedido.</p>
                    </div>
                  )}
                </div>
              </PanelCard>

              <PanelCard title="Resumo da conta" subtitle="Visão rápida da sua operação como cliente">
                <div className="client-info-box">
                  <div className="client-info-row">
                    <span>Total de solicitações</span>
                    <strong>{dashboard.totalSolicitacoes ?? 0}</strong>
                  </div>

                  <div className="client-info-row">
                    <span>Último serviço</span>
                    <strong>{dashboard.ultimoServico || 'Não informado'}</strong>
                  </div>

                  <div className="client-info-row">
                    <span>Status predominante</span>
                    <strong>{dashboard.statusPredominante || 'Não informado'}</strong>
                  </div>
                </div>
              </PanelCard>

              <PanelCard
                title="Mapa visual das solicitações"
                subtitle="Leitura moderna do funil atual para você entender o momento da jornada"
              >
                <DistributionBars items={clientFlowDistribution} />
              </PanelCard>

              <PanelCard title="Próximos passos" subtitle="Ações que ajudam a acelerar sua jornada">
                <div className="client-review-list">
                  <div className="client-review-item accent-cyan">
                    <strong>Explorar profissionais</strong>
                    <p>Use filtros por categoria, selo premium e verificação para encontrar mais aderência.</p>
                  </div>
                  <div className="client-review-item accent-green">
                    <strong>Acompanhar pedidos</strong>
                    <p>Centralize o andamento e confirme a conclusão quando o atendimento for finalizado.</p>
                  </div>
                  <div className="client-review-item accent-amber">
                    <strong>Avaliar e reportar</strong>
                    <p>Reputação e incidentes ajudam a plataforma a melhorar a experiência de ponta a ponta.</p>
                  </div>
                </div>
              </PanelCard>

              <PanelCard
                title="Eficiência da jornada"
                subtitle="Indicadores rápidos de fechamento e de atenção que ainda pedem ação"
              >
                <div className="progress-ring-grid">
                  <ProgressRing
                    value={completionRate}
                    tone="green"
                    label="Taxa de conclusão"
                    subtitle={`${dashboard.concluidas ?? 0} de ${totalRequests} pedidos já chegaram ao fim.`}
                  />
                  <ProgressRing
                    value={attentionRate}
                    tone="cyan"
                    label="Itens pedindo atenção"
                    subtitle={`${(dashboard.solicitacoesAbertas ?? 0) + (dashboard.aguardandoConfirmacao ?? 0)} pedidos ainda precisam de avanço ou confirmação.`}
                  />
                </div>
              </PanelCard>

              <PanelCard title="Ritmo de atendimento" subtitle="Leitura rápida do que pede sua atenção agora">
                <div className="client-rhythm-grid">
                  <div className="client-rhythm-card">
                    <Clock3 size={16} />
                    <strong>{dashboard.solicitacoesAbertas ?? 0}</strong>
                    <span>pedidos ainda abertos</span>
                  </div>
                  <div className="client-rhythm-card">
                    <ShieldCheck size={16} />
                    <strong>{dashboard.aguardandoConfirmacao ?? 0}</strong>
                    <span>esperando sua confirmação</span>
                  </div>
                </div>
              </PanelCard>

              <PanelCard
                title="Leitura da jornada"
                subtitle="Como o TECNIFLOW conduz sua necessidade da abertura ao fechamento"
              >
                <div className="client-journey-rail">
                  <div className="client-journey-step">
                    <span>01</span>
                    <div>
                      <strong>Necessidade registrada</strong>
                      <p>Você entra por categoria e descreve o contexto do serviço com prioridade e local.</p>
                    </div>
                  </div>

                  <div className="client-journey-step">
                    <span>02</span>
                    <div>
                      <strong>Oferta elegível</strong>
                      <p>A plataforma organiza profissionais por aderência, reputação e destaque comercial.</p>
                    </div>
                  </div>

                  <div className="client-journey-step">
                    <span>03</span>
                    <div>
                      <strong>Fechamento com segurança</strong>
                      <p>Você acompanha o atendimento, confirma a conclusão e deixa sua avaliação final.</p>
                    </div>
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

