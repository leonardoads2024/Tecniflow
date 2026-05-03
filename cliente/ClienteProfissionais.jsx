import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PanelCard from '../../components/ui/PanelCard';
import StatusBadge from '../../components/ui/StatusBadge';
import {
  getProfessionals,
  getServiceCategories,
} from '../../services/professionalDirectoryService';
import './ClienteProfissionais.css';

function formatRating(value) {
  if (!value) return 'Novo';
  return Number(value).toFixed(1).replace('.', ',');
}

function getInitial(name = '') {
  return String(name || 'P').trim().charAt(0).toUpperCase() || 'P';
}

export default function ClienteProfissionais() {
  const navigate = useNavigate();
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBadge, setSelectedBadge] = useState('todos');
  const categories = useMemo(() => getServiceCategories(professionals), [professionals]);

  useEffect(() => {
    async function loadProfessionals() {
      try {
        setLoading(true);
        setError('');
        const data = await getProfessionals();
        setProfessionals(data);
      } catch (err) {
        setError(err?.message || 'Erro ao carregar profissionais.');
      } finally {
        setLoading(false);
      }
    }

    loadProfessionals();
  }, []);

  const filteredProfessionals = useMemo(() => {
    return professionals.filter((professional) => {
      const matchesCategory =
        selectedCategory === 'todos' ||
        professional.categorias.some(
          (categoria) => categoria.toLowerCase() === selectedCategory.toLowerCase()
        );

      const normalizedSearch = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !normalizedSearch ||
        professional.nome.toLowerCase().includes(normalizedSearch) ||
        professional.descricao.toLowerCase().includes(normalizedSearch) ||
        professional.experiencia.toLowerCase().includes(normalizedSearch) ||
        professional.categorias.some((categoria) =>
          categoria.toLowerCase().includes(normalizedSearch)
        );

      const matchesBadge =
        selectedBadge === 'todos' ||
        (selectedBadge === 'premium' && professional.premium) ||
        (selectedBadge === 'verificado' && professional.verificado);

      return matchesCategory && matchesSearch && matchesBadge;
    });
  }, [professionals, searchTerm, selectedBadge, selectedCategory]);

  const premiumCount = professionals.filter((professional) => professional.premium).length;
  const verifiedCount = professionals.filter((professional) => professional.verificado).length;

  return (
    <DashboardLayout title="Encontrar Profissionais">
      <section className="client-directory-page">
        <section className="client-directory-overview">
          <div className="client-directory-overview-card highlight">
            <strong>{filteredProfessionals.length}</strong>
            <span>profissionais no filtro atual</span>
          </div>
          <div className="client-directory-overview-card">
            <strong>{premiumCount}</strong>
            <span>perfis premium na base</span>
          </div>
          <div className="client-directory-overview-card">
            <strong>{verifiedCount}</strong>
            <span>perfis verificados disponiveis</span>
          </div>
        </section>

        <PanelCard
          title="Profissionais em destaque"
          subtitle="Encontre especialistas confiaveis para abrir sua solicitacao"
        >
          <div className="client-directory-toolbar">
            <div className="client-directory-search">
              <label htmlFor="directorySearch">Buscar por nome, servico ou experiencia</label>
              <input
                id="directorySearch"
                type="text"
                placeholder="Ex.: eletricista, redes, manutencao"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="client-directory-filter">
              <label htmlFor="categoryFilter">Categoria</label>
              <select
                id="categoryFilter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="todos">Todas</option>
                {categories.map((category) => (
                  <option key={category.id} value={String(category.id)}>
                    {category.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="client-directory-filter">
              <label htmlFor="badgeFilter">Destaque</label>
              <select
                id="badgeFilter"
                value={selectedBadge}
                onChange={(e) => setSelectedBadge(e.target.value)}
              >
                <option value="todos">Todos</option>
                <option value="premium">Premium</option>
                <option value="verificado">Verificados</option>
              </select>
            </div>
          </div>

          {loading && <div className="client-directory-feedback">Carregando profissionais...</div>}
          {error && <div className="client-directory-error">{error}</div>}

          {!loading && !error && filteredProfessionals.length === 0 && (
            <div className="client-directory-empty">
              <strong>Nenhum profissional encontrado para este filtro.</strong>
              <p>
                Ajuste a categoria, remova a busca atual ou abra uma solicitacao em triagem para a
                plataforma acompanhar sua necessidade.
              </p>
              <div className="client-directory-empty-actions">
                <button
                  type="button"
                  className="directory-secondary-button"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('todos');
                    setSelectedBadge('todos');
                  }}
                >
                  Limpar filtros
                </button>

                <button
                  type="button"
                  className="directory-primary-button"
                  onClick={() => navigate('/cliente/nova-solicitacao')}
                >
                  Abrir solicitacao
                </button>
              </div>
            </div>
          )}

          {!loading && !error && filteredProfessionals.length > 0 && (
            <div className="client-directory-list">
              {filteredProfessionals.map((professional) => (
                <article className="professional-directory-card" key={professional.id}>
                  <div className="professional-directory-main">
                    <div className="professional-directory-header">
                      <div className="professional-directory-identity">
                        {professional.fotoUrl ? (
                          <img
                            src={professional.fotoUrl}
                            alt={`Foto de ${professional.nome}`}
                            className="professional-directory-avatar"
                          />
                        ) : (
                          <div className="professional-directory-avatar professional-directory-avatar-fallback">
                            {getInitial(professional.nome)}
                          </div>
                        )}

                        <div>
                          <strong>{professional.nome}</strong>
                          <p>{professional.descricao}</p>
                        </div>
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

                    <div className="professional-directory-metrics">
                      <span>Avaliacao: {formatRating(professional.avaliacaoMedia)}</span>
                      <span>Avaliacoes: {professional.totalAvaliacoes}</span>
                      <span>Concluidos: {professional.totalConcluidos}</span>
                      <span>Disponibilidade: {professional.disponibilidade}</span>
                    </div>

                    {professional.categorias.length > 0 && (
                      <div className="professional-directory-categories">
                        {professional.categorias.map((categoria) => (
                          <span key={`${professional.id}-${categoria}`}>{categoria}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="professional-directory-actions">
                    <button
                      type="button"
                      className="directory-secondary-button"
                      onClick={() => navigate(`/cliente/profissionais/${professional.id}`)}
                    >
                      Ver perfil
                    </button>

                    <button
                      type="button"
                      className="directory-primary-button"
                      onClick={() =>
                        navigate('/cliente/nova-solicitacao', {
                          state: {
                            professional,
                          },
                        })
                      }
                    >
                      Solicitar servico
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </PanelCard>
      </section>
    </DashboardLayout>
  );
}
