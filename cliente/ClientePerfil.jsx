import { Camera, ShieldCheck, UserRoundSearch } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/useAuth';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PanelCard from '../../components/ui/PanelCard';
import { getMyUserProfile, updateMyUserProfile } from '../../services/profileService';
import '../profissional/ProfissionalDashboard.css';
import '../shared/ProfilePages.css';

export default function ClientePerfil() {
  const { updateUser, user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ nome: '', telefone: '', foto_url: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const profileHighlights = [
    {
      title: 'Identidade confiavel',
      description: 'Foto e dados atualizados ajudam a plataforma a tornar sua jornada mais clara.',
      icon: <Camera size={16} />,
    },
    {
      title: 'Conta protegida',
      description: 'Se precisar, use a recuperação de senha para manter o acesso sob controle.',
      icon: <ShieldCheck size={16} />,
    },
    {
      title: 'Melhor matching',
      description: 'Seu cadastro consistente facilita entendimento e suporte durante as solicitações.',
      icon: <UserRoundSearch size={16} />,
    },
  ];

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError('');
        const data = await getMyUserProfile();
        setProfile(data);
        setForm({ nome: data.nome, telefone: data.telefone || '', foto_url: data.fotoUrl || '' });
      } catch (err) {
        setError(err?.message || 'Erro ao carregar perfil.');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError('');
      setFeedback('');
      const updated = await updateMyUserProfile(form);
      setProfile(updated);
      updateUser({
        ...(user || {}),
        ...(profile || {}),
        ...updated,
        fotoUrl: updated.fotoUrl,
        foto_url: updated.fotoUrl,
      });
      setForm({ nome: updated.nome, telefone: updated.telefone || '', foto_url: updated.fotoUrl || '' });
      setFeedback('Perfil atualizado com sucesso.');
    } catch (err) {
      setError(err?.message || 'Erro ao atualizar perfil.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <DashboardLayout title="Meu Perfil">
      <section className="profile-page">
        {feedback && <div className="dashboard-feedback">{feedback}</div>}
        {loading && <div className="dashboard-feedback">Carregando perfil...</div>}
        {error && <div className="dashboard-error">{error}</div>}

        {!loading && profile && (
          <>
            <section className="profile-highlight-strip">
              {profileHighlights.map((item) => (
                <div className="profile-highlight-card" key={item.title}>
                  <div className="profile-highlight-icon">{item.icon}</div>
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.description}</span>
                  </div>
                </div>
              ))}
            </section>

            <div className="profile-grid">
              <PanelCard title="Dados da conta" subtitle="Mantenha suas informacoes atualizadas">
                <form className="profile-form" onSubmit={handleSubmit}>
                  <div className="profile-avatar-card">
                    {form.foto_url ? (
                      <img src={form.foto_url} alt={`Foto de ${form.nome}`} className="profile-avatar-image" />
                    ) : (
                      <div className="profile-avatar-fallback">{form.nome?.charAt(0) || 'C'}</div>
                    )}

                    <div>
                      <strong>Foto de perfil</strong>
                      <p>Opcional, mas muito util para reforcar confianca e identidade na plataforma.</p>
                    </div>
                  </div>

                  <div className="profile-form-group">
                    <label htmlFor="cliente-nome">Nome</label>
                    <input id="cliente-nome" name="nome" value={form.nome} onChange={handleChange} />
                  </div>

                  <div className="profile-form-group">
                    <label htmlFor="cliente-telefone">Telefone</label>
                    <input
                      id="cliente-telefone"
                      name="telefone"
                      value={form.telefone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="profile-form-group">
                    <label htmlFor="cliente-foto-url">URL da foto</label>
                    <input
                      id="cliente-foto-url"
                      name="foto_url"
                      value={form.foto_url}
                      onChange={handleChange}
                      placeholder="https://exemplo.com/minha-foto.jpg"
                    />
                  </div>

                  <div className="profile-actions">
                    <button type="submit" className="topbar-logout-button" disabled={saving}>
                      {saving ? 'Salvando...' : 'Salvar perfil'}
                    </button>
                  </div>
                </form>
              </PanelCard>

              <PanelCard title="Resumo da conta" subtitle="Visao geral do seu acesso na plataforma">
                <div className="profile-info-list">
                  <div className="profile-info-item">
                    <span>E-mail</span>
                    <strong>{profile.email}</strong>
                  </div>
                  <div className="profile-info-item">
                    <span>Perfil</span>
                    <strong>{profile.tipoUsuario}</strong>
                  </div>
                  <div className="profile-info-item">
                    <span>Status</span>
                    <strong>{profile.status === 1 ? 'Ativo' : 'Inativo'}</strong>
                  </div>
                </div>
              </PanelCard>
            </div>
          </>
        )}
      </section>
    </DashboardLayout>
  );
}
