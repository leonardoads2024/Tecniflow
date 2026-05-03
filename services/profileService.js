import { apiRequest } from './authService';

function normalizeUser(user = {}) {
  const id = user.id_usuario || user.id || null;
  const fotoUrl = user.foto_url || user.fotoUrl || '';
  const tipoUsuario = user.tipo_usuario || user.tipoUsuario || user.tipo || user.role || '';
  const status = Number(user.status) === 1 ? 1 : 0;

  return {
    id,
    id_usuario: id,
    nome: user.nome || 'Usuario',
    email: user.email || 'Nao informado',
    telefone: user.telefone || '',
    fotoUrl,
    foto_url: fotoUrl,
    tipoUsuario,
    tipo_usuario: tipoUsuario,
    tipo: tipoUsuario,
    role: tipoUsuario,
    status,
    dataCriacao: user.data_criacao || null,
  };
}

function normalizeProfessionalProfile(profile = {}) {
  const categoryIds = String(profile.categoria_ids || profile.categoriaIds || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    idProfissional: profile.id_profissional,
    idUsuario: profile.id_usuario,
    descricao: profile.descricao || '',
    experiencia: profile.experiencia || '',
    disponibilidade: profile.disponibilidade || '',
    categoriaIds: categoryIds,
    categoriaId: profile.id_categoria || categoryIds[0] || '',
    categorias: profile.categorias || '',
    avaliacaoMedia: Number(profile.avaliacao_media || 0),
    verificado: Number(profile.verificado) === 1,
  };
}

function normalizeCategory(category = {}) {
  return {
    id: category.id_categoria || category.id || '',
    nome: category.nome || 'Categoria',
    descricao: category.descricao || '',
  };
}

export async function getMyUserProfile() {
  const response = await apiRequest('/users/me');
  return normalizeUser(response);
}

export async function updateMyUserProfile(payload) {
  const response = await apiRequest('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

  return normalizeUser(response);
}

export async function getMyProfessionalProfile() {
  const response = await apiRequest('/professionals/me');
  return normalizeProfessionalProfile(response?.data || response || {});
}

export async function getProfessionalCategories() {
  const response = await apiRequest('/professionals/categories');
  const source = response?.data ?? {};
  const categories = source?.categorias || source?.items || source?.data || source;

  return Array.isArray(categories) ? categories.map(normalizeCategory) : [];
}

export async function updateMyProfessionalProfile(payload) {
  const response = await apiRequest('/professionals/me', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

  return normalizeProfessionalProfile(response?.data || response || {});
}
