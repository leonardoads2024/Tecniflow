import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PanelCard from '../../components/ui/PanelCard';
import {
  createAdminPlan,
  getAdminPlans,
  updateAdminPlan,
} from '../../services/adminService';
import '../profissional/ProfissionalDashboard.css';
import './AdminPages.css';

const initialForm = {
  nome: '',
  preco: '',
  duracaoDias: '',
  destaque: '0',
  descricao: '',
};

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value || 0));
}

export default function AdminPlanos() {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  async function loadPlans(showLoading = true) {
    try {
      if (showLoading) setLoading(true);
      setError('');
      const data = await getAdminPlans();
      setPlans(data);
    } catch (err) {
      setError(err?.message || 'Erro ao carregar planos.');
    } finally {
      if (showLoading) setLoading(false);
    }
  }

  useEffect(() => {
    loadPlans();
  }, []);

  const highlightedPlans = plans.filter((plan) => plan.destaque).length;
  const averageTicket = plans.length
    ? formatCurrency(plans.reduce((sum, plan) => sum + Number(plan.preco || 0), 0) / plans.length)
    : formatCurrency(0);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleEdit(plan) {
    setEditingId(plan.id);
    setForm({
      nome: plan.nome,
      preco: String(plan.preco),
      duracaoDias: String(plan.duracaoDias),
      destaque: plan.destaque ? '1' : '0',
      descricao: plan.descricao,
    });
    setError('');
    setFeedback('');
  }

  function handleCancelEdit() {
    setEditingId(null);
    setForm(initialForm);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.nome.trim() || !form.preco || !form.duracaoDias) {
      setError('Nome, preco e duracao sao obrigatorios.');
      return;
    }

    const payload = {
      nome: form.nome.trim(),
      preco: Number(form.preco),
      duracao_dias: Number(form.duracaoDias),
      destaque: form.destaque === '1',
      descricao: form.descricao.trim(),
    };

    try {
      setSaving(true);
      setError('');
      setFeedback('');

      if (editingId) {
        await updateAdminPlan(editingId, payload);
        setFeedback('Plano atualizado com sucesso.');
      } else {
        await createAdminPlan(payload);
        setFeedback('Plano criado com sucesso.');
      }

      handleCancelEdit();
      await loadPlans(false);
    } catch (err) {
      setError(err?.message || 'Erro ao salvar plano.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <DashboardLayout title="Admin Planos">
      <section className="admin-page">
        {feedback && <div className="dashboard-feedback">{feedback}</div>}
        {loading && <div className="dashboard-feedback">Carregando planos...</div>}
        {error && <div className="dashboard-error">{error}</div>}

        <section className="admin-management-overview">
          <div className="admin-management-card highlight">
            <strong>{plans.length}</strong>
            <span>planos na vitrine premium</span>
          </div>
          <div className="admin-management-card">
            <strong>{highlightedPlans}</strong>
            <span>ofertas com destaque comercial</span>
          </div>
          <div className="admin-management-card">
            <strong>{averageTicket}</strong>
            <span>ticket medio configurado</span>
          </div>
        </section>

        <div className="admin-grid-two">
          <PanelCard
            title="Planos premium"
            subtitle="Configure oferta, destaque e duracao da monetizacao recorrente"
          >
            <div className="admin-list">
              {plans.length === 0 ? (
                <div className="admin-list-item">
                  <div>
                    <strong>Nenhum plano disponivel</strong>
                    <p>Crie o primeiro plano premium da plataforma.</p>
                  </div>
                </div>
              ) : (
                plans.map((plan) => (
                  <div className="admin-list-item" key={plan.id}>
                    <div>
                      <strong>{plan.nome}</strong>
                      <p>{plan.descricao || 'Sem descricao cadastrada.'}</p>
                      <p>
                        {formatCurrency(plan.preco)} | {plan.duracaoDias} dias |{' '}
                        {plan.destaque ? 'Destaque ativado' : 'Sem destaque'}
                      </p>
                    </div>

                    <div className="admin-item-actions">
                      {plan.destaque && <span className="admin-tag">Destaque</span>}
                      <button
                        type="button"
                        className="topbar-logout-button"
                        onClick={() => handleEdit(plan)}
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
            title={editingId ? 'Editar plano' : 'Novo plano'}
            subtitle="Monte ofertas com clareza comercial e duracao coerente"
          >
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label htmlFor="plano-nome">Nome</label>
                <input
                  id="plano-nome"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  placeholder="Ex.: Profissional Premium"
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label htmlFor="plano-preco">Preco</label>
                  <input
                    id="plano-preco"
                    name="preco"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.preco}
                    onChange={handleChange}
                    placeholder="49.90"
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="plano-duracao">Duracao em dias</label>
                  <input
                    id="plano-duracao"
                    name="duracaoDias"
                    type="number"
                    min="1"
                    value={form.duracaoDias}
                    onChange={handleChange}
                    placeholder="30"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label htmlFor="plano-destaque">Destaque</label>
                <select
                  id="plano-destaque"
                  name="destaque"
                  value={form.destaque}
                  onChange={handleChange}
                >
                  <option value="0">Nao</option>
                  <option value="1">Sim</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label htmlFor="plano-descricao">Descricao</label>
                <textarea
                  id="plano-descricao"
                  name="descricao"
                  value={form.descricao}
                  onChange={handleChange}
                  placeholder="Explique a proposta de valor do plano para os profissionais"
                />
              </div>

              <div className="admin-actions-row">
                <button type="submit" className="topbar-logout-button" disabled={saving}>
                  {saving ? 'Salvando...' : editingId ? 'Atualizar plano' : 'Criar plano'}
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
