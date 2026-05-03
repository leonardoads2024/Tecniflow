import { useState } from 'react';
import { Link } from 'react-router-dom';
import { requestPasswordResetRequest } from '../../services/authService';
import './Login.css';

const initialForm = {
  email: '',
};

export default function ForgotPasswordPage() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));

    if (error) setError('');
    if (success) setSuccess('');
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.email) {
      setError('Informe o e-mail da conta para continuar.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await requestPasswordResetRequest({
        email: form.email.trim().toLowerCase(),
      });

      setSuccess(
        'Se existir uma conta com esse e-mail, enviamos um link para redefinir sua senha.'
      );
      setForm(initialForm);
    } catch (err) {
      setError(err?.message || 'Não foi possível iniciar a recuperação de senha.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <section className="login-brand-panel">
          <div className="brand-badge">RECUPERAR ACESSO</div>

          <h1>Redefina sua senha com uma etapa de confirmação por link.</h1>

          <p>
            Agora o TECNIFLOW só libera a troca de senha depois de validar um token enviado para
            o e-mail da conta, reduzindo o risco de redefinição indevida.
          </p>

          <div className="brand-highlights">
            <div className="highlight-item">
              <span className="highlight-title">Link temporário</span>
              <span className="highlight-text">
                O acesso de recuperação expira automaticamente para manter o fluxo mais seguro.
              </span>
            </div>

            <div className="highlight-item">
              <span className="highlight-title">Confirmação por e-mail</span>
              <span className="highlight-text">
                A nova senha só pode ser criada a partir do link enviado para o titular da conta.
              </span>
            </div>

            <div className="highlight-item">
              <span className="highlight-title">Fallback de desenvolvimento</span>
              <span className="highlight-text">
                Enquanto o SMTP não estiver configurado, o link aparece no console do backend.
              </span>
            </div>
          </div>

          <div className="auth-metric-row">
            <div className="auth-metric-card">
              <strong>token unico</strong>
              <span>cada recuperacao gera um novo link e invalida o anterior</span>
            </div>
            <div className="auth-metric-card">
              <strong>tempo limitado</strong>
              <span>o link expira automaticamente para reduzir uso indevido</span>
            </div>
            <div className="auth-metric-card">
              <strong>fluxo seguro</strong>
              <span>o usuario so redefine a senha depois da validacao do link</span>
            </div>
          </div>
        </section>

        <section className="login-form-panel">
          <div className="login-form-header">
            <h2>Esqueci minha senha</h2>
            <p>Informe seu e-mail para receber o link de redefinição.</p>
          </div>

          <div className="auth-process-strip">
            <div className="auth-process-card">
              <strong>1. Solicitar acesso</strong>
              <span>Voce informa o e-mail cadastrado para iniciar a recuperacao com seguranca.</span>
            </div>
            <div className="auth-process-card">
              <strong>2. Validar o link</strong>
              <span>O TECNIFLOW gera um token temporario e envia o acesso para a etapa seguinte.</span>
            </div>
            <div className="auth-process-card">
              <strong>3. Criar nova senha</strong>
              <span>A senha so e alterada depois da confirmacao do link enviado para a conta.</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="reset-email">E-mail</label>
              <input
                id="reset-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="voce@exemplo.com"
                autoComplete="email"
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar link de redefinição'}
            </button>
          </form>

          <div className="register-helper">
            <strong>Como testar agora</strong>
            <p>
              Se o ambiente ainda não estiver enviando e-mail real, abra o terminal do backend e
              copie o link de recuperação exibido no log.
            </p>
          </div>

          <div className="login-footer auth-link-row">
            <Link to="/login" className="login-secondary-link">
              Voltar para login
            </Link>
            <span>Ainda não possui conta?</span>
            <Link to="/cadastro">Criar conta</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
