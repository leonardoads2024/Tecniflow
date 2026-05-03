import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';

const loadingContainerStyle = {
  minHeight: '100vh',
  display: 'grid',
  placeItems: 'center',
  padding: '24px',
  background:
    'radial-gradient(circle at top left, rgba(24, 179, 91, 0.16), transparent 24%), radial-gradient(circle at bottom right, rgba(18, 181, 201, 0.14), transparent 24%), linear-gradient(135deg, #06111b 0%, #0b1824 42%, #102334 100%)',
};

const loadingBoxStyle = {
  width: 'min(420px, 100%)',
  padding: '28px',
  borderRadius: '26px',
  border: '1px solid rgba(143, 166, 186, 0.14)',
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(12px)',
  boxShadow: '0 24px 60px rgba(0, 0, 0, 0.24)',
  textAlign: 'center',
  color: '#f8fafc',
};

const spinnerStyle = {
  width: '48px',
  height: '48px',
  borderRadius: '999px',
  margin: '0 auto 16px',
  border: '4px solid rgba(143, 166, 186, 0.18)',
  borderTopColor: '#18b35b',
  animation: 'routeSpin 1s linear infinite',
};

export default function PrivateRoute({ children }) {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <>
        <style>{'@keyframes routeSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }'}</style>
        <div style={loadingContainerStyle}>
          <div style={loadingBoxStyle}>
            <div style={spinnerStyle}></div>
            <p>Carregando sua sessão...</p>
          </div>
        </div>
      </>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
