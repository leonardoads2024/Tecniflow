import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  Clock3,
  Cpu,
  ShieldCheck,
  Star,
  Users,
  Wrench,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const heroQuickCategories = [
  'Redes e internet',
  'Seguranca eletronica',
  'Eletrica',
  'Informatica',
  'Automacao',
  'Climatizacao',
];

const marketplaceStats = [
  { value: '4 tecnicos', label: 'pool maximo recomendado por solicitacao' },
  { value: '3 sinais', label: 'premium, verificacao e reputacao no ranking' },
  { value: '1 fluxo', label: 'cliente, profissional e admin operando juntos' },
  { value: '24/7', label: 'trilha com incidentes, notificacoes e auditoria' },
];

const categoryCards = [
  {
    title: 'Redes e internet',
    description:
      'Cabeamento, roteadores, access point, fibra, organizacao de rack e suporte tecnico para conectividade.',
    icon: <Zap size={18} />,
  },
  {
    title: 'Seguranca eletronica',
    description:
      'CFTV, alarmes, videoporteiro, controle de acesso e monitoramento para residencias e empresas.',
    icon: <ShieldCheck size={18} />,
  },
  {
    title: 'Eletrica e energia',
    description:
      'Tomadas, quadros, circuitos, manutencao preventiva, iluminacao e adequacoes tecnicas.',
    icon: <Wrench size={18} />,
  },
  {
    title: 'Informatica e suporte',
    description:
      'Computadores, notebooks, impressoras, servidores locais, formatacao e suporte operacional.',
    icon: <Cpu size={18} />,
  },
  {
    title: 'Automacao e smart devices',
    description:
      'Integracao de dispositivos inteligentes, sensores, assistentes de voz e rotina conectada.',
    icon: <Building2 size={18} />,
  },
  {
    title: 'Climatizacao tecnica',
    description:
      'Instalacao, manutencao e suporte para ambientes que dependem de operacao estavel.',
    icon: <BriefcaseBusiness size={18} />,
  },
];

const howItWorks = [
  {
    title: 'Cliente descreve a necessidade',
    description:
      'A jornada comeca pela categoria certa, endereco, prioridade e contexto do servico.',
  },
  {
    title: 'TECNIFLOW organiza o matching',
    description:
      'A plataforma recomenda tecnicos elegiveis seguindo aderencia, reputacao, premium e verificacao.',
  },
  {
    title: 'Atendimento com acompanhamento',
    description:
      'Solicitacao, aceite, andamento, confirmacao, incidente e avaliacao fecham o ciclo com visibilidade.',
  },
];

const trustBlocks = [
  {
    title: 'Confianca para contratar',
    description:
      'O cliente encontra profissionais com contexto melhor do que uma lista fria de contatos.',
    icon: <BadgeCheck size={18} />,
  },
  {
    title: 'Fluxo comercial para profissionais',
    description:
      'O tecnico recebe oportunidades da area dele e investe apenas nos leads que fazem sentido.',
    icon: <Users size={18} />,
  },
  {
    title: 'Governanca de marketplace',
    description:
      'Admin, auditoria, incidentes e sinais operacionais deixam a plataforma preparada para crescer.',
    icon: <ShieldCheck size={18} />,
  },
];

const featuredProfessionals = [
  {
    name: 'Joao Redes',
    area: 'Redes corporativas e residenciais',
    badge: 'Verificado',
    rating: '5,0',
    volume: '12 avaliacoes',
    signal: 'Disponivel hoje',
  },
  {
    name: 'Marina CFTV',
    area: 'Cameras, alarmes e controle de acesso',
    badge: 'Premium',
    rating: '4,9',
    volume: '18 avaliacoes',
    signal: 'Resposta rapida',
  },
  {
    name: 'Carlos Eletrica',
    area: 'Quadros, circuitos e manutencao tecnica',
    badge: 'Verificado',
    rating: '4,8',
    volume: '21 avaliacoes',
    signal: 'Atende empresas',
  },
];

const testimonials = [
  {
    quote:
      'A proposta do TECNIFLOW e sair da logica de contato solto e transformar a demanda tecnica em atendimento organizado.',
    author: 'Visao de produto',
    role: 'Marketplace tecnico com operacao',
  },
  {
    quote:
      'A reputacao do profissional, os sinais de confianca e a camada admin ajudam a plataforma a vender seguranca desde a home.',
    author: 'Direcao de experiencia',
    role: 'Conversao com credibilidade',
  },
];

const professionalBenefits = [
  'Receba oportunidades alinhadas com sua categoria',
  'Use creditos para liberar apenas os leads que valem a pena',
  'Construa reputacao com avaliacao, historico e perfil premium',
];

export default function LandingPage() {
  return (
    <div className="home-page">
      <header className="home-header">
        <div className="home-brand">
          <div className="home-brand-badge">T</div>
          <div>
            <strong>TECNIFLOW</strong>
            <span>Marketplace de servicos tecnicos</span>
          </div>
        </div>

        <nav className="home-nav">
          <Link to="/login" className="home-nav-link">
            Entrar
          </Link>
          <Link to="/cadastro" className="home-nav-button">
            Criar conta
          </Link>
        </nav>
      </header>

      <main className="home-main">
        <section className="home-hero">
          <div className="home-hero-copy">
            <span className="home-eyebrow">Servico tecnico com entrada orientada por intencao</span>
            <h1>Encontre tecnicos confiaveis para resolver demandas reais com mais clareza e menos atrito.</h1>
            <p>
              O TECNIFLOW conecta clientes e profissionais em uma jornada comercial mais forte:
              descoberta por categoria, matching com criterio, operacao acompanhada e fechamento com
              avaliacao.
            </p>

            <div className="home-intent-card">
              <div className="home-intent-copy">
                <strong>O que voce precisa resolver hoje?</strong>
                <span>
                  Escolha uma area tecnica e entre no fluxo certo para abrir sua solicitacao com mais
                  precisao.
                </span>
              </div>

              <div className="home-category-pills">
                {heroQuickCategories.map((category) => (
                  <Link key={category} to="/cadastro" className="home-category-pill">
                    {category}
                  </Link>
                ))}
              </div>
            </div>

            <div className="home-hero-actions">
              <Link to="/cadastro" className="home-primary-button">
                Preciso de um profissional
                <ArrowRight size={18} />
              </Link>
              <Link to="/cadastro" className="home-secondary-button">
                Quero receber servicos
              </Link>
            </div>

            <div className="home-proof-inline">
              <div>
                <Star size={16} />
                <span>Ranking com reputacao, premium e verificacao</span>
              </div>
              <div>
                <Clock3 size={16} />
                <span>Fluxo acompanhado do pedido ate a avaliacao</span>
              </div>
            </div>
          </div>

          <div className="home-hero-panel">
            <div className="hero-command-card">
              <span className="hero-panel-label">Leitura comercial da plataforma</span>
              <strong>Mais do que listar tecnicos: organizar demanda, resposta e confianca.</strong>
              <p>
                A home agora precisa vender velocidade, credibilidade e operacao. Esse e o centro da
                proposta do TECNIFLOW.
              </p>
            </div>

            <div className="hero-live-grid">
              {marketplaceStats.map((item) => (
                <div className="hero-live-card" key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <div className="hero-testimonial-card">
              <div className="hero-stars">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} size={14} fill="currentColor" strokeWidth={1.5} />
                ))}
              </div>
              <p>
                “Quando a entrada publica explica bem o fluxo, a plataforma passa mais seguranca e
                converte melhor cliente e profissional.”
              </p>
              <strong>Experiencia TECNIFLOW</strong>
            </div>
          </div>
        </section>

        <section className="home-section home-section-soft">
          <div className="home-section-header home-section-header-wide">
            <span>Categorias principais</span>
            <h2>Comece pela area certa e transforme a busca em uma decisao mais facil.</h2>
            <p>
              O TECNIFLOW precisa parecer um marketplace vivo. Por isso a entrada publica deve mostrar
              rapidamente onde o usuario se encaixa.
            </p>
          </div>

          <div className="home-category-grid home-category-grid-wide">
            {categoryCards.map((category) => (
              <article className="home-category-card" key={category.title}>
                <div className="home-category-icon">{category.icon}</div>
                <strong>{category.title}</strong>
                <p>{category.description}</p>
                <Link to="/cadastro" className="home-inline-link">
                  Abrir fluxo nessa categoria
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="home-section">
          <div className="home-section-header home-section-header-split">
            <div>
              <span>Como funciona</span>
              <h2>Uma jornada simples na superficie, mas robusta por tras.</h2>
            </div>
            <p>
              A plataforma deve comunicar que o usuario nao esta entrando em uma vitrine vazia, e sim em
              uma operacao estruturada para atender, acompanhar e fechar o servico.
            </p>
          </div>

          <div className="home-steps home-steps-wide">
            {howItWorks.map((step, index) => (
              <div className="home-step-card" key={step.title}>
                <span className="home-step-index">{String(index + 1).padStart(2, '0')}</span>
                <strong>{step.title}</strong>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="home-section home-section-emphasis">
          <div className="home-section-header home-section-header-split">
            <div>
              <span>Profissionais em destaque</span>
              <h2>Prova visual de que existe oferta qualificada dentro da plataforma.</h2>
            </div>
            <p>
              Esse bloco ajuda o cliente a sentir que o marketplace tem gente real, areas reais e sinais
              reais de qualidade.
            </p>
          </div>

          <div className="home-professional-grid">
            {featuredProfessionals.map((professional) => (
              <article className="home-professional-card" key={professional.name}>
                <div className="home-professional-top">
                  <div className="home-professional-avatar">{professional.name.charAt(0)}</div>
                  <div>
                    <strong>{professional.name}</strong>
                    <span>{professional.area}</span>
                  </div>
                </div>

                <div className="home-professional-meta">
                  <span className="home-professional-badge">{professional.badge}</span>
                  <span>{professional.signal}</span>
                </div>

                <div className="home-professional-rating">
                  <div className="hero-stars small">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} size={13} fill="currentColor" strokeWidth={1.5} />
                    ))}
                  </div>
                  <strong>{professional.rating}</strong>
                  <span>{professional.volume}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="home-section">
          <div className="home-section-header home-section-header-split">
            <div>
              <span>Por que isso converte melhor</span>
              <h2>Confianca, criterio e governanca deixam o produto mais comercial.</h2>
            </div>
            <p>
              O valor da landing nao esta so na beleza. Ele aparece quando o usuario entende rapido por
              que vale entrar e confiar no fluxo.
            </p>
          </div>

          <div className="home-highlights home-highlights-wide">
            {trustBlocks.map((item) => (
              <article className="home-highlight-card" key={item.title}>
                <div className="home-highlight-icon">{item.icon}</div>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="home-section home-section-soft">
          <div className="home-dual-grid">
            <div className="home-testimonials-panel">
              <div className="home-section-header">
                <span>Leitura de valor</span>
                <h2>O TECNIFLOW precisa soar confiavel antes mesmo do login.</h2>
              </div>

              <div className="home-testimonial-list">
                {testimonials.map((testimonial) => (
                  <article className="home-testimonial-card" key={testimonial.author}>
                    <p>{testimonial.quote}</p>
                    <strong>{testimonial.author}</strong>
                    <span>{testimonial.role}</span>
                  </article>
                ))}
              </div>
            </div>

            <div className="home-pro-panel">
              <div className="home-section-header">
                <span>Para profissionais</span>
                <h2>Entre para crescer com visibilidade, leads e reputacao.</h2>
              </div>

              <div className="home-pro-benefits">
                {professionalBenefits.map((benefit) => (
                  <div className="home-pro-benefit" key={benefit}>
                    <BadgeCheck size={17} />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              <Link to="/cadastro" className="home-primary-button home-primary-button-block">
                Criar perfil profissional
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        <section className="home-final-cta">
          <div className="home-final-cta-copy">
            <span className="home-eyebrow">Entre no ecossistema TECNIFLOW</span>
            <h2>Comece agora como cliente ou profissional e coloque o fluxo tecnico para rodar.</h2>
            <p>
              A plataforma ja foi pensada para descoberta por categoria, matching com criterio, controle
              operacional e fechamento com avaliacao.
            </p>
          </div>

          <div className="home-final-cta-actions">
            <Link to="/cadastro" className="home-primary-button">
              Criar conta agora
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="home-secondary-button">
              Ja tenho acesso
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
