import { MessageSquareText, ShieldCheck, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PanelCard from '../../components/ui/PanelCard';
import RatingStars from '../../components/ui/RatingStars';
import { getProfessionalDashboard } from '../../services/DashboardService';
import { getProfessionalReviews } from '../../services/professionalDirectoryService';
import './ProfissionalDashboard.css';

function formatDate(value) {
  if (!value) return 'Nao informado';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}

function formatRating(value) {
  if (!value) return '-';
  return Number(value).toFixed(1).replace('.', ',');
}

export default function ProfissionalAvaliacoes() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError('');

        const dashboardData = await getProfessionalDashboard();
        setDashboard(dashboardData);

        if (dashboardData?.idProfissional) {
          const reviewsData = await getProfessionalReviews(dashboardData.idProfissional);
          setReviews(reviewsData);
        } else {
          setReviews([]);
        }
      } catch (err) {
        setError(err?.message || 'Erro ao carregar suas avaliacoes.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <DashboardLayout
      title="Avaliacoes do Profissional"
      showBackButton
      onBack={() => navigate('/profissional/dashboard')}
    >
      <section className="professional-dashboard">
        {loading && <div className="dashboard-feedback">Carregando avaliacoes...</div>}
        {error && <div className="dashboard-error">{error}</div>}

        {!loading && !error && (
          <>
            <section className="professional-dashboard-hero">
              <div className="professional-dashboard-hero-copy">
                <span className="professional-dashboard-kicker">Reputacao do profissional</span>
                <h3>Leia sua prova social com mais contexto e descubra onde sua experiencia pode subir de nivel.</h3>
                <p>
                  Avaliacoes fortes ajudam a converter leads. Comentarios fracos mostram atritos
                  operacionais que valem ajuste no atendimento, prazo e comunicacao.
                </p>
              </div>

              <div className="professional-dashboard-hero-cards">
                <div className="professional-hero-card standout">
                  <Star size={18} />
                  <strong>{formatRating(dashboard?.mediaAvaliacao)}</strong>
                  <RatingStars value={dashboard?.mediaAvaliacao} size={15} />
                  <span>media geral acumulada na plataforma</span>
                </div>
                <div className="professional-hero-card">
                  <MessageSquareText size={18} />
                  <strong>{dashboard?.totalAvaliacoes ?? 0}</strong>
                  <span>avaliacao(oes) usadas na sua reputacao publica</span>
                </div>
              </div>
            </section>

            <section className="professional-command-strip">
              <div className="professional-command-card">
                <div className="professional-command-icon">
                  <Star size={18} />
                </div>
                <div>
                  <strong>{formatRating(dashboard?.mediaAvaliacao)}</strong>
                  <span>media publica que influencia a percepcao do cliente antes mesmo do primeiro contato.</span>
                </div>
              </div>
              <div className="professional-command-card">
                <div className="professional-command-icon">
                  <MessageSquareText size={18} />
                </div>
                <div>
                  <strong>{reviews.length}</strong>
                  <span>comentarios registrados no historico, fortalecendo leitura de experiencia e consistencia.</span>
                </div>
              </div>
              <div className="professional-command-card">
                <div className="professional-command-icon">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <strong>{(dashboard?.mediaAvaliacao ?? 0) >= 4.5 ? 'Alta confianca' : (dashboard?.mediaAvaliacao ?? 0) >= 3 ? 'Confianca moderada' : 'Atencao reputacional'}</strong>
                  <span>leitura sintetica para entender se sua prova social esta ajudando ou travando a conversao.</span>
                </div>
              </div>
            </section>

            <div className="summary-cards">
              <PanelCard title="Media atual" subtitle="Leitura rapida da percepcao do cliente">
                <div className="finance-box">
                  <div className="finance-row accent-green">
                    <span>Nota media</span>
                    <strong>{formatRating(dashboard?.mediaAvaliacao)}</strong>
                  </div>
                  <div className="finance-row accent-cyan">
                    <span>Total de avaliacoes</span>
                    <strong>{dashboard?.totalAvaliacoes ?? 0}</strong>
                  </div>
                </div>
              </PanelCard>

              <PanelCard title="Leitura de reputacao" subtitle="Como sua imagem ajuda a conversao">
                <div className="finance-box">
                  <div className="finance-row">
                    <span>Prova social</span>
                    <strong>{(dashboard?.totalAvaliacoes ?? 0) > 0 ? 'Ativa' : 'Em construcao'}</strong>
                  </div>
                  <div className="finance-row">
                    <span>Confianca percebida</span>
                    <strong>
                      {(dashboard?.mediaAvaliacao ?? 0) >= 4.5
                        ? 'Alta'
                        : (dashboard?.mediaAvaliacao ?? 0) >= 3
                          ? 'Moderada'
                          : 'Sensivel'}
                    </strong>
                  </div>
                </div>
              </PanelCard>

              <PanelCard title="Orientacao" subtitle="O que mais fortalece sua reputacao no TECNIFLOW">
                <div className="review-list">
                  <div className="review-item review-tone-0">
                    <strong>Responda com agilidade</strong>
                    <p>Velocidade de resposta reduz atrito antes mesmo da execucao do servico.</p>
                  </div>
                  <div className="review-item review-tone-1">
                    <strong>Confirme escopo e prazo</strong>
                    <p>Alinhamento claro antes da visita costuma evitar disputa e nota baixa.</p>
                  </div>
                  <div className="review-item review-tone-2">
                    <strong>Feche bem a experiencia</strong>
                    <p>Orientacao final e postura profissional tendem a melhorar comentario e recorrencia.</p>
                  </div>
                </div>
              </PanelCard>
            </div>

            <PanelCard
              title="Historico de avaliacoes"
              subtitle="Comentarios reais de clientes que passaram pelo seu atendimento"
            >
              <div className="review-list">
                {reviews.length === 0 ? (
                  <div className="review-item">
                    <strong>Nenhuma avaliacao registrada ainda</strong>
                    <p>Conclua servicos para construir sua reputacao dentro da plataforma.</p>
                  </div>
                ) : (
                  reviews.map((review, index) => (
                    <div className={`review-item review-tone-${index % 3}`} key={review.id}>
                      <div className="service-item">
                        <div>
                          <strong>{review.cliente}</strong>
                          <p>{formatDate(review.data)}</p>
                        </div>
                        <div className="professional-review-rating">
                          <RatingStars value={review.nota} size={15} />
                          <span>{formatRating(review.nota)}</span>
                        </div>
                      </div>
                      <p>{review.comentario}</p>
                    </div>
                  ))
                )}
              </div>
            </PanelCard>

            <PanelCard
              title="Confianca e verificacao"
              subtitle="Itens que aumentam aderencia e percepcao de qualidade"
            >
              <div className="professional-commercial-grid">
                <div className="professional-commercial-card">
                  <ShieldCheck size={16} />
                  <strong>{dashboard?.premiumAtivo ? 'Premium' : 'Padrao'}</strong>
                  <span>camada de destaque atual do seu perfil</span>
                </div>
                <div className="professional-commercial-card">
                  <Star size={16} />
                  <strong>{dashboard?.concluidas ?? 0}</strong>
                  <span>servicos concluidos ajudando sua prova social</span>
                </div>
              </div>
            </PanelCard>
          </>
        )}
      </section>
    </DashboardLayout>
  );
}
