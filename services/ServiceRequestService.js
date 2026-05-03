import { apiRequest } from './api';

function normalizeStatus(value) {
  const raw = String(value || '').toLowerCase().trim();

  const map = {
    solicitado: 'solicitado',
    aceito: 'aceito',
    em_andamento: 'em_andamento',
    'em andamento': 'em_andamento',
    andamento: 'em_andamento',
    aguardando_confirmacao: 'aguardando_confirmacao',
    'aguardando confirmação': 'aguardando_confirmacao',
    'aguardando confirmacao': 'aguardando_confirmacao',
    concluido: 'concluido',
    concluída: 'concluido',
    cancelado: 'cancelado',
    recusado: 'recusado',
  };

  return map[raw] || raw.replace(/\s+/g, '_') || 'solicitado';
}

function getStatusLabel(status) {
  const map = {
    solicitado: 'Solicitado',
    aceito: 'Aceito',
    em_andamento: 'Em andamento',
    aguardando_confirmacao: 'Aguardando confirmação',
    concluido: 'Concluído',
    cancelado: 'Cancelado',
    recusado: 'Recusado',
  };

  return map[status] || 'Status';
}

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function pick(source, keys, fallback = null) {
  for (const key of keys) {
    if (source?.[key] !== undefined && source?.[key] !== null && source?.[key] !== '') {
      return source[key];
    }
  }

  return fallback;
}

function normalizeProfessionalRequest(item, index) {
  const status = normalizeStatus(
    pick(item, ['status', 'situacao', 'status_solicitacao'], 'solicitado')
  );

  return {
    id: pick(item, ['id', 'id_solicitacao', 'idSolicitacao'], `pro-${index}`),
    idCliente: pick(item, ['id_cliente', 'idCliente'], null),
    titulo: pick(
      item,
      ['titulo', 'descricao_servico', 'descricao', 'servico', 'nome_servico'],
      `Solicitação ${index + 1}`
    ),
    cliente: pick(
      item,
      ['nome_cliente', 'cliente', 'nomeCliente'],
      'Cliente não informado'
    ),
    endereco: pick(item, ['endereco', 'local', 'bairro'], 'Endereço não informado'),
    data: pick(
      item,
      ['data_solicitacao', 'data', 'created_at', 'data_abertura'],
      ''
    ),
    status,
    statusLabel: getStatusLabel(status),
    prioridade: pick(item, ['prioridade'], ''),
    precoLead: pick(item, ['preco_lead', 'precoLead'], null),
    leadLiberado: Boolean(pick(item, ['lead_liberado', 'leadLiberado'], false)),
    telefoneCliente: pick(item, ['telefone_cliente', 'telefoneCliente'], ''),
  };
}

function normalizeClientRequest(item, index) {
  const status = normalizeStatus(
    pick(item, ['status', 'situacao', 'status_solicitacao'], 'solicitado')
  );

  return {
    id: pick(item, ['id', 'id_solicitacao', 'idSolicitacao'], `cli-${index}`),
    titulo: pick(
      item,
      ['titulo', 'descricao_servico', 'descricao', 'servico', 'nome_servico'],
      `Solicitação ${index + 1}`
    ),
    profissional: pick(
      item,
      ['nome_profissional', 'profissional', 'nomeProfissional'],
      'A definir'
    ),
    endereco: pick(item, ['endereco', 'local', 'bairro'], 'Endereço não informado'),
    data: pick(
      item,
      ['data_solicitacao', 'data', 'created_at', 'data_abertura'],
      ''
    ),
    status,
    statusLabel: getStatusLabel(status),
  };
}

function extractRequests(source) {
  return (
    source?.solicitacoes ||
    source?.requests ||
    source?.items ||
    source?.data ||
    source
  );
}

export async function getProfessionalServiceRequests() {
  const response = await apiRequest('/service-requests/professional');
  const source = response?.data ?? response ?? {};
  const requestsRaw = extractRequests(source);

  return toArray(requestsRaw).map(normalizeProfessionalRequest);
}

export async function getClientServiceRequests() {
  const response = await apiRequest('/service-requests/client');
  const source = response?.data ?? response ?? {};
  const requestsRaw = extractRequests(source);

  return toArray(requestsRaw).map(normalizeClientRequest);
}

export async function createServiceRequest(payload) {
  const response = await apiRequest('/service-requests', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return response?.data ?? response;
}

export async function acceptServiceRequest(id) {
  return apiRequest(`/service-requests/${id}/accept`, {
    method: 'PATCH',
  });
}

export async function rejectServiceRequest(id) {
  return apiRequest(`/service-requests/${id}/reject`, {
    method: 'PATCH',
  });
}

export async function startServiceRequest(id) {
  return apiRequest(`/service-requests/${id}/start`, {
    method: 'PATCH',
  });
}

export async function requestConfirmationServiceRequest(id) {
  return apiRequest(`/service-requests/${id}/request-completion`, {
    method: 'PATCH',
  });
}

export async function cancelServiceRequest(id) {
  return apiRequest(`/service-requests/${id}/cancel`, {
    method: 'PATCH',
  });
}

export async function confirmConclusionServiceRequest(id) {
  return apiRequest(`/service-requests/${id}/confirm-completion`, {
    method: 'PATCH',
  });
}
