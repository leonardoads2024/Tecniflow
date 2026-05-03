import { apiRequest } from './authService';

function normalizeUser(user = {}) {
  return {
    id: user.id_usuario,
    nome: user.nome || 'Usuario',
    email: user.email || 'Nao informado',
    telefone: user.telefone || 'Nao informado',
    tipoUsuario: String(user.tipo_usuario || '').toLowerCase(),
    status: Number(user.status) === 1 ? 1 : 0,
    dataCriacao: user.data_criacao || null,
  };
}

function normalizeCategory(category = {}) {
  return {
    id: category.id_categoria,
    nome: category.nome || 'Categoria',
    descricao: category.descricao || '',
    criadaPorUsuario: category.criada_por_usuario || null,
  };
}

function normalizePlan(plan = {}) {
  return {
    id: plan.id_plano,
    nome: plan.nome || 'Plano',
    preco: Number(plan.preco || 0),
    duracaoDias: Number(plan.duracao_dias || 0),
    destaque: Number(plan.destaque) === 1,
    descricao: plan.descricao || '',
  };
}

function normalizeProfessional(professional = {}) {
  return {
    id: professional.id_profissional,
    idUsuario: professional.id_usuario,
    nome: professional.nome || 'Profissional',
    email: professional.email || 'Nao informado',
    telefone: professional.telefone || 'Nao informado',
    statusUsuario: Number(professional.status_usuario) === 1 ? 1 : 0,
    descricao: professional.descricao || 'Sem descricao cadastrada',
    experiencia: professional.experiencia || 'Nao informado',
    disponibilidade: professional.disponibilidade || 'Nao informado',
    avaliacaoMedia: Number(professional.avaliacao_media || 0),
    verificado: Number(professional.verificado) === 1,
    totalAvaliacoes: Number(professional.total_avaliacoes || 0),
    totalConcluidos: Number(professional.total_concluidos || 0),
    premium: Boolean(professional.premium),
    categorias: professional.categorias || 'Sem categorias vinculadas',
  };
}

function normalizeServiceRequest(serviceRequest = {}) {
  return {
    id: serviceRequest.id_solicitacao,
    idCliente: serviceRequest.id_cliente,
    idProfissional: serviceRequest.id_profissional,
    idCategoria: serviceRequest.id_categoria,
    nomeCliente: serviceRequest.nome_cliente || 'Cliente',
    emailCliente: serviceRequest.email_cliente || 'Nao informado',
    nomeProfissional: serviceRequest.nome_profissional || 'Profissional',
    emailProfissional: serviceRequest.email_profissional || 'Nao informado',
    nomeCategoria: serviceRequest.nome_categoria || 'Sem categoria',
    descricaoServico: serviceRequest.descricao_servico || 'Sem descricao',
    endereco: serviceRequest.endereco || 'Nao informado',
    prioridade: serviceRequest.prioridade || 'media',
    precoLead: Number(serviceRequest.preco_lead || 0),
    status: serviceRequest.status || 'solicitado',
    dataSolicitacao: serviceRequest.data_solicitacao || null,
    dataConclusao: serviceRequest.data_conclusao || null,
  };
}

function normalizeAuditLog(log = {}) {
  return {
    id: log.id_auditoria,
    idAdmin: log.id_admin,
    nomeAdmin: log.nome_admin || 'Admin',
    emailAdmin: log.email_admin || 'Nao informado',
    acao: log.acao || 'acao',
    entidade: log.entidade || 'entidade',
    idEntidade: log.id_entidade || null,
    detalhes: log.detalhes || '',
    dataCriacao: log.data_criacao || null,
  };
}

function normalizeIncident(incident = {}) {
  return {
    id: incident.id_incidente,
    tipo: incident.tipo || 'denuncia',
    idUsuarioOrigem: incident.id_usuario_origem || null,
    idSolicitacao: incident.id_solicitacao || null,
    titulo: incident.titulo || 'Incidente',
    descricao: incident.descricao || '',
    prioridade: incident.prioridade || 'media',
    status: incident.status || 'aberto',
    responsavelAdmin: incident.responsavel_admin || null,
    nomeUsuarioOrigem: incident.nome_usuario_origem || 'Nao informado',
    tipoUsuarioOrigem: incident.tipo_usuario_origem || 'nao_informado',
    nomeResponsavelAdmin: incident.nome_responsavel_admin || 'Nao atribuido',
    nomeCliente: incident.nome_cliente || 'Nao informado',
    nomeProfissional: incident.nome_profissional || 'Nao informado',
    nomeCategoria: incident.nome_categoria || 'Sem categoria',
    descricaoServico: incident.descricao_servico || '',
    statusSolicitacao: incident.status_solicitacao || 'nao_informado',
    prioridadeSolicitacao: incident.prioridade_solicitacao || 'nao_informada',
    dataCriacao: incident.data_criacao || null,
    dataAtualizacao: incident.data_atualizacao || null,
  };
}

function normalizeReview(review = {}) {
  return {
    id: review.id_avaliacao,
    idSolicitacao: review.id_solicitacao || null,
    idCliente: review.id_cliente || null,
    idProfissional: review.id_profissional || null,
    nota: Number(review.nota || 0),
    comentario: review.comentario || '',
    dataAvaliacao: review.data_avaliacao || null,
    nomeCliente: review.nome_cliente || 'Nao informado',
    nomeProfissional: review.nome_profissional || 'Nao informado',
    nomeCategoria: review.nome_categoria || 'Sem categoria',
    statusSolicitacao: review.status_solicitacao || 'nao_informado',
    prioridadeSolicitacao: review.prioridade_solicitacao || 'nao_informada',
  };
}

export async function getAdminDashboard() {
  const response = await apiRequest('/admin/dashboard');
  return response?.data || {};
}

export async function getAdminUsers() {
  const response = await apiRequest('/admin/users');
  const users = response?.data?.usuarios || [];
  return users.map(normalizeUser);
}

export async function updateAdminUserStatus(userId, status) {
  const response = await apiRequest(`/admin/users/${userId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });

  return response?.data || null;
}

export async function getAdminProfessionals() {
  const response = await apiRequest('/admin/professionals');
  const professionals = response?.data?.profissionais || [];
  return professionals.map(normalizeProfessional);
}

export async function updateAdminProfessionalVerification(professionalId, verificado) {
  const response = await apiRequest(`/admin/professionals/${professionalId}/verification`, {
    method: 'PATCH',
    body: JSON.stringify({ verificado }),
  });

  return response?.data || null;
}

export async function getAdminCategories() {
  const response = await apiRequest('/admin/categories');
  const categories = response?.data?.categorias || [];
  return categories.map(normalizeCategory);
}

export async function createAdminCategory(payload) {
  const response = await apiRequest('/admin/categories', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return normalizeCategory(response?.data || {});
}

export async function updateAdminCategory(categoryId, payload) {
  const response = await apiRequest(`/admin/categories/${categoryId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

  return normalizeCategory(response?.data || {});
}

export async function getAdminPlans() {
  const response = await apiRequest('/admin/plans');
  const plans = response?.data?.planos || [];
  return plans.map(normalizePlan);
}

export async function createAdminPlan(payload) {
  const response = await apiRequest('/admin/plans', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return normalizePlan(response?.data || {});
}

export async function updateAdminPlan(planId, payload) {
  const response = await apiRequest(`/admin/plans/${planId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

  return normalizePlan(response?.data || {});
}

export async function getAdminServiceRequests() {
  const response = await apiRequest('/admin/service-requests');
  const serviceRequests = response?.data?.solicitacoes || [];
  return serviceRequests.map(normalizeServiceRequest);
}

export async function getAdminReviews() {
  const response = await apiRequest('/admin/reviews');
  const reviews = response?.data?.avaliacoes || [];
  return reviews.map(normalizeReview);
}

export async function getAdminAuditLogs() {
  const response = await apiRequest('/admin/audit');
  const logs = response?.data?.auditoria || [];
  return logs.map(normalizeAuditLog);
}

export async function getAdminIncidents() {
  const response = await apiRequest('/admin/incidents');
  const incidents = response?.data?.incidentes || [];
  return incidents.map(normalizeIncident);
}

export async function createAdminIncident(payload) {
  const response = await apiRequest('/admin/incidents', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return normalizeIncident(response?.data || {});
}

export async function updateAdminIncidentStatus(incidentId, status) {
  const response = await apiRequest(`/admin/incidents/${incidentId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });

  return response?.data || null;
}
