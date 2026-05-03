import { ArrowLeft, Compass, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  const navigate = useNavigate();

  function handleBack() {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate('/');
  }

  return (
    <section className="not-found-page">
      <div className="not-found-card">
        <span className="not-found-eyebrow">TECNIFLOW</span>
        <div className="not-found-code">404</div>
        <h1>Essa rota saiu do mapa da plataforma.</h1>
        <p>
          A página que você tentou acessar não existe mais, mudou de endereço ou não está disponível
          para o seu perfil atual.
        </p>

        <div className="not-found-signal-strip">
          <div className="not-found-signal-card">
            <strong>Rota protegida</strong>
            <span>algumas areas dependem do perfil certo dentro da plataforma</span>
          </div>
          <div className="not-found-signal-card">
            <strong>Fallback seguro</strong>
            <span>voce sempre pode voltar para a apresentacao ou entrar novamente</span>
          </div>
          <div className="not-found-signal-card">
            <strong>Navegacao guiada</strong>
            <span>cliente, profissional e admin seguem jornadas separadas</span>
          </div>
        </div>

        <div className="not-found-actions">
          <Link to="/" className="not-found-primary-link">
            <Home size={18} />
            Ir para a apresentação
          </Link>
          <Link to="/login" className="not-found-secondary-link">
            <Compass size={18} />
            Entrar na plataforma
          </Link>
        </div>

        <button type="button" className="not-found-back-button" onClick={handleBack}>
          <ArrowLeft size={16} />
          Voltar para a tela anterior
        </button>
      </div>
    </section>
  );
}
