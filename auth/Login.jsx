import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';
import './Login.css';

const accessSignals = [
  {
    title: 'Entrada por perfil',
    text: 'Cliente, profissional e admin entram em jornadas pensadas para operacao e decisao.',
  },
  {
    title: 'Fluxo acompanhado',
    text: 'Solicitacoes, leads, status e notificacoes seguem no mesmo ecossistema de atendimento.',
  },
  {
    title: 'Base com cara de produto',
    text: 'Reputacao, premium, incidentes e governanca ajudam o TECNIFLOW a parecer plataforma real.',
  },
];

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, token } = useAuth();

  const [form, setForm] = useState({
    email: '',
    senha: '',
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const rawUserRole = user?.tipo_usuario || user?.tipo || user?.role;
    const userRole = String(rawUserRole || '').toLowerCase().trim();

    if (token && userRole === 'admin') {
      navigate('/admin/dashboard', { replace: true });
      return;
    }

    if (token && userRole === 'cliente') {
      navigate('/cliente/dashboard', { replace: true });
      return;
    }

    if (token && userRole === 'profissional') {
      navigate('/profissional/dashboard', { replace: true });
    }
  }, [token, user, navigate]);

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError('');
    if (successMessage) setSuccessMessage('');
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.email || !form.senha) {
      setError('Preencha e-mail e senha para continuar.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const data = await login(form.email, form.senha);

      const rawUserRole =
        data?.usuario?.tipo_usuario ||
        data?.usuario?.tipo ||
        data?.usuario?.role ||
        data?.tipo_usuario ||
        data?.tipo ||
        data?.role;
      const userRole = String(rawUserRole || '').toLowerCase().trim();

      if (userRole === 'cliente') {
        navigate('/cliente/dashboard', { replace: true });
        return;
      }

      if (userRole === 'profissional') {
        navigate('/profissional/dashboard', { replace: true });
        return;
      }

      if (userRole === 'admin') {
        navigate('/admin/dashboard', { replace: true });
        return;
      }

      setError(`Tipo de usuário não reconhecido: ${rawUserRole || 'não informado'}`);
    } catch (err) {
      setError(err?.message || 'Não foi possível entrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <section className="login-brand-panel">
          <div className="brand-badge">PLATAFORMA TECNIFLOW</div>

          <h1>Entre na operacao do marketplace tecnico com mais confianca, contexto e controle.</h1>

          <p>
            Acesse sua área para acompanhar solicitações, oportunidades, status de atendimento,
            notificações e resultados da sua jornada dentro da plataforma.
          </p>

          <div className="auth-hero-note">
            <strong>Uma entrada pensada para produto real</strong>
            <span>
              O TECNIFLOW conecta descoberta, atendimento, reputacao e governanca em uma experiencia
              unica de marketplace tecnico.
            </span>
          </div>

          <div className="brand-highlights">
            <div className="highlight-item">
              <span className="highlight-title">Pedidos e leads em fluxo</span>
              <span className="highlight-text">
                Cliente, profissional e admin operando com uma mesma espinha de acompanhamento.
              </span>
            </div>

            <div className="highlight-item">
              <span className="highlight-title">Experiência por perfil</span>
              <span className="highlight-text">
                Cada tipo de usuário entra em um painel pensado para sua decisão e sua rotina.
              </span>
            </div>

            <div className="highlight-item">
              <span className="highlight-title">Governança e confiança</span>
              <span className="highlight-text">
                Notificações, reputação, incidentes e visibilidade premium sustentando a operação.
              </span>
            </div>
          </div>

          <div className="auth-signal-list">
            {accessSignals.map((signal) => (
              <div className="auth-signal-item" key={signal.title}>
                <strong>{signal.title}</strong>
                <span>{signal.text}</span>
              </div>
            ))}
          </div>

          <div className="auth-metric-row">
            <div className="auth-metric-card">
              <strong>ate 4</strong>
              <span>profissionais elegiveis por solicitacao</span>
            </div>
            <div className="auth-metric-card">
              <strong>3 frentes</strong>
              <span>cliente, profissional e admin no mesmo ecossistema</span>
            </div>
            <div className="auth-metric-card">
              <strong>1 operacao</strong>
              <span>matching, reputacao, lead e governanca integrados</span>
            </div>
          </div>
        </section>

        <section className="login-form-panel">
          <div className="login-form-header">
            <h2>Entrar</h2>
            <p>Informe seus dados para acessar sua conta TECNIFLOW.</p>
          </div>

          <div className="auth-panel-intro">
            <strong>Acesso rapido e orientado</strong>
            <span>
              Entre para continuar sua jornada, acompanhar servicos, responder oportunidades ou operar
              a plataforma.
            </span>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Digite seu e-mail"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="senha">Senha</label>
              <input
                id="senha"
                type="password"
                name="senha"
                placeholder="Digite sua senha"
                value={form.senha}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Entrando...' : 'Acessar plataforma'}
            </button>
          </form>

          {successMessage && <div className="success-message">{successMessage}</div>}

          <div className="auth-support-link">
            <Link to="/esqueci-minha-senha">Esqueci minha senha</Link>
          </div>

          <div className="login-footer">
            <span>Ainda não possui cadastro?</span>
            <Link to="/cadastro">Criar conta</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
