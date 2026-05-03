import { apiRequest } from './api';

function pick(source, keys, fallback = null) {
  for (const key of keys) {
    if (source?.[key] !== undefined && source?.[key] !== null && source?.[key] !== '') {
      return source[key];
    }
  }

  return fallback;
}

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

export async function getWallet() {
  const response = await apiRequest('/credits/wallet');
  const source = response?.data ?? response ?? {};

  return {
    idProfissional: pick(source, ['id_profissional', 'idProfissional'], null),
    saldo: Number(pick(source, ['saldo'], 0) || 0),
  };
}

export async function addCredits(quantidade) {
  return apiRequest('/credits/add', {
    method: 'POST',
    body: JSON.stringify({ quantidade }),
  });
}

export async function unlockLead(id) {
  const response = await apiRequest(`/credits/unlock/${id}`, {
    method: 'POST',
  });

  return response?.data ?? response;
}

export async function getCreditDashboard() {
  const response = await apiRequest('/credits/dashboard');
  const source = response?.data ?? response ?? {};

  return {
    saldoCreditos: Number(pick(source, ['saldo_creditos'], 0) || 0),
    leadsLiberados: Number(pick(source, ['leads_liberados'], 0) || 0),
    creditosComprados: Number(pick(source, ['creditos_comprados'], 0) || 0),
    creditosUtilizados: Number(pick(source, ['creditos_utilizados'], 0) || 0),
    ultimoLeadLiberado: pick(source, ['ultimo_lead_liberado'], null),
  };
}

export async function getTransactions() {
  const response = await apiRequest('/credits/transactions');
  const source = response?.data ?? {};
  const transactionsRaw =
    source?.transacoes ||
    source?.items ||
    source?.data ||
    source;

  return toArray(transactionsRaw).map((item, index) => ({
    id: pick(item, ['id_transacao', 'id'], `tx-${index}`),
    tipo: pick(item, ['tipo'], ''),
    quantidade: Number(pick(item, ['quantidade'], 0) || 0),
    descricao: pick(item, ['descricao'], ''),
    idSolicitacao: pick(item, ['id_solicitacao', 'idSolicitacao'], null),
    data: pick(item, ['data_transacao', 'data'], ''),
  }));
}
