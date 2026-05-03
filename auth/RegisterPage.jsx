import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerRequest } from '../../services/authService';
import './Login.css';

const onboardingSignals = [
  {
    title: 'Comeco comercial forte',
    text: 'A conta nasce pronta para levar o usuario ao fluxo certo sem cadastro confuso.',
  },
  {
    title: 'Perfil evolutivo',
    text: 'Voce entra rapido agora e reforca foto, reputacao e detalhes depois dentro do painel.',
  },
  {
    title: 'Estrutura para escalar',
    text: 'Solicitacoes, leads, premium e governanca ja fazem parte da experiencia desde o inicio.',
  },
];

const initialForm = {
  nome: '',
  email: '',
  telefone: '',
  foto_url: '',
  tipo_usuario: 'cliente',
  senha: '',
  confirmarSenha: '',
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));

    if (error) {
      setError('');
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      !form.nome ||
      !form.email ||
      !form.telefone ||
      !form.tipo_usuario ||
      !form.senha ||
      !form.confirmarSenha
    ) {
      setError('Preencha todos os campos obrigatorios para criar sua conta.');
      return;
    }

    if (form.senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (form.senha !== form.confirmarSenha) {
      setError('A confirmacao de senha nao confere.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await registerRequest({
        nome: form.nome.trim(),
        email: form.email.trim().toLowerCase(),
        telefone: form.telefone.trim(),
        foto_url: form.foto_url.trim(),
        tipo_usuario: form.tipo_usuario,
        senha: form.senha,
      });

      navigate('/login', {
        state: {
          message: 'Conta criada com sucesso. Agora voce ja pode entrar na plataforma.',
        },
      });
    } catch (err) {
      setError(err?.message || 'Nao foi possivel concluir o cadastro.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <section className="login-brand-panel">
          <div className="brand-badge">ENTRADA TECNIFLOW</div>

          <h1>Crie sua conta e entre em um fluxo tecnico mais profissional e mais comercial.</h1>

          <p>
            Cadastre-se como cliente para encontrar profissionais ou como profissional para receber
            oportunidades, desbloquear leads e construir reputacao.
          </p>

          <div className="auth-hero-note">
            <strong>Primeira impressao importa</strong>
            <span>
              O cadastro precisa transmitir que a plataforma ja sabe para onde levar voce: contratar,
              atender, crescer e gerar confianca.
            </span>
          </div>

          <div className="brand-highlights">
            <div className="highlight-item">
              <span className="highlight-title">Cliente</span>
              <span className="highlight-text">
                Encontre o profissional certo, acompanhe o servico e resolva tudo em um so painel.
              </span>
            </div>

            <div className="highlight-item">
              <span className="highlight-title">Profissional</span>
              <span className="highlight-text">
                Receba demandas qualificadas, gerencie creditos e cresca com visibilidade premium.
              </span>
            </div>

            <div className="highlight-item">
              <span className="highlight-title">Operacao estruturada</span>
              <span className="highlight-text">
                Fluxo claro, notificacoes, historico e trilha de atendimento pensados para escala.
              </span>
            </div>
          </div>

          <div className="auth-signal-list">
            {onboardingSignals.map((signal) => (
              <div className="auth-signal-item" key={signal.title}>
                <strong>{signal.title}</strong>
                <span>{signal.text}</span>
              </div>
            ))}
          </div>

          <div className="auth-metric-row">
            <div className="auth-metric-card">
              <strong>entrada unica</strong>
              <span>cadastro simples para iniciar a jornada certa dentro da plataforma</span>
            </div>
            <div className="auth-metric-card">
              <strong>perfil vivo</strong>
              <span>foto, reputacao e historico ajudam a reforcar confianca depois do acesso</span>
            </div>
            <div className="auth-metric-card">
              <strong>escala futura</strong>
              <span>estrutura preparada para produto academico e evolucao comercial</span>
            </div>
          </div>
        </section>

        <section className="login-form-panel">
          <div className="login-form-header">
            <h2>Criar conta</h2>
            <p>Preencha seus dados para entrar no ecossistema TECNIFLOW.</p>
          </div>

          <div className="auth-panel-intro">
            <strong>Cadastro simples, jornada forte</strong>
            <span>
              Escolha seu perfil de acesso e comece agora. O restante da experiencia continua dentro do
              painel.
            </span>
          </div>

          <div className="auth-process-strip">
            <div className="auth-process-card">
              <strong>Entrada imediata</strong>
              <span>O cadastro ja posiciona voce no fluxo certo como cliente ou profissional.</span>
            </div>
            <div className="auth-process-card">
              <strong>Perfil evolutivo</strong>
              <span>Voce pode entrar rapido agora e enriquecer foto, reputacao e detalhes depois.</span>
            </div>
            <div className="auth-process-card">
              <strong>Base pronta para operacao</strong>
              <span>Solicitacoes, leads, notificacoes e acompanhamento ja ficam disponiveis apos o acesso.</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="auth-grid-two">
              <div className="form-group">
                <label htmlFor="nome">Nome completo</label>
                <input
                  id="nome"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  placeholder="Digite seu nome"
                />
              </div>

              <div className="form-group">
                <label htmlFor="telefone">Telefone</label>
                <input
                  id="telefone"
                  name="telefone"
                  value={form.telefone}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="voce@exemplo.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="foto_url">Foto de perfil opcional</label>
              <input
                id="foto_url"
                type="url"
                name="foto_url"
                value={form.foto_url}
                onChange={handleChange}
                placeholder="https://exemplo.com/minha-foto.jpg"
              />
            </div>

            {form.foto_url && (
              <div className="auth-photo-preview">
                <img src={form.foto_url} alt="Preview da foto de perfil" />
                <div>
                  <strong>Preview do perfil</strong>
                  <p>Opcional agora, mas ajuda a gerar mais confianca no marketplace.</p>
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="tipo_usuario">Perfil de acesso</label>
              <select
                id="tipo_usuario"
                name="tipo_usuario"
                value={form.tipo_usuario}
                onChange={handleChange}
              >
                <option value="cliente">Cliente</option>
                <option value="profissional">Profissional</option>
              </select>
            </div>

            <div className="auth-grid-two">
              <div className="form-group">
                <label htmlFor="senha">Senha</label>
                <input
                  id="senha"
                  type="password"
                  name="senha"
                  value={form.senha}
                  onChange={handleChange}
                  placeholder="Minimo de 6 caracteres"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmarSenha">Confirmar senha</label>
                <input
                  id="confirmarSenha"
                  type="password"
                  name="confirmarSenha"
                  value={form.confirmarSenha}
                  onChange={handleChange}
                  placeholder="Repita sua senha"
                />
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <div className="register-helper">
            <strong>Importante</strong>
            <p>
              A foto e opcional agora. Se voce preferir, pode concluir o cadastro e ajustar isso depois no perfil.
            </p>
          </div>

          <div className="login-footer auth-link-row">
            <Link to="/" className="login-secondary-link">
              Ver apresentacao
            </Link>
            <span>Ja possui uma conta?</span>
            <Link to="/login">Entrar</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
