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
    'aguardando confirmacao': 'aguardando_confirmacao',
    concluido: 'concluido',
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
    aguardando_confirmacao: 'Aguardando confirmacao',
    concluido: 'Concluido',
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

function normalizeProfessionalMatch(item = {}, index) {
  const status = normalizeStatus(pick(item, ['status'], 'solicitado'));

  return {
    idSolicitacao: pick(item, ['id_solicitacao', 'idSolicitacao'], `match-${index}`),
    idProfissional: pick(item, ['id_profissional', 'idProfissional'], null),
    nomeProfissional: pick(
      item,
      ['nome_profissional', 'nomeProfissional', 'profissional'],
      'Profissional nao informado'
    ),
    telefoneProfissional: pick(
      item,
      ['telefone_profissional', 'telefoneProfissional'],
      ''
    ),
    descricaoProfissional: pick(
      item,
      ['descricao_profissional', 'descricaoProfissional'],
      ''
    ),
    status,
    statusLabel: getStatusLabel(status),
    precoLead: pick(item, ['preco_lead', 'precoLead'], null),
    data: pick(item, ['data_solicitacao', 'dataSolicitacao'], ''),
  };
}

function normalizeClientRequest(item, index) {
  const status = normalizeStatus(
    pick(item, ['status', 'situacao', 'status_solicitacao'], 'solicitado')
  );

  const matches = toArray(
    pick(item, ['profissionais_indicados', 'profissionaisIndicados'], [])
  ).map(normalizeProfessionalMatch);

  return {
    id: pick(item, ['id', 'id_solicitacao', 'codigo_grupo', 'idSolicitacao'], `req-${index}`),
    idReferencia: pick(item, ['id_referencia', 'idReferencia'], null),
    idAvaliacao: pick(item, ['id_avaliacao', 'idAvaliacao'], null),
    idProfissional: pick(item, ['id_profissional', 'idProfissional'], null),
    idCategoria: pick(item, ['id_categoria', 'idCategoria'], null),
    titulo: pick(
      item,
      ['titulo', 'descricao_servico', 'descricao', 'servico', 'nome_servico'],
      `Solicitacao ${index + 1}`
    ),
    profissional: pick(
      item,
      ['nome_profissional', 'profissional', 'nomeProfissional'],
      matches.length > 1 ? `${matches.length} profissionais indicados` : 'Profissional nao informado'
    ),
    endereco: pick(item, ['endereco', 'local', 'bairro'], 'Endereco nao informado'),
    data: pick(item, ['data_solicitacao', 'data', 'created_at', 'data_abertura'], ''),
    status,
    statusLabel: getStatusLabel(status),
    prioridade: pick(item, ['prioridade'], ''),
    dataConclusao: pick(item, ['data_conclusao', 'dataConclusao'], ''),
    precoLead: pick(item, ['preco_lead', 'precoLead'], null),
    telefoneProfissional: pick(
      item,
      ['telefone_profissional', 'telefoneProfissional'],
      ''
    ),
    totalProfissionais: pick(item, ['total_profissionais', 'totalProfissionais'], matches.length),
    encaminhamentoPendente: Boolean(
      pick(item, ['encaminhamento_pendente', 'encaminhamentoPendente'], false)
    ),
    jaAvaliada: Boolean(pick(item, ['ja_avaliada', 'jaAvaliada'], false)),
    profissionaisIndicados: matches,
  };
}

function extractRequests(source) {
  return source?.solicitacoes || source?.requests || source?.items || source?.data || source;
}

export async function getClientServiceRequests() {
  const response = await apiRequest('/service-requests/client');
  const source = response?.data ?? response ?? {};
  const requestsRaw = extractRequests(source);

  return toArray(requestsRaw).map(normalizeClientRequest);
}

export async function createClientServiceRequest(payload) {
  const response = await apiRequest('/service-requests', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return response?.data ?? response;
}

export async function cancelClientServiceRequest(id) {
  return apiRequest(`/service-requests/${id}/cancel`, {
    method: 'PATCH',
  });
}

export async function confirmClientServiceRequest(id) {
  return apiRequest(`/service-requests/${id}/confirm-completion`, {
    method: 'PATCH',
  });
}

export async function reportClientServiceRequestIncident(id, payload) {
  return apiRequest(`/service-requests/${id}/report`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
