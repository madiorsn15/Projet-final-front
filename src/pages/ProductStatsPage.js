import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { API_BASE_URL } from '../utils/api';
import toast from 'react-hot-toast';
import './ProductStatsPage.css';

const ProductStatsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    viewsCount: 0,
    clicksCount: 0,
    ordersCount: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour voir les statistiques');
      navigate('/login');
      return;
    }

    loadProductStats();
  }, [id, isAuthenticated, navigate]);

  const loadProductStats = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${id}`);
      const productData = response.data;

      // Vérifier si l'utilisateur est le propriétaire
      if (productData.seller._id !== user._id) {
        toast.error('Vous n\'êtes pas autorisé à voir les statistiques de ce produit');
        navigate(`/product/${id}`);
        return;
      }

      setProduct(productData);
      setStats({
        viewsCount: productData.viewsCount || 0,
        clicksCount: productData.clicksCount || 0,
        ordersCount: productData.ordersCount || 0,
      });
    } catch (error) {
      console.error('Erreur chargement statistiques:', error);
      toast.error('Produit non trouvé ou erreur de chargement');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(price);
  };

  const calculateConversionRate = () => {
    if (stats.viewsCount === 0) return 0;
    return ((stats.ordersCount / stats.viewsCount) * 100).toFixed(2);
  };

  const calculateClickRate = () => {
    if (stats.viewsCount === 0) return 0;
    return ((stats.clicksCount / stats.viewsCount) * 100).toFixed(2);
  };

  const calculateEstimatedRevenue = () => {
    return (product?.price || 0) * stats.ordersCount;
  };

  const handleDeleteProduct = async () => {
    try {
      await api.delete(`/products/${id}`);
      toast.success('Produit supprimé avec succès');
      navigate('/products');
    } catch (error) {
      toast.error('Erreur lors de la suppression du produit');
    }
  };

  if (loading) {
    return (
      <div className="product-stats-page">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Chargement des statistiques...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-stats-page">
        <div className="container">
          <div className="not-found">
            <h2>Produit non trouvé</h2>
            <p>Ce produit n'existe pas ou a été supprimé.</p>
            <button onClick={() => navigate('/products')} className="btn btn-primary">
              Retour aux produits
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-stats-page">
      <div className="container">
        <div className="stats-header">
          <button onClick={() => navigate(`/product/${id}`)} className="back-btn">
            ← Retour au produit
          </button>
          <h1>📊 Statistiques du produit</h1>
        </div>

        <div className="product-summary">
          <div className="product-card">
            <div className="product-image-container">
              {product.image ? (
                <img
                  src={`${API_BASE_URL}${product.image}`}
                  alt={product.name}
                  className="product-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x200/e5e7eb/6b7280?text=Produit';
                  }}
                />
              ) : (
                <div className="no-image-placeholder">
                  <span className="placeholder-icon">Photo non disponible</span>
                </div>
              )}
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="price">{formatPrice(product.price)}</p>
              <p className="category">{product.category}</p>
              <p className="availability">
                {product.isAvailable ? '✅ Disponible' : '❌ Indisponible'}
              </p>
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">👁️</div>
            <div className="stat-content">
              <h3>{stats.viewsCount.toLocaleString()}</h3>
              <p>Vues totales</p>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon">📱</div>
            <div className="stat-content">
              <h3>{stats.clicksCount.toLocaleString()}</h3>
              <p>Clics WhatsApp</p>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-icon">🛒</div>
            <div className="stat-content">
              <h3>{stats.ordersCount.toLocaleString()}</h3>
              <p>Commandes</p>
            </div>
          </div>

          <div className="stat-card info">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>{formatPrice(calculateEstimatedRevenue())}</h3>
              <p>Revenu estimé</p>
            </div>
          </div>
        </div>

        <div className="performance-metrics">
          <h2>📈 Indicateurs de performance</h2>
          <div className="metrics-grid">
            <div className="metric-card">
              <h3>Taux de conversion</h3>
              <div className="metric-value">
                {calculateConversionRate()}%
              </div>
              <p>Pourcentage des vues qui deviennent des commandes</p>
            </div>

            <div className="metric-card">
              <h3>Taux de clics</h3>
              <div className="metric-value">
                {calculateClickRate()}%
              </div>
              <p>Pourcentage des vues qui génèrent des clics WhatsApp</p>
            </div>

            <div className="metric-card">
              <h3>Panier moyen</h3>
              <div className="metric-value">
                {formatPrice(product.price)}
              </div>
              <p>Valeur moyenne par commande</p>
            </div>
          </div>
        </div>

        <div className="actions-section">
          <h2>🔧 Actions rapides</h2>
          <div className="actions-grid">
            <button
              onClick={() => navigate(`/edit-product/${id}`)}
              className="action-btn edit"
            >
              ✏️ Modifier le produit
            </button>

            <button
              onClick={() => navigate(`/product/${id}`)}
              className="action-btn view"
            >
              👁️ Voir la page du produit
            </button>

            <button
              onClick={() => navigate(`/order/${id}`)}
              className="action-btn order"
              disabled={!product.isAvailable}
            >
              🛒 Tester la commande
            </button>

            <button
              onClick={() => {
                if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
                  handleDeleteProduct();
                }
              }}
              className="action-btn delete"
            >
              🗑️ Supprimer le produit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductStatsPage;
