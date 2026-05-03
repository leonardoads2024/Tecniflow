import { Crown, Gem, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PanelCard from '../../components/ui/PanelCard';
import {
  createSubscription,
  getMySubscription,
  getSubscriptionPlans,
} from '../../services/subscriptionService';
import './ProfissionalDashboard.css';
import '../shared/ProfilePages.css';

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return 'Nao informado';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(date);
}

export default function ProfissionalAssinatura() {
  const [plans, setPlans] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingPlanId, setSavingPlanId] = useState(null);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const premiumHighlights = [
    {
      title: 'Mais visibilidade',
      description: 'Premium fortalece sua presença nos rankings e aumenta chance de ser lembrado.',
      icon: <Crown size={16} />,
    },
    {
      title: 'Monetizacao recorrente',
      description: 'Assinatura vira uma alavanca de aquisição quando combinada com boa operação.',
      icon: <Gem size={16} />,
    },
    {
      title: 'Selo de confiança',
      description: 'Destaque, reputação e perfil consistente trabalham juntos na percepção do cliente.',
      icon: <ShieldCheck size={16} />,
    },
  ];
  const highlightedPlans = plans.filter((plan) => plan.destaque).length;

  async function loadSubscriptionData(showLoading = true) {
    try {
      if (showLoading) setLoading(true);
      setError('');

      const [plansData, subscriptionData] = await Promise.all([
        getSubscriptionPlans(),
        getMySubscription(),
      ]);

      setPlans(plansData);
      setSubscription(subscriptionData);
    } catch (err) {
      setError(err?.message || 'Erro ao carregar assinatura premium.');
    } finally {
      if (showLoading) setLoading(false);
    }
  }

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  async function handleSubscribe(planId) {
    try {
      setSavingPlanId(planId);
      setError('');
      setFeedback('');
      await createSubscription(planId);
      setFeedback('Assinatura ativada com sucesso.');
      await loadSubscriptionData(false);
    } catch (err) {
      setError(err?.message || 'Erro ao contratar plano.');
    } finally {
      setSavingPlanId(null);
    }
  }

  return (
    <DashboardLayout title="Assinatura Premium">
      <section className="profile-page">
        {feedback && <div className="dashboard-feedback">{feedback}</div>}
        {loading && <div className="dashboard-feedback">Carregando planos premium...</div>}
        {error && <div className="dashboard-error">{error}</div>}

        {!loading && (
          <>
            <section className="profile-highlight-strip">
              {premiumHighlights.map((item) => (
                <div className="profile-highlight-card" key={item.title}>
                  <div className="profile-highlight-icon">{item.icon}</div>
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.description}</span>
                  </div>
                </div>
              ))}
            </section>

            <section className="professional-command-strip">
              <div className="professional-command-card">
                <div className="professional-command-icon">
                  <Crown size={18} />
                </div>
                <div>
                  <strong>{subscription?.premiumAtivo ? 'Premium ativo' : 'Sem plano ativo'}</strong>
                  <span>estado atual da sua camada de destaque dentro do ranking do marketplace.</span>
                </div>
              </div>
              <div className="professional-command-card">
                <div className="professional-command-icon">
                  <Gem size={18} />
                </div>
                <div>
                  <strong>{plans.length}</strong>
                  <span>opcoes disponiveis para ajustar visibilidade, prazo e intensidade da aquisicao.</span>
                </div>
              </div>
              <div className="professional-command-card">
                <div className="professional-command-icon">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <strong>{highlightedPlans}</strong>
                  <span>planos com destaque comercial para impulsionar reputacao e descoberta.</span>
                </div>
              </div>
            </section>

            <PanelCard
              title="Seu status premium"
              subtitle="Destaque no ranking e mais tracao para captar leads"
            >
              <div className="profile-info-list">
                <div className="profile-info-item">
                  <span>Plano atual</span>
                  <strong>{subscription?.nome || 'Sem plano ativo'}</strong>
                </div>
                <div className="profile-info-item">
                  <span>Status</span>
                  <strong>{subscription?.premiumAtivo ? 'Premium ativo' : 'Inativo'}</strong>
                </div>
                <div className="profile-info-item">
                  <span>Periodo</span>
                  <strong>
                    {subscription
                      ? `${formatDate(subscription.dataInicio)} ate ${formatDate(subscription.dataFim)}`
                      : 'Nao informado'}
                  </strong>
                </div>
              </div>
            </PanelCard>

            <div className="subscription-cards">
              {plans.map((plan) => {
                const isCurrent = subscription?.idPlano === plan.id && subscription?.premiumAtivo;

                return (
                  <div
                    key={plan.id}
                    className={`subscription-card ${plan.destaque ? 'featured' : ''}`}
                  >
                    <h3>{plan.nome}</h3>
                    <div className="subscription-price">{formatCurrency(plan.preco)}</div>
                    <div className="subscription-meta">{plan.duracaoDias} dias de destaque</div>
                    <p>{plan.descricao || 'Plano premium para melhorar sua exposicao.'}</p>

                    <button
                      type="button"
                      className="topbar-logout-button"
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={Boolean(savingPlanId) || isCurrent}
                    >
                      {isCurrent
                        ? 'Plano ativo'
                        : savingPlanId === plan.id
                          ? 'Processando...'
                          : 'Assinar plano'}
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>
    </DashboardLayout>
  );
}
