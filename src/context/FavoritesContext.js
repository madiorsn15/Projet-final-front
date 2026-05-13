import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../utils/api';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [isAuthenticated]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/favorites');
      setFavorites(response.data.favorites || []);
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (productId) => {
    try {
      await api.post(`/users/favorites/${productId}`);
      await loadFavorites(); // Recharger la liste
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erreur' };
    }
  };

  const removeFromFavorites = async (productId) => {
    try {
      await api.delete(`/users/favorites/${productId}`);
      await loadFavorites(); // Recharger la liste
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erreur' };
    }
  };

  const isFavorite = (productId) => {
    return favorites.some(fav => fav._id === productId);
  };

  const value = {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    loadFavorites
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};