import React from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../utils/api';
import './FavoritesPage.css';

const FavoritesPage = () => {
  const { favorites, loading, removeFromFavorites } = useFavorites();
  const { isAuthenticated } = useAuth();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleRemoveFavorite = async (productId) => {
    try {
      await removeFromFavorites(productId);
    } catch (error) {
      console.error('Erreur suppression favori:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="favorites-page">
        <div className="container">
          <div className="auth-required">
            <h2>Connexion requise</h2>
            <p>Veuillez vous connecter pour voir vos favoris.</p>
            <Link to="/login" className="btn btn-primary">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="container">
        <div className="favorites-header">
          <h1>Mes Favoris</h1>
          <p>Vos produits préférés en un coup d'œil</p>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Chargement de vos favoris...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="empty-favorites">
            <div className="empty-icon">❤️</div>
            <h2>Aucun favori</h2>
            <p>Vous n'avez pas encore ajouté de produits à vos favoris.</p>
            <Link to="/products" className="btn btn-primary">
              Découvrir des produits
            </Link>
          </div>
        ) : (
          <div className="favorites-grid">
            {favorites.map((product) => (
              <div key={product._id} className="favorite-card">
                <div className="favorite-image">
                  {product.image ? (
                    <img
                      src={`${API_BASE_URL}${product.image}`}
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = '/placeholder-product.png';
                      }}
                    />
                  ) : (
                    <div className="no-image">
                      <span>📦</span>
                    </div>
                  )}
                </div>

                <div className="favorite-info">
                  <h3>
                    <Link to={`/product/${product._id}`}>
                      {product.name}
                    </Link>
                  </h3>

                  <p className="price">{formatPrice(product.price)}</p>

                  <p className="category">{product.category}</p>

                  <p className="seller">Par: {product.seller?.name || 'Vendeur'}</p>
                </div>

                <div className="favorite-actions">
                  <Link
                    to={`/product/${product._id}`}
                    className="view-btn"
                  >
                    Voir détails
                  </Link>
                  <button
                    onClick={() => handleRemoveFavorite(product._id)}
                    className="remove-btn"
                  >
                    Retirer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;