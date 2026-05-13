import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/me')
        .then((response) => {
          setUser(response.data.user);
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;

      localStorage.setItem('token', token);
      setUser(userData);
      setError(null);
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Erreur de connexion';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      toast.loading('Connexion avec Google en cours...', { id: 'google-login' });

      // Simuler une connexion Google pour l'instant (en attendant les vraies credentials)
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success('Connexion avec Google bientôt disponible !', { id: 'google-login' });
      toast('Pour l\'instant, utilisez la connexion par email/mot de passe.', { id: 'google-info' });
      
      return { success: false, error: 'Connexion Google en cours de développement' };
    } catch (error) {
      const errorMsg = 'Erreur lors de la connexion avec Google';
      toast.error(errorMsg, { id: 'google-login' });
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user: newUser } = response.data;

      localStorage.setItem('token', token);
      setUser(newUser);
      setError(null);
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Erreur d\'inscription';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la déconnexion distante',
      };
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const updateProfile = async (userData) => {
    try {
      const payload = {
        name: userData.name,
        whatsapp: userData.whatsapp,
      };

      const response = await api.put('/users/profile', payload);
      setUser(response.data.user);
      setError(null);
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Erreur de mise à jour';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    loading,
    error,
    login,
    loginWithGoogle,
    register,
    logout,
    updateProfile,
    clearError,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
