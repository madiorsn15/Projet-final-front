import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import api, { API_BASE_URL } from '../utils/api';
import toast from 'react-hot-toast';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contactLoading, setContactLoading] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);

  const isOwner = isAuthenticated && product && user?._id === product.seller?._id;

  useEffect(() => {
    loadProduct();
  }, [id]);

  useEffect(() => {
    if (product) loadRelatedProducts();
  }, [product]);

  const loadRelatedProducts = async () => {
    if (!product?.category) return;
    try {
      setRelatedLoading(true);
      const category = encodeURIComponent(product.category);
      const response = await api.get(`/products?category=${category}&limit=6&exclude=${product._id}`);
      setRelatedProducts(response.data.products || []);
    } catch (error) {
      console.error('Erreur chargement produits similaires:', error);
    } finally {
      setRelatedLoading(false);
    }
  };

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${id}`);
      // Normalise: certaines APIs wrappent dans { product: {...} }
      const data = response.data?.product || response.data;
      setProduct(data);
    } catch (error) {
      console.error('Erreur chargement produit:', error);
      toast.error('Produit non trouvé');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour ajouter aux favoris');
      navigate('/login');
      return;
    }
    try {
      if (isFavorite(product._id)) {
        await removeFromFavorites(product._id);
        toast.success('Retiré des favoris');
      } else {
        await addToFavorites(product._id);
        toast.success('Ajouté aux favoris');
      }
    } catch {
      toast.error('Erreur lors de la mise à jour des favoris');
    }
  };

  const handleContactSeller = async () => {
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour contacter le vendeur');
      navigate('/login');
      return;
    }
    setContactLoading(true);
    try {
      await api.post(`/products/${product._id}/clicks`);
      if (product.seller?.whatsapp) {
        const message = `Bonjour, je suis intéressé par votre produit "${product.name}" sur SunuMarché.`;
        const whatsappUrl = `https://wa.me/${product.seller.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
      } else {
        toast.error('Numéro WhatsApp non disponible pour ce vendeur');
      }
    } catch {
      toast.error('Erreur lors de la tentative de contact');
    } finally {
      setContactLoading(false);
    }
  };

  const handleOrder = () => {
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour passer une commande');
      navigate('/login');
      return;
    }
    if (!product.isAvailable) {
      toast.error('Ce produit n\'est pas disponible');
      return;
    }
    navigate(`/order/${product._id}`);
  };

  const handleDeleteProduct = async () => {
    try {
      await api.delete(`/products/${product._id}`);
      toast.success('Produit supprimé avec succès');
      navigate('/products');
    } catch {
      toast.error('Erreur lors de la suppression du produit');
    }
  };

  const formatPrice = (price) => {
    // Garde contre NaN / undefined
    const parsed = parseFloat(price);
    if (isNaN(parsed)) return '– F CFA';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(parsed);
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Chargement du produit...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page">
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
    <div className="product-detail-page">
      <div className="container">
        <div className="product-detail">

          {/* ── Galerie ── */}
          <div className="product-gallery">
            <div className="main-image">
              {product.image ? (
                <img
                  src={`${API_BASE_URL}${product.image}`}
                  alt={product.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    const placeholder = document.createElement('div');
                    placeholder.className = 'no-image-large';
                    placeholder.innerHTML = '<span>📦</span><p>Image non disponible</p>';
                    e.target.parentElement.appendChild(placeholder);
                  }}
                />
              ) : (
                <div className="no-image-large">
                  <span>📦</span>
                  <p>Image non disponible</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Infos produit ── */}
          <div className="product-info">
            <div className="product-header">
              <h1>{product.name}</h1>
              <span className={`availability ${product.isAvailable ? 'available' : 'unavailable'}`}>
                {product.isAvailable ? '✅ Disponible' : '❌ Indisponible'}
              </span>
            </div>

            <div className="product-price">
              {formatPrice(product.price)}
            </div>

            <div className="product-meta">
              <span className="category">{product.category}</span>
              <span className="views">👁️ {product.viewsCount || product.views || 0} vues</span>
              {isOwner && (
                <>
                  <span className="clicks">📱 {product.clicksCount || 0} clics WhatsApp</span>
                  <span className="orders">🛒 {product.ordersCount || 0} commandes</span>
                </>
              )}
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            <div className="seller-info">
              <h3>Vendeur</h3>
              <div className="seller-card">
                <div className="seller-avatar">
                  <span>{product.seller?.name?.charAt(0)?.toUpperCase() || 'V'}</span>
                </div>
                <div className="seller-details">
                  <h4>{product.seller?.name || 'Vendeur anonyme'}</h4>
                  <p>{product.seller?.email || ''}</p>
                  {product.seller?.whatsapp && (
                    <p className="whatsapp">📱 WhatsApp disponible</p>
                  )}
                </div>
              </div>
            </div>

            {/* ── Actions ── */}
            <div className="product-actions">

              {/* Acheteur */}
              {!isOwner && (
                <>
                  {isAuthenticated && (
                    <button
                      onClick={handleFavoriteToggle}
                      className={`favorite-btn ${isFavorite(product._id) ? 'favorited' : ''}`}
                    >
                      {isFavorite(product._id) ? '❤️ Retirer des favoris' : '🤍 Ajouter aux favoris'}
                    </button>
                  )}

                  <button
                    onClick={handleOrder}
                    className="order-btn"
                    disabled={!product.isAvailable}
                  >
                    {product.isAvailable ? '🛒 Commander' : '❌ Indisponible'}
                  </button>

                  <button
                    onClick={handleContactSeller}
                    className="contact-btn"
                    disabled={contactLoading || !product.isAvailable}
                  >
                    {contactLoading ? 'Connexion...' : 'Contacter via WhatsApp'}
                  </button>
                </>
              )}

              {/* Propriétaire */}
              {isOwner && (
                <>
                  <button
                    onClick={() => navigate(`/edit-product/${product._id}`)}
                    className="edit-btn"
                  >
                    ✏️ Modifier le produit
                  </button>

                  <button
                    onClick={() => navigate(`/product-stats/${product._id}`)}
                    className="stats-btn"
                  >
                    📊 Voir les statistiques
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
                        handleDeleteProduct();
                      }
                    }}
                    className="delete-btn"
                  >
                    🗑️ Supprimer
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Produits similaires ── */}
        <div className="related-section">
          <h2>Autres produits qui pourraient vous intéresser</h2>
          {relatedLoading ? (
            <div className="related-loading">
              <div className="spinner-small"></div>
              <p>Chargement des produits similaires...</p>
            </div>
          ) : relatedProducts.length > 0 ? (
            <div className="related-products-grid">
              {relatedProducts.map((rel) => (
                <div key={rel._id} className="related-product-card">
                  <div className="related-product-image">
                    {rel.image ? (
                      <img
                        src={`${API_BASE_URL}${rel.image}`}
                        alt={rel.name}
                        onClick={() => navigate(`/product/${rel._id}`)}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder-product.svg';
                        }}
                      />
                    ) : (
                      <div className="no-image-small" onClick={() => navigate(`/product/${rel._id}`)}>
                        <span>📦</span>
                      </div>
                    )}
                  </div>
                  <div className="related-product-info">
                    <h4 onClick={() => navigate(`/product/${rel._id}`)}>{rel.name}</h4>
                    <p className="related-product-price">{formatPrice(rel.price)}</p>
                    <p className="related-product-category">{rel.category}</p>
                    <span className={`related-availability ${rel.isAvailable ? 'available' : 'unavailable'}`}>
                      {rel.isAvailable ? 'Disponible' : 'Indisponible'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-related-products">
              <p>Aucun produit similaire trouvé pour le moment.</p>
              <button onClick={() => navigate('/products')} className="btn btn-secondary">
                Voir tous les produits
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;