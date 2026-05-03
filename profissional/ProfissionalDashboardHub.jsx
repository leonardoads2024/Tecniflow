import { Activity, BadgeCheck, BriefcaseBusiness, Crown, Sparkles, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DistributionBars from '../../components/ui/DistributionBars';
import MetricCard from '../../components/ui/MetricCard';
import PanelCard from '../../components/ui/PanelCard';
import ProgressRing from '../../components/ui/ProgressRing';
import RatingStars from '../../components/ui/RatingStars';
import { getProfessionalDashboard } from '../../services/DashboardService';
import { getProfessionalReviews } from '../../services/professionalDirectoryService';
import './ProfissionalDashboard.css';

function formatRating(value) {
  if (!value) return '-';
  return Number(value).toFixed(1).replace('.', ',');
}

export default function ProfissionalDashboardHub() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const quickProfessionalActions = [
    {
      title: 'Operar leads',
      description: 'Revise oportunidades, desbloqueie contatos e avance o atendimento.',
      icon: <BriefcaseBusiness size={16} />,
      path: '/profissional/servicos',
    },
    {
      title: 'Gerir carteira',
      description: 'Acompanhe saldo, uso de creditos e ritmo da sua monetizacao.',
      icon: <Wallet size={16} />,
      path: '/profissional/financeiro',
    },
    {
      title: 'Fortalecer destaque',
      description: 'Veja assinatura, premium e sinais que elevam sua visibilidade na plataforma.',
      icon: <Crown size={16} />,
      path: '/profissional/assinatura',
    },
  ];

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError('');

        const data = await getProfessionalDashboard();

        if (data?.idProfissional) {
          const reviewsData = await getProfessionalReviews(data.idProfissional);
          setReviews(reviewsData.slice(0, 4));
        }

        setDashboard(data);
      } catch (err) {
        const rawMessage = err?.message || 'Erro ao carregar dashboard profissional.';
        const friendlyMessage = rawMessage.includes('Usuario nao possui perfil profissional')
          ? 'Seu usuario ainda nao possui um perfil profissional vinculado. Cadastre ou vincule um perfil profissional para acessar este painel.'
          : rawMessage;

        setError(friendlyMessage);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const totalRequests = dashboard?.totalSolicitacoes ?? 0;
  const acceptanceBase = dashboard ? (dashboard.solicitadas ?? 0) + (dashboard.aceitas ?? 0) : 0;
  const acceptanceRate =
    acceptanceBase > 0 ? ((dashboard?.aceitas ?? 0) / acceptanceBase) * 100 : 0;
  const completionRate =
    totalRequests > 0 ? ((dashboard?.concluidas ?? 0) / totalRequests) * 100 : 0;
  const professionalFlowDistribution = [
    { label: 'Solicitadas', value: dashboard?.solicitadas ?? 0, tone: 'yellow' },
    { label: 'Aceitas', value: dashboard?.aceitas ?? 0, tone: 'green' },
    { label: 'Em andamento', value: dashboard?.emAndamento ?? 0, tone: 'cyan' },
    {
      label: 'Aguardando confirmação',
      value: dashboard?.aguardandoConfirmacao ?? 0,
      tone: 'slate',
    },
    { label: 'Concluídas', value: dashboard?.concluidas ?? 0, tone: 'green' },
    {
      label: 'Perdidas',
      value: (dashboard?.canceladas ?? 0) + (dashboard?.recusadas ?? 0),
      tone: 'red',
    },
  ];

  return (
    <DashboardLayout title="Dashboard do Profissional">
      <section className="professional-dashboard">
        {loading && <div className="dashboard-feedback">Carregando dados do dashboard...</div>}
        {error && <div className="dashboard-error">{error}</div>}

        {!loading && !error && dashboard && (
          <>
            <section className="professional-dashboard-hero">
              <div className="professional-dashboard-hero-copy">
                <span className="professional-dashboard-kicker">Cockpit do profissional</span>
                <h3>Converta leads com mais leitura comercial, reputacao visivel e operacao organizada.</h3>
                <p>
                  Este painel prioriza tracao, confianca e recorrencia para que sua atuacao na plataforma
                  pareca mais proxima de um negocio em crescimento do que de uma simples caixa de pedidos.
                </p>

                <div className="professional-dashboard-actions">
                  <button
                    type="button"
                    className="professional-primary-action"
                    onClick={() => navigate('/profissional/servicos')}
                  >
                    Operar meus leads
                  </button>
                  <button
                    type="button"
                    className="professional-secondary-action"
                    onClick={() => navigate('/ajuda')}
                  >
                    Ver guia rapido
                  </button>
                </div>
              </div>

              <div className="professional-dashboard-hero-cards">
                <div className="professional-hero-card standout">
                  <Sparkles size={18} />
                  <strong>{dashboard.totalSolicitacoes}</strong>
                  <span>oportunidades registradas no seu funil</span>
                </div>
                <div className="professional-hero-card">
                  <BadgeCheck size={18} />
                  <strong>{formatRating(dashboard.mediaAvaliacao)}</strong>
                  <RatingStars value={dashboard.mediaAvaliacao} size={15} />
                  <span>reputacao media baseada em avaliacoes</span>
                </div>
              </div>
            </section>

            <section className="professional-command-strip">
              {quickProfessionalActions.map((action) => (
                <button
                  type="button"
                  key={action.title}
                  className="professional-command-card"
                  onClick={() => navigate(action.path)}
                >
                  <div className="professional-command-icon">{action.icon}</div>
                  <div>
                    <strong>{action.title}</strong>
                    <span>{action.description}</span>
                  </div>
                </button>
              ))}
            </section>

            <div className="summary-cards">
              <MetricCard
                label="Solicitacoes recebidas"
                value={dashboard.totalSolicitacoes}
                info="Total de oportunidades registradas"
              />
              <MetricCard
                label="Em andamento"
                value={dashboard.emAndamento}
                info="Servicos ativos no momento"
              />
              <MetricCard
                label="Avaliacao media"
                value={formatRating(dashboard.mediaAvaliacao)}
                info={`Baseada em ${dashboard.totalAvaliacoes} avaliacao(oes)`}
              />
              <MetricCard
                label="Plano atual"
                value={dashboard.planoNome}
                info="Status da assinatura"
                highlight
                accent="green"
              />
            </div>

            <div className="dashboard-panels">
              <PanelCard
                title="Resumo operacional"
                subtitle="Leitura rapida da sua performance dentro da plataforma"
                className="dashboard-panel-large"
              >
                <div className="finance-box">
                  <div className="finance-row">
                    <span>Solicitadas</span>
                    <strong>{dashboard.solicitadas}</strong>
                  </div>
                  <div className="finance-row">
                    <span>Aceitas</span>
                    <strong>{dashboard.aceitas}</strong>
                  </div>
                  <div className="finance-row">
                    <span>Concluidas</span>
                    <strong>{dashboard.concluidas}</strong>
                  </div>
                  <div className="finance-row">
                    <span>Em andamento</span>
                    <strong>{dashboard.emAndamento}</strong>
                  </div>
                  <div className="finance-row">
                    <span>Aguardando confirmacao</span>
                    <strong>{dashboard.aguardandoConfirmacao}</strong>
                  </div>
                  <div className="finance-row">
                    <span>Canceladas</span>
                    <strong>{dashboard.canceladas}</strong>
                  </div>
                  <div className="finance-row">
                    <span>Recusadas</span>
                    <strong>{dashboard.recusadas}</strong>
                  </div>
                </div>
              </PanelCard>

              <PanelCard
                title="Funil visual de conversão"
                subtitle="Uma leitura mais moderna de como as oportunidades avançam no seu pipeline"
              >
                <DistributionBars items={professionalFlowDistribution} />
              </PanelCard>

              <PanelCard title="Financeiro e plano" subtitle="Resumo rapido da sua posicao comercial">
                <div className="finance-box">
                  <div className="finance-row accent-green">
                    <span>Status do plano</span>
                    <strong>{dashboard.planoStatus}</strong>
                  </div>
                  <div className="finance-row accent-cyan">
                    <span>Premium ativo</span>
                    <strong>{dashboard.premiumAtivo ? 'Sim' : 'Nao'}</strong>
                  </div>
                  <div className="finance-row">
                    <span>Descricao do plano</span>
                    <strong>{dashboard.planoDescricao}</strong>
                  </div>
                  <div className="finance-row">
                    <span>Periodo</span>
                    <strong>{dashboard.planoPeriodo}</strong>
                  </div>
                </div>
              </PanelCard>

              <PanelCard
                title="Eficiência operacional"
                subtitle="Do aceite ao fechamento, veja onde seu perfil já converte e onde ainda pode evoluir"
              >
                <div className="progress-ring-grid">
                  <ProgressRing
                    value={acceptanceRate}
                    tone="cyan"
                    label="Taxa de aceite"
                    subtitle={`${dashboard.aceitas ?? 0} oportunidades aceitas dentro do volume que entrou no funil.`}
                  />
                  <ProgressRing
                    value={completionRate}
                    tone="green"
                    label="Taxa de conclusão"
                    subtitle={`${dashboard.concluidas ?? 0} atendimentos concluídos sobre o total registrado.`}
                  />
                </div>
              </PanelCard>

              <PanelCard title="Momento comercial" subtitle="Indicadores de tracao para o seu perfil">
                <div className="professional-commercial-grid">
                  <div className="professional-commercial-card">
                    <Activity size={16} />
                    <strong>{dashboard.aceitas + dashboard.emAndamento}</strong>
                    <span>oportunidades engajadas no funil</span>
                  </div>
                  <div className="professional-commercial-card">
                    <Wallet size={16} />
                    <strong>{dashboard.planoNome}</strong>
                    <span>camada atual de visibilidade</span>
                  </div>
                </div>
              </PanelCard>

              <PanelCard
                title="Leitura de crescimento"
                subtitle="Como aumentar conversao, reputacao e recorrencia dentro do marketplace"
              >
                <div className="professional-growth-rail">
                  <div className="professional-growth-step">
                    <span>01</span>
                    <div>
                      <strong>Captar e responder rapido</strong>
                      <p>Leads bem tratados cedo tendem a gerar mais aceite e mais andamento real.</p>
                    </div>
                  </div>
                  <div className="professional-growth-step">
                    <span>02</span>
                    <div>
                      <strong>Construir reputacao</strong>
                      <p>Avaliacoes fortes aumentam confianca e ajudam o perfil a ganhar tracao.</p>
                    </div>
                  </div>
                  <div className="professional-growth-step">
                    <span>03</span>
                    <div>
                      <strong>Elevar visibilidade</strong>
                      <p>Premium, operacao consistente e historico positivo fortalecem seu posicionamento.</p>
                    </div>
                  </div>
                </div>
              </PanelCard>

              <PanelCard
                title="Avaliacoes recentes"
                subtitle="Prova social que ajuda a converter novos leads"
              >
                <div className="review-list">
                  {reviews.length === 0 ? (
                    <div className="review-item">
                      <strong>Nenhuma avaliacao registrada ainda</strong>
                      <p>Conclua servicos para construir reputacao dentro da plataforma.</p>
                    </div>
                  ) : (
                    reviews.map((review, index) => (
                      <div className={`review-item review-tone-${index % 3}`} key={review.id}>
                        <strong>{review.cliente}</strong>
                        <RatingStars value={review.nota} size={15} />
                        <p>{review.comentario}</p>
                      </div>
                    ))
                  )}
                </div>
              </PanelCard>
            </div>
          </>
        )}
      </section>
    </DashboardLayout>
  );
}
