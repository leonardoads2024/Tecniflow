import { Activity, BadgeAlert, BriefcaseBusiness, Gem, Radar, ShieldCheck, TrendingUp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import MetricCard from '../../components/ui/MetricCard';
import PanelCard from '../../components/ui/PanelCard';
import { getAdminDashboard } from '../../services/adminService';
import '../profissional/ProfissionalDashboard.css';
import './AdminPages.css';

const EMPTY_SECTION = {};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError('');
        const data = await getAdminDashboard();
        setDashboard(data);
      } catch (err) {
        setError(err?.message || 'Erro ao carregar o painel administrativo.');
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const usuarios = dashboard?.usuarios || EMPTY_SECTION;
  const solicitacoes = dashboard?.solicitacoes || EMPTY_SECTION;
  const financeiro = dashboard?.financeiro || EMPTY_SECTION;
  const assinaturas = dashboard?.assinaturas || EMPTY_SECTION;

  const operationalPulse = useMemo(() => {
    const total = Number(solicitacoes.total || 0);
    const openDemand =
      Number(solicitacoes.solicitadas || 0) +
      Number(solicitacoes.aceitas || 0) +
      Number(solicitacoes.em_andamento || 0) +
      Number(solicitacoes.aguardando_confirmacao || 0);
    const stalledDemand =
      Number(solicitacoes.canceladas || 0) + Number(solicitacoes.recusadas || 0);
    const resolutionRate = total > 0
      ? Math.round((Number(solicitacoes.concluidas || 0) / total) * 100)
      : 0;

    return {
      total,
      openDemand,
      stalledDemand,
      resolutionRate,
    };
  }, [solicitacoes]);

  const funnelStages = [
    { label: 'Entrada de demanda', value: Number(solicitacoes.solicitadas || 0), tone: 'blue' },
    {
      label: 'Profissionais engajados',
      value: Number(solicitacoes.aceitas || 0) + Number(solicitacoes.em_andamento || 0),
      tone: 'green',
    },
    {
      label: 'Pendências de fechamento',
      value: Number(solicitacoes.aguardando_confirmacao || 0),
      tone: 'yellow',
    },
    {
      label: 'Atrito operacional',
      value: Number(solicitacoes.canceladas || 0) + Number(solicitacoes.recusadas || 0),
      tone: 'red',
    },
  ];

  const quickActions = [
    {
      title: 'Revisar profissionais',
      description: 'Validar perfis, selos e qualidade da oferta antes de escalar a aquisição.',
      path: '/admin/profissionais',
      icon: <BriefcaseBusiness size={18} />,
    },
    {
      title: 'Monitorar solicitações',
      description: 'Investigar gargalos por cliente, categoria ou profissional com a busca operacional.',
      path: '/admin/solicitacoes',
      icon: <Radar size={18} />,
    },
    {
      title: 'Acompanhar incidentes',
      description: 'Centralizar disputas, denúncias e revisões operacionais da plataforma.',
      path: '/admin/incidentes',
      icon: <BadgeAlert size={18} />,
    },
    {
      title: 'Ler avaliações críticas',
      description: 'Identificar notas baixas, comentários sensíveis e riscos de reputação do marketplace.',
      path: '/admin/avaliacoes',
      icon: <TrendingUp size={18} />,
    },
    {
      title: 'Auditar a operação',
      description: 'Rastrear alterações administrativas e manter governança mínima da base.',
      path: '/admin/auditoria',
      icon: <Activity size={18} />,
    },
  ];

  const watchlist = [
    {
      label: 'Demanda em aberto',
      value: operationalPulse.openDemand,
      helper: 'Solicitações aguardando algum tipo de resposta da operação.',
      tone: operationalPulse.openDemand > 0 ? 'blue' : 'gray',
    },
    {
      label: 'Taxa de resolução',
      value: `${operationalPulse.resolutionRate}%`,
      helper: 'Percentual de solicitações que chegaram ao status concluído.',
      tone: operationalPulse.resolutionRate >= 60 ? 'green' : operationalPulse.resolutionRate >= 30 ? 'yellow' : 'red',
    },
    {
      label: 'Assinaturas ativas',
      value: Number(assinaturas.ativas || 0),
      helper: 'Base premium ativa para ganho de visibilidade e receita recorrente.',
      tone: Number(assinaturas.ativas || 0) > 0 ? 'yellow' : 'gray',
    },
    {
      label: 'Atrito operacional',
      value: operationalPulse.stalledDemand,
      helper: 'Cancelamentos e recusas que merecem leitura de causa.',
      tone: operationalPulse.stalledDemand > 0 ? 'red' : 'green',
    },
  ];

  const executivePriorities = [
    {
      title: 'Equilibrar oferta e demanda',
      description: 'Garantir profissionais suficientes nas categorias com maior pressão operacional.',
      icon: <ShieldCheck size={16} />,
    },
    {
      title: 'Reduzir atrito no funil',
      description: 'Ler recusas, cancelamentos e pendências antes que impactem confiança e conversão.',
      icon: <BadgeAlert size={16} />,
    },
    {
      title: 'Proteger monetização',
      description: 'Acompanhar premium, créditos e qualidade da entrega para sustentar crescimento.',
      icon: <Gem size={16} />,
    },
  ];

  return (
    <DashboardLayout title="Admin Dashboard">
      <section className="admin-page">
        {loading && <div className="dashboard-feedback">Carregando operação da plataforma...</div>}
        {error && <div className="dashboard-error">{error}</div>}

        {!loading && !error && dashboard && (
          <>
            <section className="admin-hero">
              <div className="admin-hero-copy">
                <span className="admin-hero-eyebrow">Centro de operação TECNIFLOW</span>
                <h3>Controle a oferta, acompanhe a demanda e reaja rápido aos sinais do marketplace.</h3>
                <p>
                  O foco aqui é manter equilíbrio entre aquisição, conversão de leads, qualidade dos
                  profissionais e confiança do cliente.
                </p>

                <div className="admin-hero-actions">
                  <button
                    type="button"
                    className="admin-hero-button"
                    onClick={() => navigate('/ajuda')}
                  >
                    Ver guia da operação
                  </button>
                </div>
              </div>

              <div className="admin-hero-metrics">
                <div className="admin-hero-stat accent-cyan">
                  <span>Demanda aberta</span>
                  <strong>{operationalPulse.openDemand}</strong>
                  <small>solicitações em fluxo agora</small>
                </div>
                <div className="admin-hero-stat accent-amber">
                  <span>Resolução</span>
                  <strong>{operationalPulse.resolutionRate}%</strong>
                  <small>fechamento do funil até conclusão</small>
                </div>
              </div>
            </section>

            <section className="admin-command-band">
              <div className="admin-command-card">
                <Gem size={18} />
                <strong>{financeiro.creditos_comprados || 0}</strong>
                <span>créditos comprados pela base profissional</span>
              </div>
              <div className="admin-command-card">
                <TrendingUp size={18} />
                <strong>{financeiro.creditos_utilizados || 0}</strong>
                <span>créditos efetivamente consumidos em leads</span>
              </div>
              <div className="admin-command-card">
                <Radar size={18} />
                <strong>{operationalPulse.stalledDemand}</strong>
                <span>sinais de atrito operacional pedindo leitura</span>
              </div>
            </section>

            <section className="admin-priority-strip">
              {executivePriorities.map((item) => (
                <div className="admin-priority-card" key={item.title}>
                  <div className="admin-priority-icon">{item.icon}</div>
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.description}</span>
                  </div>
                </div>
              ))}
            </section>

            <div className="summary-cards">
              <MetricCard
                label="Usuários cadastrados"
                value={usuarios.total || 0}
                info={`${usuarios.ativos || 0} ativos na base`}
                highlight
                accent="blue"
              />
              <MetricCard
                label="Profissionais"
                value={usuarios.profissionais || 0}
                info={`${usuarios.clientes || 0} clientes`}
              />
              <MetricCard
                label="Solicitações"
                value={solicitacoes.total || 0}
                info={`${solicitacoes.concluidas || 0} concluídas`}
                highlight
                accent="green"
              />
              <MetricCard
                label="Assinaturas ativas"
                value={assinaturas.ativas || 0}
                info={`${assinaturas.total || 0} no histórico`}
                highlight
                accent="yellow"
              />
            </div>

            <div className="admin-grid-two">
              <PanelCard
                title="Radar operacional"
                subtitle="Leitura rápida dos pontos que mais impactam experiência e monetização"
              >
                <div className="admin-watchlist">
                  {watchlist.map((item) => (
                    <div className="admin-watch-item" key={item.label}>
                      <div>
                        <strong>{item.label}</strong>
                        <p>{item.helper}</p>
                      </div>
                      <span className={`status-badge-ui ${item.tone}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </PanelCard>

              <PanelCard
                title="Ações rápidas"
                subtitle="Atalhos para as frentes de operação mais importantes do marketplace"
              >
                <div className="admin-actions-grid">
                  {quickActions.map((action) => (
                    <button
                      type="button"
                      key={action.path}
                      className="admin-action-card"
                      onClick={() => navigate(action.path)}
                    >
                      <div className="admin-action-icon">{action.icon}</div>
                      <strong>{action.title}</strong>
                      <p>{action.description}</p>
                    </button>
                  ))}
                </div>
              </PanelCard>
            </div>

            <div className="admin-grid-two">
              <PanelCard
                title="Saúde do marketplace"
                subtitle="Visão operacional para o time administrativo"
              >
                <div className="admin-funnel-list">
                  {funnelStages.map((stage) => {
                    const width = operationalPulse.total > 0
                      ? Math.max(8, Math.round((stage.value / operationalPulse.total) * 100))
                      : 8;

                    return (
                      <div className="admin-funnel-item" key={stage.label}>
                        <div className="admin-funnel-head">
                          <span>{stage.label}</span>
                          <strong>{stage.value}</strong>
                        </div>
                        <div className="admin-funnel-track">
                          <div
                            className={`admin-funnel-fill ${stage.tone}`}
                            style={{ width: `${width}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </PanelCard>

              <PanelCard
                title="Receita e tração"
                subtitle="Indicadores de monetização do modelo de lead"
              >
                <div className="admin-list">
                  <div className="admin-list-item">
                    <div>
                      <strong>Créditos comprados</strong>
                      <p>Total de créditos injetados na operação pelos profissionais.</p>
                    </div>
                    <div className="admin-tag">{financeiro.creditos_comprados || 0}</div>
                  </div>

                  <div className="admin-list-item">
                    <div>
                      <strong>Créditos utilizados</strong>
                      <p>Consumo real em desbloqueio de leads dentro da plataforma.</p>
                    </div>
                    <div className="admin-tag">{financeiro.creditos_utilizados || 0}</div>
                  </div>

                  <div className="admin-list-item">
                    <div>
                      <strong>Admins na base</strong>
                      <p>Quantidade de contas com papel administrativo cadastrado.</p>
                    </div>
                    <div className="admin-tag">{usuarios.admins || 0}</div>
                  </div>

                  <div className="admin-list-item">
                    <div>
                      <strong>Profissionais ativos</strong>
                      <p>Oferta disponível para atender novos clientes e sustentar crescimento.</p>
                    </div>
                    <div className="admin-tag">{usuarios.profissionais || 0}</div>
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
