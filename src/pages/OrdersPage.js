import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { API_BASE_URL } from '../utils/api';
import './OrdersPage.css';

const STATUS_LABELS = {
  en_attente: 'En attente',
  'confirmée': 'Confirmée',
  en_livraison: 'En livraison',
  'livrée': 'Livrée',
  'annulée': 'Annulée',
};

const ROLE_CONTENT = {
  client: {
    title: 'Mes commandes',
    description: 'Retrouvez vos achats et suivez leur statut.',
    endpoint: '/orders/me',
    emptyTitle: 'Aucune commande',
    emptyDescription: "Vous n'avez pas encore passé de commande.",
    ctaLabel: 'Découvrir les produits',
    ctaLink: '/products',
  },
  vendeur: {
    title: 'Commandes reçues',
    description: 'Consultez les commandes passées sur vos produits.',
    endpoint: '/orders/seller',
    emptyTitle: 'Aucune commande reçue',
    emptyDescription: 'Les commandes de vos produits apparaîtront ici.',
    ctaLabel: 'Gérer mes produits',
    ctaLink: '/products/my-products',
  },
  admin: {
    title: 'Toutes les commandes',
    description: 'Vue globale des commandes de la plateforme.',
    endpoint: '/orders',
    emptyTitle: 'Aucune commande enregistrée',
    emptyDescription: 'Les commandes de la plateforme apparaîtront ici.',
    ctaLabel: "Ouvrir l'admin",
    ctaLink: '/admin',
  },
};

const OrdersPage = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !user?.role) {
      setLoading(false);
      return;
    }

    const loadOrders = async () => {
      const config = ROLE_CONTENT[user.role] || ROLE_CONTENT.client;
      try {
        setLoading(true);
        setError('');
        const response = await api.get(config.endpoint);
        setOrders(response.data.orders || []);
      } catch (err) {
        const message = err.response?.data?.message || 'Erreur lors du chargement des commandes.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [authLoading, isAuthenticated, user]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusLabel = (status) => STATUS_LABELS[status] || status;

  const getRoleContent = () => {
    if (!user?.role) return ROLE_CONTENT.client;
    return ROLE_CONTENT[user.role] || ROLE_CONTENT.client;
  };

  const getEstimatedDelay = (status) => {
    if (status === 'en_attente') return '1-2 jours';
    if (status === 'confirmée') return '2-4 jours';
    if (status === 'en_livraison') return '1-2 jours';
    if (status === 'livrée') return 'Livré';
    return '3-5 jours';
  };

  const content = getRoleContent();

  if (authLoading) {
    return (
      <div className="orders-page">
        <div className="orders-page__content">
          <div className="orders-page__panel">
            <div className="loading">
              <div className="spinner"></div>
              <p>Chargement de votre session...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="orders-page__panel orders-page__panel--centered">
            <h1>Connexion requise</h1>
            <p>Connectez-vous pour consulter vos commandes.</p>
            <Link to="/login" className="orders-page__cta">Se connecter</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-page__content">

        <div className="orders-page__header">
          <h1>{content.title}</h1>
          <p>{content.description}</p>
        </div>

        {loading ? (
          <div className="orders-page__panel">
            <div className="loading">
              <div className="spinner"></div>
              <p>Chargement des commandes...</p>
            </div>
          </div>
        ) : error ? (
          <div className="orders-page__panel orders-page__panel--centered">
            <h2>Impossible de charger les commandes</h2>
            <p>{error}</p>
            <button type="button" className="orders-page__cta" onClick={() => window.location.reload()}>
              Réessayer
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="orders-page__panel orders-page__panel--centered">
            <h2>{content.emptyTitle}</h2>
            <p>{content.emptyDescription}</p>
            <Link to={content.ctaLink} className="orders-page__cta">{content.ctaLabel}</Link>
          </div>
        ) : (
          <div className="orders-page__cards-fullwidth">
            {orders.map((order) => (
              <article key={order._id} className="orders-page__card-fullwidth">
                <div className="orders-page__card-left">
                  <div className="orders-page__image-box">
                    {order.product?.image ? (
                      <img
                        src={`${API_BASE_URL}${order.product.image}`}
                        alt={order.product?.name || 'Produit'}
                      />
                    ) : (
                      <div className="orders-page__no-image">📦</div>
                    )}
                  </div>

                  <div className="orders-page__product-info">
                    <div className="orders-page__product-meta">
                      <span className="orders-page__product-label">#{order._id.slice(-8)}</span>
                      <span className={`orders-page__status-badge orders-page__status-badge--${order.status}`}>{getStatusLabel(order.status)}</span>
                    </div>
                    <h2>{order.product?.name || 'Produit indisponible'}</h2>
                    <div className="orders-page__key-info">
                      <span>Statut: <strong>{getStatusLabel(order.status)}</strong></span>
                      <span>Date: <strong>{formatDate(order.createdAt)}</strong></span>
                      <span>Client: <strong>{order.clientName || order.client?.name || 'N/A'}</strong></span>
                      <span>Tél: <strong>{order.phone || order.clientPhone || 'Non renseigné'}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="orders-page__card-middle">
                  <div className="orders-page__price-block">
                    <span>Prix total</span>
                    <strong>{formatPrice(order.totalPrice)}</strong>
                  </div>
                  <div className="orders-page__payment-mode">
                    <span>Mode de paiement</span>
                    <strong>{order.paymentMethod || 'Carte bancaire'}</strong>
                  </div>
                </div>

                <div className="orders-page__card-right">
                  <div className="orders-page__progress-line">
                    <div className={`progress-step ${order.status === 'en_attente' || order.status === 'confirmée' || order.status === 'en_livraison' || order.status === 'livrée' ? 'active' : ''}`}>
                      <span></span>
                      <strong>Commande placée</strong>
                    </div>
                    <div className={`progress-step ${order.status === 'confirmée' || order.status === 'en_livraison' || order.status === 'livrée' ? 'active' : ''}`}>
                      <span></span>
                      <strong>Paiement confirmé</strong>
                    </div>
                    <div className={`progress-step ${order.status === 'en_livraison' || order.status === 'livrée' ? 'active' : ''}`}>
                      <span></span>
                      <strong>En attente d'expédition</strong>
                    </div>
                    <div className={`progress-step ${order.status === 'livrée' ? 'active' : ''}`}>
                      <span></span>
                      <strong>Livrée</strong>
                    </div>
                  </div>

                  <div className="orders-page__estimate">
                    Délai estimé: <strong>{getEstimatedDelay(order.status)}</strong>
                  </div>

                  <div className="orders-page__actions-right">
                    <button className="orders-page__details-btn">Détails de la commande</button>
                    <button className="orders-page__report-btn">Signaler un problème</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;