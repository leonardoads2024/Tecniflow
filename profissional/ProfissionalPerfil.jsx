import { Camera, Crown, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/useAuth';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PanelCard from '../../components/ui/PanelCard';
import {
  getMyProfessionalProfile,
  getMyUserProfile,
  getProfessionalCategories,
  updateMyProfessionalProfile,
  updateMyUserProfile,
} from '../../services/profileService';
import './ProfissionalDashboard.css';
import '../shared/ProfilePages.css';

export default function ProfissionalPerfil() {
  const { updateUser, user } = useAuth();
  const [account, setAccount] = useState(null);
  const [profile, setProfile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [accountForm, setAccountForm] = useState({ nome: '', telefone: '', foto_url: '' });
  const [profileForm, setProfileForm] = useState({
    id_categoria: '',
    descricao: '',
    experiencia: '',
    disponibilidade: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const profileHighlights = [
    {
      title: 'Presenca mais confiavel',
      description: 'Foto, descricao e disponibilidade claras ajudam a elevar percepcao de qualidade.',
      icon: <Camera size={16} />,
    },
    {
      title: 'Reputacao e governanca',
      description: 'Perfis consistentes se conectam melhor com avaliacao, verificacao e historico.',
      icon: <ShieldCheck size={16} />,
    },
    {
      title: 'Visibilidade comercial',
      description: 'Premium, boa resposta e perfil forte aumentam suas chances dentro do marketplace.',
      icon: <Crown size={16} />,
    },
  ];

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError('');
        const [userData, professionalData, categoryData] = await Promise.all([
          getMyUserProfile(),
          getMyProfessionalProfile(),
          getProfessionalCategories(),
        ]);

        setAccount(userData);
        setProfile(professionalData);
        setCategories(categoryData);
        setAccountForm({
          nome: userData.nome,
          telefone: userData.telefone || '',
          foto_url: userData.fotoUrl || '',
        });
        setProfileForm({
          id_categoria: professionalData.categoriaId || '',
          descricao: professionalData.descricao || '',
          experiencia: professionalData.experiencia || '',
          disponibilidade: professionalData.disponibilidade || '',
        });
      } catch (err) {
        setError(err?.message || 'Erro ao carregar perfil profissional.');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  function handleAccountChange(event) {
    const { name, value } = event.target;
    setAccountForm((current) => ({ ...current, [name]: value }));
  }

  function handleProfessionalChange(event) {
    const { name, value } = event.target;
    setProfileForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError('');
      setFeedback('');

      const [updatedAccount, updatedProfessional] = await Promise.all([
        updateMyUserProfile(accountForm),
        updateMyProfessionalProfile(profileForm),
      ]);

      setAccount(updatedAccount);
      updateUser({
        ...(user || {}),
        ...(account || {}),
        ...updatedAccount,
        fotoUrl: updatedAccount.fotoUrl,
        foto_url: updatedAccount.fotoUrl,
      });
      setProfile(updatedProfessional);
      setAccountForm({
        nome: updatedAccount.nome,
        telefone: updatedAccount.telefone || '',
        foto_url: updatedAccount.fotoUrl || '',
      });
      setProfileForm({
        id_categoria: updatedProfessional.categoriaId || '',
        descricao: updatedProfessional.descricao || '',
        experiencia: updatedProfessional.experiencia || '',
        disponibilidade: updatedProfessional.disponibilidade || '',
      });
      setFeedback('Perfil profissional atualizado com sucesso.');
    } catch (err) {
      setError(err?.message || 'Erro ao salvar perfil profissional.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <DashboardLayout title="Perfil Profissional">
      <section className="profile-page">
        {feedback && <div className="dashboard-feedback">{feedback}</div>}
        {loading && <div className="dashboard-feedback">Carregando perfil profissional...</div>}
        {error && <div className="dashboard-error">{error}</div>}

        {!loading && account && profile && (
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
              <PanelCard title="Dados da conta e perfil" subtitle="Fortaleca sua confianca na plataforma">
                <form className="profile-form" onSubmit={handleSubmit}>
                  <div className="profile-avatar-card">
                    {accountForm.foto_url ? (
                      <img
                        src={accountForm.foto_url}
                        alt={`Foto de ${accountForm.nome}`}
                        className="profile-avatar-image"
                      />
                    ) : (
                      <div className="profile-avatar-fallback">{accountForm.nome?.charAt(0) || 'P'}</div>
                    )}

                    <div>
                      <strong>Imagem profissional</strong>
                      <p>
                        Um perfil com foto transmite mais credibilidade e tende a performar melhor em conversao.
                      </p>
                    </div>
                  </div>

                  <div className="profile-form-row">
                    <div className="profile-form-group">
                      <label htmlFor="profissional-nome">Nome</label>
                      <input
                        id="profissional-nome"
                        name="nome"
                        value={accountForm.nome}
                        onChange={handleAccountChange}
                      />
                    </div>

                    <div className="profile-form-group">
                      <label htmlFor="profissional-telefone">Telefone</label>
                      <input
                        id="profissional-telefone"
                        name="telefone"
                        value={accountForm.telefone}
                        onChange={handleAccountChange}
                      />
                    </div>
                  </div>

                  <div className="profile-form-group">
                    <label htmlFor="profissional-foto-url">URL da foto</label>
                    <input
                      id="profissional-foto-url"
                      name="foto_url"
                      value={accountForm.foto_url}
                      onChange={handleAccountChange}
                      placeholder="https://exemplo.com/minha-foto.jpg"
                    />
                  </div>

                  <div className="profile-form-group">
                    <label htmlFor="profissional-categoria">Area de atuacao</label>
                    <select
                      id="profissional-categoria"
                      name="id_categoria"
                      value={profileForm.id_categoria}
                      onChange={handleProfessionalChange}
                    >
                      <option value="">Selecione sua categoria principal</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.nome}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="profile-form-group">
                    <label htmlFor="profissional-descricao">Descricao</label>
                    <textarea
                      id="profissional-descricao"
                      name="descricao"
                      value={profileForm.descricao}
                      onChange={handleProfessionalChange}
                    />
                  </div>

                  <div className="profile-form-row">
                    <div className="profile-form-group">
                      <label htmlFor="profissional-experiencia">Experiencia</label>
                      <input
                        id="profissional-experiencia"
                        name="experiencia"
                        value={profileForm.experiencia}
                        onChange={handleProfessionalChange}
                      />
                    </div>

                    <div className="profile-form-group">
                      <label htmlFor="profissional-disponibilidade">Disponibilidade</label>
                      <input
                        id="profissional-disponibilidade"
                        name="disponibilidade"
                        value={profileForm.disponibilidade}
                        onChange={handleProfessionalChange}
                      />
                    </div>
                  </div>

                  <div className="profile-actions">
                    <button type="submit" className="topbar-logout-button" disabled={saving}>
                      {saving ? 'Salvando...' : 'Salvar perfil'}
                    </button>
                  </div>
                </form>
              </PanelCard>

              <PanelCard title="Resumo profissional" subtitle="Elementos que impactam sua conversao">
                <div className="profile-info-list">
                  <div className="profile-info-item">
                    <span>E-mail</span>
                    <strong>{account.email}</strong>
                  </div>
                  <div className="profile-info-item">
                    <span>Area de atuacao</span>
                    <strong>{profile.categorias || 'Nao definida'}</strong>
                  </div>
                  <div className="profile-info-item">
                    <span>Avaliacao media</span>
                    <strong>{profile.avaliacaoMedia.toFixed(1)}</strong>
                  </div>
                  <div className="profile-info-item">
                    <span>Perfil verificado</span>
                    <strong>{profile.verificado ? 'Sim' : 'Nao'}</strong>
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
