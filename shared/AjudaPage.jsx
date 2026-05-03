import { BookOpenText, LifeBuoy, ShieldCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PanelCard from '../../components/ui/PanelCard';
import { useAuth } from '../../contexts/useAuth';
import './AjudaPage.css';

const faqsByRole = {
  cliente: [
    {
      question: 'Como funciona a abertura de uma solicitacao?',
      answer:
        'Voce escolhe a categoria, descreve a necessidade e a plataforma busca ate 4 profissionais compativeis. Se nao houver oferta imediata, o pedido fica em triagem.',
    },
    {
      question: 'O que acontece quando nenhum profissional e encontrado?',
      answer:
        'O TECNIFLOW registra sua solicitacao e a deixa aguardando encaminhamento. Enquanto isso, voce ainda pode explorar a vitrine manualmente.',
    },
    {
      question: 'Quando posso cancelar ou confirmar um servico?',
      answer:
        'Cancelamento fica disponivel nos status iniciais. A confirmacao de conclusao aparece quando o profissional marca o atendimento como finalizado.',
    },
  ],
  profissional: [
    {
      question: 'Como os leads chegam ate mim?',
      answer:
        'A plataforma distribui solicitacoes por categoria com base em premium, verificacao, reputacao e historico de desempenho.',
    },
    {
      question: 'Quando os dados do cliente ficam visiveis?',
      answer:
        'Antes da liberacao do lead, o pedido aparece protegido. Depois do desbloqueio com creditos, o contato completo fica disponivel.',
    },
    {
      question: 'Como melhorar minha conversao?',
      answer:
        'Mantenha o perfil completo, acumule boas avaliacoes, conclua servicos e acompanhe plano, carteira e respostas com rapidez.',
    },
  ],
  admin: [
    {
      question: 'O que devo acompanhar primeiro no painel?',
      answer:
        'Comece por solicitacoes abertas, incidentes, avaliacoes criticas e oferta profissional. Esses sinais mostram saude operacional e risco reputacional.',
    },
    {
      question: 'Como a central de incidentes deve ser usada?',
      answer:
        'Ela concentra denuncias, disputas e revisoes internas. Sempre que houver risco de experiencia, registre e acompanhe por status.',
    },
    {
      question: 'Qual e o foco do admin no TECNIFLOW?',
      answer:
        'Equilibrar demanda, qualidade da oferta, monetizacao por lead e confianca do cliente sem deixar a plataforma perder governanca.',
    },
  ],
};

const quickGuides = {
  cliente: [
    {
      title: 'Abrir novo pedido',
      description: 'Descreva a necessidade, selecione a categoria e acompanhe o pool recomendado.',
      actionLabel: 'Nova solicitacao',
      path: '/cliente/nova-solicitacao',
    },
    {
      title: 'Explorar especialistas',
      description: 'Use a vitrine para buscar manualmente profissionais por categoria e reputacao.',
      actionLabel: 'Ver profissionais',
      path: '/cliente/profissionais',
    },
  ],
  profissional: [
    {
      title: 'Operar meus leads',
      description: 'Veja solicitacoes recebidas, desbloqueie leads e avance no funil de atendimento.',
      actionLabel: 'Ir para servicos',
      path: '/profissional/servicos',
    },
    {
      title: 'Melhorar meu perfil',
      description: 'Fortaleca reputacao com foto, descricao, categorias e plano mais adequado.',
      actionLabel: 'Editar perfil',
      path: '/profissional/perfil',
    },
  ],
  admin: [
    {
      title: 'Acompanhar operacao',
      description: 'Monitore solicitacoes, incidentes e avaliacao da experiencia da plataforma.',
      actionLabel: 'Abrir dashboard',
      path: '/admin/dashboard',
    },
    {
      title: 'Investigar riscos',
      description: 'Use incidentes, auditoria e avaliacoes para agir antes que os problemas escalem.',
      actionLabel: 'Ir para incidentes',
      path: '/admin/incidentes',
    },
  ],
};

const roleHighlights = {
  cliente: [
    'Abra pedidos por categoria e acompanhe o encaminhamento com mais clareza.',
    'Use solicitacoes e notificacoes para nao perder nenhum passo do atendimento.',
    'Feche o ciclo com confirmacao e avaliacao para fortalecer a qualidade da plataforma.',
  ],
  profissional: [
    'Operar leads com velocidade melhora conversao e reputacao do perfil.',
    'Carteira, premium e avaliacoes ajudam a sustentar tracao comercial recorrente.',
    'Perfis completos e bem avaliados ganham mais confianca dentro do marketplace.',
  ],
  admin: [
    'Solicitacoes, incidentes e avaliacoes mostram a saude operacional do produto.',
    'Auditoria e governanca reduzem risco e aumentam confianca na plataforma.',
    'Oferta profissional, monetizacao e atrito precisam andar equilibrados.',
  ],
};

function getRoleKey(role) {
  const normalized = String(role || '').toLowerCase().trim();
  if (normalized === 'admin') return 'admin';
  if (normalized === 'cliente') return 'cliente';
  return 'profissional';
}

export default function AjudaPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const roleKey = getRoleKey(user?.tipo_usuario || user?.tipo || user?.role);
  const faqs = faqsByRole[roleKey];
  const guides = quickGuides[roleKey];
  const highlights = roleHighlights[roleKey];

  return (
    <DashboardLayout title="Ajuda e Suporte">
      <section className="help-page">
        <section className="help-hero">
          <div className="help-hero-copy">
            <span className="help-eyebrow">Central TECNIFLOW</span>
            <h2>Ajuda contextual para manter sua jornada clara dentro da plataforma.</h2>
            <p>
              Esta central foi pensada para reduzir atrito, explicar fluxos do marketplace e dar
              um caminho rapido para a proxima acao mais util do seu perfil.
            </p>
          </div>

          <div className="help-hero-badges">
            <div className="help-hero-card">
              <Sparkles size={18} />
              <strong>Guia por perfil</strong>
              <span>Conteudo adaptado para cliente, profissional e admin.</span>
            </div>
            <div className="help-hero-card">
              <ShieldCheck size={18} />
              <strong>Fluxos principais</strong>
              <span>Solicitacoes, leads, incidentes e operacao explicados de forma objetiva.</span>
            </div>
          </div>
        </section>

        <section className="help-highlight-strip">
          {highlights.map((item) => (
            <div className="help-highlight-card" key={item}>
              <strong>Ponto de atencao</strong>
              <span>{item}</span>
            </div>
          ))}
        </section>

        <div className="help-grid">
          <PanelCard
            title="Primeiros passos"
            subtitle="Atalhos para o que mais importa no seu momento dentro da plataforma"
          >
            <div className="help-guide-list">
              {guides.map((guide) => (
                <div className="help-guide-card" key={guide.path}>
                  <div>
                    <strong>{guide.title}</strong>
                    <p>{guide.description}</p>
                  </div>
                  <button
                    type="button"
                    className="help-action-button"
                    onClick={() => navigate(guide.path)}
                  >
                    {guide.actionLabel}
                  </button>
                </div>
              ))}
            </div>
          </PanelCard>

          <PanelCard
            title="Canais de suporte"
            subtitle="Blocos de apoio para demonstracao e operacao do produto"
          >
            <div className="help-support-stack">
              <div className="help-support-card accent-cyan">
                <LifeBuoy size={18} />
                <strong>Suporte operacional</strong>
                <p>
                  Em caso de divergencia em um servico, use o relato de incidente direto na
                  solicitacao para que o admin acompanhe o caso.
                </p>
              </div>

              <div className="help-support-card accent-amber">
                <BookOpenText size={18} />
                <strong>Base de entendimento</strong>
                <p>
                  O TECNIFLOW segue uma logica de marketplace tecnico com matching, reputacao,
                  lead protegido e fluxo de atendimento controlado.
                </p>
              </div>
            </div>
          </PanelCard>
        </div>

        <PanelCard
          title="Perguntas frequentes"
          subtitle="Respostas curtas para os pontos que mais geram duvida no uso da plataforma"
        >
          <div className="help-faq-list">
            {faqs.map((item) => (
              <article className="help-faq-item" key={item.question}>
                <strong>{item.question}</strong>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </PanelCard>
      </section>
    </DashboardLayout>
  );
}
