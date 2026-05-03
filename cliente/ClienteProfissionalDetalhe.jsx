import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PanelCard from '../../components/ui/PanelCard';
import RatingStars from '../../components/ui/RatingStars';
import StatusBadge from '../../components/ui/StatusBadge';
import {
  getProfessionalById,
  getProfessionalReviews,
} from '../../services/professionalDirectoryService';
import './ClienteProfissionais.css';

function formatRating(value) {
  if (!value) return 'Novo';
  return Number(value).toFixed(1).replace('.', ',');
}

function getInitial(name = '') {
  return String(name || 'P').trim().charAt(0).toUpperCase() || 'P';
}

export default function ClienteProfissionalDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [professional, setProfessional] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError('');

        const [professionalData, reviewsData] = await Promise.all([
          getProfessionalById(id),
          getProfessionalReviews(id),
        ]);

        setProfessional(professionalData);
        setReviews(reviewsData);
      } catch (err) {
        setError(err?.message || 'Erro ao carregar perfil do profissional.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  return (
    <DashboardLayout
      title="Perfil do Profissional"
      showBackButton
      onBack={() => navigate('/cliente/profissionais')}
    >
      <section className="client-directory-page">
        {loading && <div className="client-directory-feedback">Carregando perfil...</div>}
        {error && <div className="client-directory-error">{error}</div>}

        {!loading && !error && professional && (
          <>
            <section className="professional-profile-intent-strip">
              <div className="professional-profile-intent-card highlight">
                <strong>{formatRating(professional.avaliacaoMedia)}</strong>
                <span>avaliacao media do profissional</span>
              </div>
              <div className="professional-profile-intent-card">
                <strong>{professional.totalConcluidos}</strong>
                <span>servicos concluidos na plataforma</span>
              </div>
              <div className="professional-profile-intent-card">
                <strong>{professional.premium ? 'Premium' : 'Ativo'}</strong>
                <span>camada atual de destaque no marketplace</span>
              </div>
            </section>

            <PanelCard
              title={professional.nome}
              subtitle="Analise experiencia, reputacao e disponibilidade antes de solicitar"
            >
              <div className="professional-profile-summary">
                <div className="professional-profile-copy">
                  <div className="professional-profile-hero">
                    {professional.fotoUrl ? (
                      <img
                        src={professional.fotoUrl}
                        alt={`Foto de ${professional.nome}`}
                        className="professional-profile-avatar"
                      />
                    ) : (
                      <div className="professional-profile-avatar professional-directory-avatar-fallback">
                        {getInitial(professional.nome)}
                      </div>
                    )}

                    <div className="professional-directory-header">
                      <div>
                        <strong>{professional.nome}</strong>
                        <p>{professional.descricao}</p>
                      </div>

                      <div className="professional-directory-badges">
                        {professional.verificado && (
                          <StatusBadge status="em_andamento">Verificado</StatusBadge>
                        )}
                        {professional.premium ? (
                          <StatusBadge status="aceito">Premium</StatusBadge>
                        ) : (
                          <StatusBadge status="solicitado">Ativo</StatusBadge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="professional-profile-grid">
                    <div className="professional-profile-card">
                      <span>Avaliacao media</span>
                      <strong>{formatRating(professional.avaliacaoMedia)}</strong>
                      <RatingStars value={professional.avaliacaoMedia} size={16} />
                    </div>
                    <div className="professional-profile-card">
                      <span>Total de avaliacoes</span>
                      <strong>{professional.totalAvaliacoes}</strong>
                    </div>
                    <div className="professional-profile-card">
                      <span>Servicos concluidos</span>
                      <strong>{professional.totalConcluidos}</strong>
                    </div>
                    <div className="professional-profile-card">
                      <span>Disponibilidade</span>
                      <strong>{professional.disponibilidade}</strong>
                    </div>
                    <div className="professional-profile-card">
                      <span>Experiencia</span>
                      <strong>{professional.experiencia}</strong>
                    </div>
                    <div className="professional-profile-card">
                      <span>Contato</span>
                      <strong>{professional.telefone || 'Nao informado'}</strong>
                    </div>
                  </div>
                </div>

                <div className="professional-profile-actions">
                  <button
                    type="button"
                    className="directory-secondary-button"
                    onClick={() => navigate('/cliente/profissionais')}
                  >
                    Voltar para lista
                  </button>
                  <button
                    type="button"
                    className="directory-primary-button"
                    onClick={() =>
                      navigate('/cliente/nova-solicitacao', {
                        state: { professional },
                      })
                    }
                  >
                    Solicitar este profissional
                  </button>
                </div>
              </div>
            </PanelCard>

            <PanelCard
              title="Avaliacoes publicas"
              subtitle="Feedbacks que ajudam o cliente a decidir com seguranca"
            >
              {reviews.length === 0 ? (
                <div className="client-directory-empty">
                  Este profissional ainda nao possui avaliacoes publicas.
                </div>
              ) : (
                <div className="professional-reviews-list">
                  {reviews.map((review) => (
                    <article className="professional-review-card" key={review.id}>
                      <div className="professional-review-header">
                        <strong>{review.cliente}</strong>
                        <RatingStars value={review.nota} size={15} />
                      </div>
                      <p>{review.comentario}</p>
                    </article>
                  ))}
                </div>
              )}
            </PanelCard>
          </>
        )}
      </section>
    </DashboardLayout>
  );
}
