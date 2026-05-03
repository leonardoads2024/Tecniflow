import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PanelCard from '../../components/ui/PanelCard';
import { getAdminReviews } from '../../services/adminService';
import '../profissional/ProfissionalDashboard.css';
import './AdminPages.css';

function formatDate(value) {
  if (!value) return 'Não informado';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}

function getRatingTone(nota) {
  if (nota <= 2) return 'red';
  if (nota === 3) return 'yellow';
  return 'green';
}

export default function AdminAvaliacoes() {
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadReviews() {
      try {
        setLoading(true);
        setError('');
        const data = await getAdminReviews();
        setReviews(data);
      } catch (err) {
        setError(err?.message || 'Erro ao carregar avaliações.');
      } finally {
        setLoading(false);
      }
    }

    loadReviews();
  }, []);

  const filteredReviews = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return reviews.filter((review) => {
      const matchesRating =
        ratingFilter === 'todos' ||
        (ratingFilter === 'criticas' && review.nota <= 2) ||
        (ratingFilter === 'medianas' && review.nota === 3) ||
        (ratingFilter === 'positivas' && review.nota >= 4);

      const matchesSearch =
        !normalizedSearch ||
        [
          review.id,
          review.idSolicitacao,
          review.nomeCliente,
          review.nomeProfissional,
          review.nomeCategoria,
          review.comentario,
          review.statusSolicitacao,
        ]
          .filter((value) => value !== null && value !== undefined)
          .some((value) => String(value).toLowerCase().includes(normalizedSearch));

      return matchesRating && matchesSearch;
    });
  }, [ratingFilter, reviews, searchTerm]);

  const criticalReviews = reviews.filter((review) => review.nota <= 2).length;
  const positiveReviews = reviews.filter((review) => review.nota >= 4).length;
  const averageRating = reviews.length
    ? (reviews.reduce((sum, review) => sum + Number(review.nota || 0), 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <DashboardLayout
      title="Admin Avaliações"
      showSearch
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Buscar por cliente, profissional, comentário ou solicitação"
    >
      <section className="admin-page">
        {loading && <div className="dashboard-feedback">Carregando avaliações da plataforma...</div>}
        {error && <div className="dashboard-error">{error}</div>}

        <section className="admin-management-overview">
          <div className="admin-management-card highlight">
            <strong>{filteredReviews.length}</strong>
            <span>avaliacoes no recorte atual</span>
          </div>
          <div className="admin-management-card">
            <strong>{averageRating}</strong>
            <span>media consolidada da reputacao</span>
          </div>
          <div className="admin-management-card">
            <strong>{criticalReviews}</strong>
            <span>reviews criticas na plataforma</span>
          </div>
        </section>

        <PanelCard
          title="Monitoramento de avaliações"
          subtitle="Acompanhe provas sociais, notas críticas e sinais de desgaste na experiência"
        >
          <div className="admin-actions-row">
            <label className="admin-form-group">
              <span className="admin-muted">Filtrar por faixa de nota</span>
              <select
                value={ratingFilter}
                onChange={(event) => setRatingFilter(event.target.value)}
              >
                <option value="todos">Todos</option>
                <option value="criticas">Críticas (1-2)</option>
                <option value="medianas">Medianas (3)</option>
                <option value="positivas">Positivas (4-5)</option>
              </select>
            </label>
            <span className="admin-tag">Positivas: {positiveReviews}</span>
          </div>

          {!searchTerm.trim() ? (
            <div className="admin-search-empty">
              <strong>Busque avaliações para moderar com contexto</strong>
              <p>Use cliente, profissional, comentário ou solicitação para investigar rapidamente pontos de atrito.</p>
            </div>
          ) : (
            <div className="admin-list">
              {filteredReviews.length === 0 ? (
                <div className="admin-list-item">
                  <div>
                    <strong>Nenhuma avaliação encontrada</strong>
                    <p>Não há registros para os critérios aplicados.</p>
                  </div>
                </div>
              ) : (
                filteredReviews.map((review) => (
                  <div className="admin-list-item" key={review.id}>
                    <div>
                      <strong>{`Avaliação #${review.id} - solicitação #${review.idSolicitacao || 'n/a'}`}</strong>
                      <p>
                        Cliente: {review.nomeCliente} | Profissional: {review.nomeProfissional}
                      </p>
                      <p>
                        Categoria: {review.nomeCategoria} | Status da solicitação: {review.statusSolicitacao} |
                        Prioridade: {review.prioridadeSolicitacao}
                      </p>
                      <p>{review.comentario || 'Sem comentário textual.'}</p>
                      <p>Registrada em: {formatDate(review.dataAvaliacao)}</p>
                    </div>

                    <div className="admin-item-actions">
                      <span className={`status-badge-ui ${getRatingTone(review.nota)}`}>
                        {review.nota}/5
                      </span>
                      {review.nota <= 2 && <span className="admin-tag">Atenção</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </PanelCard>
      </section>
    </DashboardLayout>
  );
}
