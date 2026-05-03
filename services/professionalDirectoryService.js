import { apiRequest } from './api';

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

function normalizeProfessional(item) {
  const categoriasRaw = pick(item, ['categorias'], '');
  const categorias = String(categoriasRaw || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

  return {
    id: pick(item, ['id_profissional', 'id']),
    idUsuario: pick(item, ['id_usuario']),
    nome: pick(item, ['nome'], 'Profissional'),
    email: pick(item, ['email'], ''),
    telefone: pick(item, ['telefone'], ''),
    fotoUrl: pick(item, ['foto_url', 'fotoUrl'], ''),
    descricao: pick(item, ['descricao'], 'Sem descricao cadastrada.'),
    experiencia: pick(item, ['experiencia'], 'Nao informado'),
    disponibilidade: pick(item, ['disponibilidade'], 'Nao informado'),
    avaliacaoMedia: Number(pick(item, ['avaliacao_media'], 0) || 0),
    totalAvaliacoes: Number(pick(item, ['total_avaliacoes'], 0) || 0),
    totalConcluidos: Number(pick(item, ['total_concluidos'], 0) || 0),
    premium: Boolean(pick(item, ['premium'], false)),
    verificado: Boolean(pick(item, ['verificado'], false)),
    categorias,
  };
}

function normalizeReview(item, index) {
  return {
    id: pick(item, ['id_avaliacao', 'id'], `review-${index}`),
    nota: Number(pick(item, ['nota'], 0) || 0),
    comentario: pick(item, ['comentario'], 'Sem comentario.'),
    data: pick(item, ['data_avaliacao', 'data'], ''),
    cliente: pick(item, ['nome_cliente', 'cliente'], 'Cliente'),
  };
}

export async function getProfessionals() {
  const response = await apiRequest('/professionals');
  const source = response?.data ?? {};
  const professionalsRaw =
    source?.profissionais ||
    source?.items ||
    source?.data ||
    source;

  return toArray(professionalsRaw).map(normalizeProfessional);
}

export async function getProfessionalById(id) {
  const response = await apiRequest(`/professionals/${id}`);
  const source = response?.data ?? response ?? {};

  return normalizeProfessional(source);
}

export async function getProfessionalReviews(id) {
  const response = await apiRequest(`/professionals/${id}/reviews`);
  const source = response?.data ?? {};
  const reviewsRaw =
    source?.avaliacoes ||
    source?.reviews ||
    source?.items ||
    source?.data ||
    source;

  return toArray(reviewsRaw).map(normalizeReview);
}

export async function getRecommendedProfessionals(categoryId, limit = 4) {
  const response = await apiRequest(
    `/professionals/recommendations?category=${categoryId}&limit=${limit}`
  );
  const source = response?.data ?? {};
  const professionalsRaw =
    source?.profissionais ||
    source?.items ||
    source?.data ||
    source;

  return toArray(professionalsRaw).map(normalizeProfessional);
}

export async function getProfessionalCategories() {
  const response = await apiRequest('/professionals/categories');
  const source = response?.data ?? {};
  const categoriesRaw =
    source?.categorias ||
    source?.items ||
    source?.data ||
    source;

  return toArray(categoriesRaw).map((item) => ({
    id: pick(item, ['id_categoria', 'id']),
    nome: pick(item, ['nome'], 'Categoria'),
    descricao: pick(item, ['descricao'], ''),
  }));
}

export function getServiceCategories(professionals = []) {
  const categoryMap = new Map();

  professionals.forEach((professional) => {
    (professional.categorias || []).forEach((categoria) => {
      const key = categoria.toLowerCase();
      if (!categoryMap.has(key)) {
        categoryMap.set(key, categoria);
      }
    });
  });

  return Array.from(categoryMap.entries())
    .map(([id, nome]) => ({ id, nome }))
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
}

