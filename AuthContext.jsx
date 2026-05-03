import { useEffect, useState } from 'react';
import { loginRequest } from '../services/authService';
import { AuthContext } from './authContextInstance';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch (error) {
      console.error('Erro ao recuperar sessão:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
      setToken('');
    } finally {
      setLoading(false);
    }
  }, []);

  async function login(email, senha) {
    const data = await loginRequest(email, senha);

    setUser(data.usuario);
    setToken(data.token);

    localStorage.setItem('user', JSON.stringify(data.usuario));
    localStorage.setItem('token', data.token);

    return data;
  }

  function logout() {
    setUser(null);
    setToken('');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  function updateUser(updatedUser) {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }

  const isAuthenticated = !!token;
  const userType = user?.tipo_usuario || user?.tipo || user?.role || null;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        updateUser,
        isAuthenticated,
        userType,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
