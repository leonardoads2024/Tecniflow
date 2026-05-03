import { apiRequest } from './authService';

function normalizePlan(plan = {}) {
  return {
    id: plan.id_plano,
    nome: plan.nome || 'Plano',
    preco: Number(plan.preco || 0),
    duracaoDias: Number(plan.duracao_dias || 0),
    destaque: Number(plan.destaque) === 1 || Boolean(plan.destaque),
    descricao: plan.descricao || '',
  };
}

function normalizeSubscription(subscription) {
  if (!subscription) return null;

  return {
    idAssinatura: subscription.id_assinatura,
    status: subscription.status || 'inativa',
    dataInicio: subscription.data_inicio || null,
    dataFim: subscription.data_fim || null,
    idPlano: subscription.id_plano || null,
    nome: subscription.nome || 'Sem plano',
    preco: Number(subscription.preco || 0),
    duracaoDias: Number(subscription.duracao_dias || 0),
    destaque: Number(subscription.destaque) === 1 || Boolean(subscription.destaque),
    descricao: subscription.descricao || '',
    premiumAtivo: Boolean(subscription.premium_ativo),
  };
}

export async function getSubscriptionPlans() {
  const response = await apiRequest('/subscriptions/plans');
  const plans = response?.data?.planos || response?.data || [];
  return Array.isArray(plans) ? plans.map(normalizePlan) : [];
}

export async function createSubscription(planId) {
  const response = await apiRequest('/subscriptions', {
    method: 'POST',
    body: JSON.stringify({ id_plano: planId }),
  });

  return response?.data || null;
}

export async function getMySubscription() {
  const response = await apiRequest('/subscriptions/me');
  return normalizeSubscription(response?.data || response || null);
}
