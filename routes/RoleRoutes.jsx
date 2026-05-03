import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';

export default function RoleRoute({ children, allowedRole }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user?.tipo_usuario || user?.tipo || user?.role;

  if (userRole !== allowedRole) {
    if (userRole === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (userRole === 'cliente') {
      return <Navigate to="/cliente/dashboard" replace />;
    }

    if (userRole === 'profissional') {
      return <Navigate to="/profissional/dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
}
