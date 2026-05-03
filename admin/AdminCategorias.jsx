import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PanelCard from '../../components/ui/PanelCard';
import {
  createAdminCategory,
  getAdminCategories,
  updateAdminCategory,
} from '../../services/adminService';
import '../profissional/ProfissionalDashboard.css';
import './AdminPages.css';

const initialForm = {
  nome: '',
  descricao: '',
};

export default function AdminCategorias() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  async function loadCategories(showLoading = true) {
    try {
      if (showLoading) setLoading(true);
      setError('');
      const data = await getAdminCategories();
      setCategories(data);
    } catch (err) {
      setError(err?.message || 'Erro ao carregar categorias.');
    } finally {
      if (showLoading) setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  const describedCategories = categories.filter((category) => category.descricao?.trim()).length;

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleEdit(category) {
    setEditingId(category.id);
    setForm({
      nome: category.nome,
      descricao: category.descricao,
    });
    setFeedback('');
    setError('');
  }

  function handleCancelEdit() {
    setEditingId(null);
    setForm(initialForm);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.nome.trim()) {
      setError('Informe o nome da categoria.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setFeedback('');

      if (editingId) {
        await updateAdminCategory(editingId, {
          nome: form.nome.trim(),
          descricao: form.descricao.trim(),
        });
        setFeedback('Categoria atualizada com sucesso.');
      } else {
        await createAdminCategory({
          nome: form.nome.trim(),
          descricao: form.descricao.trim(),
        });
        setFeedback('Categoria criada com sucesso.');
      }

      handleCancelEdit();
      await loadCategories(false);
    } catch (err) {
      setError(err?.message || 'Erro ao salvar categoria.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <DashboardLayout title="Admin Categorias">
      <section className="admin-page">
        {feedback && <div className="dashboard-feedback">{feedback}</div>}
        {loading && <div className="dashboard-feedback">Carregando categorias...</div>}
        {error && <div className="dashboard-error">{error}</div>}

        <section className="admin-management-overview">
          <div className="admin-management-card highlight">
            <strong>{categories.length}</strong>
            <span>categorias ativas na plataforma</span>
          </div>
          <div className="admin-management-card">
            <strong>{describedCategories}</strong>
            <span>categorias com descricao consolidada</span>
          </div>
          <div className="admin-management-card">
            <strong>{editingId ? 'Edicao' : 'Expansao'}</strong>
            <span>{editingId ? 'modo de ajuste da taxonomia' : 'momento ideal para ampliar a oferta'}</span>
          </div>
        </section>

        <div className="admin-grid-two">
          <PanelCard
            title="Categorias do marketplace"
            subtitle="Eixos centrais para descoberta e matching de profissionais"
          >
            <div className="admin-list">
              {categories.length === 0 ? (
                <div className="admin-list-item">
                  <div>
                    <strong>Nenhuma categoria cadastrada</strong>
                    <p>Crie a primeira categoria para estruturar o marketplace.</p>
                  </div>
                </div>
              ) : (
                categories.map((category) => (
                  <div className="admin-list-item" key={category.id}>
                    <div>
                      <strong>{category.nome}</strong>
                      <p>{category.descricao || 'Sem descricao cadastrada.'}</p>
                      <p>Criada por usuario: {category.criadaPorUsuario || 'Nao informado'}</p>
                    </div>

                    <div className="admin-item-actions">
                      <button
                        type="button"
                        className="topbar-logout-button"
                        onClick={() => handleEdit(category)}
                      >
                        Editar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </PanelCard>

          <PanelCard
            title={editingId ? 'Editar categoria' : 'Nova categoria'}
            subtitle="Mantenha a taxonomia clara e orientada ao negocio"
          >
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label htmlFor="categoria-nome">Nome</label>
                <input
                  id="categoria-nome"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  placeholder="Ex.: Eletricista residencial"
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="categoria-descricao">Descricao</label>
                <textarea
                  id="categoria-descricao"
                  name="descricao"
                  value={form.descricao}
                  onChange={handleChange}
                  placeholder="Defina quando essa categoria deve ser usada na plataforma"
                />
              </div>

              <div className="admin-actions-row">
                <button type="submit" className="topbar-logout-button" disabled={saving}>
                  {saving ? 'Salvando...' : editingId ? 'Atualizar categoria' : 'Criar categoria'}
                </button>

                {editingId && (
                  <button
                    type="button"
                    className="topbar-icon-button"
                    onClick={handleCancelEdit}
                  >
                    Cancelar edicao
                  </button>
                )}
              </div>
            </form>
          </PanelCard>
        </div>
      </section>
    </DashboardLayout>
  );
}
