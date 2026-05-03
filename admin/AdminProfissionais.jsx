import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PanelCard from '../../components/ui/PanelCard';
import {
  getAdminProfessionals,
  updateAdminProfessionalVerification,
} from '../../services/adminService';
import '../profissional/ProfissionalDashboard.css';
import './AdminPages.css';

export default function AdminProfissionais() {
  const [professionals, setProfessionals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  async function loadProfessionals(showLoading = true) {
    try {
      if (showLoading) setLoading(true);
      setError('');
      const data = await getAdminProfessionals();
      setProfessionals(data);
    } catch (err) {
      setError(err?.message || 'Erro ao carregar profissionais.');
    } finally {
      if (showLoading) setLoading(false);
    }
  }

  useEffect(() => {
    loadProfessionals();
  }, []);

  const filteredProfessionals = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return professionals.filter((professional) => {
      if (!normalizedSearch) return true;

      return [
        professional.nome,
        professional.email,
        professional.telefone,
        professional.categorias,
        professional.experiencia,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedSearch));
    });
  }, [professionals, searchTerm]);

  const verifiedCount = professionals.filter((professional) => professional.verificado).length;
  const premiumCount = professionals.filter((professional) => professional.premium).length;

  async function handleToggleVerification(professional) {
    try {
      setSavingId(professional.id);
      setError('');
      setFeedback('');
      await updateAdminProfessionalVerification(professional.id, professional.verificado ? 0 : 1);
      setFeedback(`Verificacao de ${professional.nome} atualizada com sucesso.`);
      await loadProfessionals(false);
    } catch (err) {
      setError(err?.message || 'Erro ao atualizar verificacao.');
    } finally {
      setSavingId(null);
    }
  }

  return (
    <DashboardLayout
      title="Admin Profissionais"
      showSearch
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Buscar por profissional, email ou categoria"
    >
      <section className="admin-page">
        {feedback && <div className="dashboard-feedback">{feedback}</div>}
        {loading && <div className="dashboard-feedback">Carregando profissionais...</div>}
        {error && <div className="dashboard-error">{error}</div>}

        <section className="admin-management-overview">
          <div className="admin-management-card highlight">
            <strong>{filteredProfessionals.length}</strong>
            <span>perfis no recorte atual</span>
          </div>
          <div className="admin-management-card">
            <strong>{verifiedCount}</strong>
            <span>profissionais verificados</span>
          </div>
          <div className="admin-management-card">
            <strong>{premiumCount}</strong>
            <span>profissionais premium</span>
          </div>
        </section>

        <PanelCard
          title="Gestao de profissionais"
          subtitle="Validacao de qualidade, premium e saude operacional da oferta"
        >
          {!searchTerm.trim() ? (
            <div className="admin-search-empty">
              <strong>Busque o profissional que deseja revisar</strong>
              <p>Use nome, e-mail ou categoria para evitar uma dashboard poluida com toda a base aberta.</p>
            </div>
          ) : (
            <div className="admin-list">
              {filteredProfessionals.length === 0 ? (
              <div className="admin-list-item">
                <div>
                  <strong>Nenhum profissional encontrado</strong>
                  <p>Nao ha perfis para os criterios pesquisados.</p>
                </div>
              </div>
            ) : (
              filteredProfessionals.map((professional) => (
                <div className="admin-list-item" key={professional.id}>
                  <div>
                    <strong>{professional.nome}</strong>
                    <p>{professional.email} | {professional.telefone}</p>
                    <p>{professional.descricao}</p>
                    <p>
                      Categorias: {professional.categorias} | Experiencia: {professional.experiencia}
                    </p>
                    <p>
                      Avaliacao: {professional.avaliacaoMedia} | Avaliacoes: {professional.totalAvaliacoes} |
                      Concluidos: {professional.totalConcluidos}
                    </p>
                  </div>

                  <div className="admin-item-actions">
                    <span className={`status-badge-ui ${professional.statusUsuario === 1 ? 'green' : 'red'}`}>
                      {professional.statusUsuario === 1 ? 'Conta ativa' : 'Conta inativa'}
                    </span>
                    <span className={`status-badge-ui ${professional.verificado ? 'blue' : 'gray'}`}>
                      {professional.verificado ? 'Verificado' : 'Nao verificado'}
                    </span>
                    {professional.premium && <span className="admin-tag">Premium</span>}
                    <button
                      type="button"
                      className="topbar-logout-button"
                      onClick={() => handleToggleVerification(professional)}
                      disabled={savingId === professional.id}
                    >
                      {savingId === professional.id
                        ? 'Salvando...'
                        : professional.verificado
                          ? 'Remover selo'
                          : 'Verificar perfil'}
                    </button>
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
