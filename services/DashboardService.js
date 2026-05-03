import { apiRequest } from './api';

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

  return map[status] || 'Não informado';
}

export async function getProfessionalDashboard() {
  const response = await apiRequest('/dashboard/professional');
  const source = response?.data ?? {};
  const solicitacoes = source?.solicitacoes ?? {};
  const avaliacao = source?.avaliacao ?? {};
  const assinatura = source?.assinatura ?? null;

  return {
    idProfissional: source?.id_profissional ?? null,
    totalSolicitacoes: solicitacoes?.total ?? 0,
    solicitadas: solicitacoes?.solicitadas ?? 0,
    aceitas: solicitacoes?.aceitas ?? 0,
    concluidas: solicitacoes?.concluidas ?? 0,
    emAndamento: solicitacoes?.em_andamento ?? 0,
    canceladas: solicitacoes?.canceladas ?? 0,
    recusadas: solicitacoes?.recusadas ?? 0,
    aguardandoConfirmacao: solicitacoes?.aguardando_confirmacao ?? 0,
    totalAvaliacoes: avaliacao?.total_avaliacoes ?? 0,
    mediaAvaliacao: avaliacao?.media_avaliacao ?? 0,
    assinatura,
    planoNome: assinatura?.nome ?? 'Sem plano ativo',
    planoStatus: assinatura?.status ?? 'inativa',
    premiumAtivo: Boolean(assinatura?.premium_ativo),
    planoDescricao: assinatura?.descricao ?? 'Nenhum benefício premium ativo no momento.',
    planoPeriodo:
      assinatura?.data_inicio && assinatura?.data_fim
        ? `${assinatura.data_inicio} - ${assinatura.data_fim}`
        : 'Não informado',
  };
}

export async function getClientDashboard() {
  const response = await apiRequest('/dashboard/client');
  const source = response?.data ?? {};
  const solicitacoes = source?.solicitacoes ?? {};
  const ultimaSolicitacao = source?.ultima_solicitacao ?? null;

  return {
    totalSolicitacoes: solicitacoes?.total ?? 0,
    solicitacoesAbertas: solicitacoes?.solicitadas ?? 0,
    emAndamento: solicitacoes?.em_andamento ?? 0,
    concluidas: solicitacoes?.concluidas ?? 0,
    canceladas: solicitacoes?.canceladas ?? 0,
    recusadas: solicitacoes?.recusadas ?? 0,
    aguardandoConfirmacao: solicitacoes?.aguardando_confirmacao ?? 0,
    ultimaAvaliacao: 0,
    ultimoServico: ultimaSolicitacao?.descricao_servico ?? 'Não informado',
    statusPredominante: getStatusLabel(ultimaSolicitacao?.status),
    solicitacoesRecentes: ultimaSolicitacao ? [ultimaSolicitacao] : [],
    avaliacoesRecentes: [],
  };
}

