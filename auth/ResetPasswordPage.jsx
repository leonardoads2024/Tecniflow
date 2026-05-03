import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { confirmPasswordResetRequest } from '../../services/authService';
import './Login.css';

function useResetToken() {
  const location = useLocation();

  return useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('token') || '';
  }, [location.search]);
}

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const token = useResetToken();
  const [form, setForm] = useState({
    novaSenha: '',
    confirmarNovaSenha: '',
  });
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

    if (!token) {
      setError('Link inválido. Solicite uma nova redefinição de senha.');
      return;
    }

    if (!form.novaSenha || !form.confirmarNovaSenha) {
      setError('Preencha a nova senha e a confirmação.');
      return;
    }

    if (form.novaSenha.length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (form.novaSenha !== form.confirmarNovaSenha) {
      setError('A confirmação da nova senha não confere.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await confirmPasswordResetRequest({
        token,
        nova_senha: form.novaSenha,
      });

      setSuccess('Senha redefinida com sucesso. Você já pode entrar na plataforma.');

      setTimeout(() => {
        navigate('/login', {
          state: { message: 'Senha atualizada com sucesso. Faça login com a nova senha.' },
        });
      }, 1200);
    } catch (err) {
      setError(err?.message || 'Não foi possível redefinir a senha.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <section className="login-brand-panel">
          <div className="brand-badge">NOVA SENHA</div>

          <h1>Crie uma nova senha e retome o acesso com segurança.</h1>

          <p>
            Este link é temporário e foi gerado exclusivamente para a recuperação da sua conta.
          </p>

          <div className="brand-highlights">
            <div className="highlight-item">
              <span className="highlight-title">Token validado</span>
              <span className="highlight-text">
                A atualização da senha só acontece se o link recebido ainda estiver válido.
              </span>
            </div>

            <div className="highlight-item">
              <span className="highlight-title">Uso único</span>
              <span className="highlight-text">
                Depois da redefinição, o token é invalidado automaticamente no backend.
              </span>
            </div>
          </div>
        </section>

        <section className="login-form-panel">
          <div className="login-form-header">
            <h2>Redefinir senha</h2>
            <p>Informe a nova senha que você quer usar no TECNIFLOW.</p>
          </div>

          <div className="auth-process-strip">
            <div className="auth-process-card">
              <strong>Link protegido</strong>
              <span>Esta etapa depende do token recebido no e-mail e da validacao de tempo do link.</span>
            </div>
            <div className="auth-process-card">
              <strong>Nova credencial</strong>
              <span>Defina uma senha mais forte para retomar o acesso com menos atrito depois.</span>
            </div>
            <div className="auth-process-card">
              <strong>Entrada liberada</strong>
              <span>Ao salvar, voce ja pode voltar para o login e entrar com a senha atualizada.</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="auth-grid-two">
              <div className="form-group">
                <label htmlFor="nova-senha">Nova senha</label>
                <input
                  id="nova-senha"
                  type="password"
                  name="novaSenha"
                  value={form.novaSenha}
                  onChange={handleChange}
                  placeholder="Mínimo de 6 caracteres"
                  autoComplete="new-password"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmar-nova-senha">Confirmar nova senha</label>
                <input
                  id="confirmar-nova-senha"
                  type="password"
                  name="confirmarNovaSenha"
                  value={form.confirmarNovaSenha}
                  onChange={handleChange}
                  placeholder="Repita a nova senha"
                  autoComplete="new-password"
                />
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <button type="submit" className="login-button" disabled={loading || !token}>
              {loading ? 'Salvando...' : 'Salvar nova senha'}
            </button>
          </form>

          {!token && (
            <div className="register-helper">
              <strong>Link ausente</strong>
              <p>
                Abra esta tela a partir do link enviado para o e-mail da conta ou solicite uma nova
                recuperação.
              </p>
            </div>
          )}

          <div className="login-footer auth-link-row">
            <Link to="/esqueci-minha-senha" className="login-secondary-link">
              Solicitar novo link
            </Link>
            <span>Já lembrou sua senha?</span>
            <Link to="/login">Entrar</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
