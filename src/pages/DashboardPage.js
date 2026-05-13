import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { API_BASE_URL } from '../utils/api';
import './DashboardPage.css?v=20';

const STATUS_LABELS = {
  en_attente: 'En attente',
  'confirmée': 'Confirmée',
  en_livraison: 'En livraison',
  'livrée': 'Livrée',
  'annulée': 'Annulée',
};

const getRoleBadge = (role) => {
  if (role === 'vendeur') return 'Vendeur';
  if (role === 'admin') return 'Administrateur';
  return 'Client';
};

const getRoleDescription = (role) => {
  if (role === 'vendeur') return 'Gérez vos produits, suivez vos commandes et augmentez vos ventes.';
  if (role === 'admin') return 'Gérez la plateforme et supervisez toutes les activités.';
  return 'Suivez vos commandes et retrouvez vos produits favoris.';
};

const DashboardPage = () => {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    productsCount: 0,
    ordersCount: 0,
    favoritesCount: 0,
    totalSales: 0,
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user?.role) { setLoading(false); return; }

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        if (user.role === 'vendeur') await loadSellerStats();
        else if (user.role === 'admin') await loadAdminStats();
        else await loadBuyerStats();
      } catch (error) {
        console.error('Erreur chargement dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [authLoading, user]);

  const loadSellerStats = async () => {
    const [productsRes, ordersRes] = await Promise.all([
      api.get('/products/seller/me'),
      api.get('/orders/seller'),
    ]);
    const products = productsRes.data.products || [];
    const orders = ordersRes.data.orders || [];
    setStats({
      productsCount: products.length,
      ordersCount: orders.length,
      favoritesCount: 0,
      totalSales: orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0),
    });
    setRecentProducts(products.slice(0, 5));
    setRecentOrders(orders.slice(0, 5));
  };

  const loadBuyerStats = async () => {
    const [ordersRes, favoritesRes] = await Promise.all([
      api.get('/orders/me'),
      api.get('/users/favorites'),
    ]);
    const orders = ordersRes.data.orders || [];
    const favorites = favoritesRes.data.favorites || [];
    setStats({ productsCount: 0, ordersCount: orders.length, favoritesCount: favorites.length, totalSales: 0 });
    setRecentProducts([]);
    setRecentOrders(orders.slice(0, 5));
  };

  const loadAdminStats = async () => {
    const ordersRes = await api.get('/orders');
    const orders = ordersRes.data.orders || [];
    setStats({ productsCount: 0, ordersCount: orders.length, favoritesCount: 0, totalSales: orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0) });
    setRecentProducts([]);
    setRecentOrders(orders.slice(0, 5));
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(price || 0);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' });

  const getStatusLabel = (s) => STATUS_LABELS[s] || s;

  if (authLoading || loading) {
    return (
      <div className="dashboard-page">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-content">
          <div className="empty-state">
            <div>🔒</div>
            <p>Connectez-vous pour accéder à votre tableau de bord.</p>
            <Link to="/login">Se connecter</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-inner">
          <div>
            <span className="welcome-badge">
              👋 Bienvenue, {user.name}
            </span>
            <h1>Tableau de <span>bord</span></h1>
            <p>{getRoleDescription(user.role)}</p>
          </div>
          <div className="role-badge">
            👤 {getRoleBadge(user.role)}
          </div>
        </div>
      </header>

      <main className="dashboard-content">

        {/* Stats */}
        <div>
          <div className="section-title">Vue d'ensemble</div>
          <div className="stats-grid">
            {user.role === 'vendeur' ? (
              <>
                <div className="stat-card">
                  <span className="stat-icon">📦</span>
                  <div>
                    <h3>{stats.productsCount}</h3>
                    <p>Produits</p>
                  </div>
                </div>
                <div className="stat-card">
                  <span className="stat-icon">🛒</span>
                  <div>
                    <h3>{stats.ordersCount}</h3>
                    <p>Commandes</p>
                  </div>
                </div>
                <div className="stat-card">
                  <span className="stat-icon">💰</span>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', letterSpacing: '-0.5px' }}>{formatPrice(stats.totalSales)}</h3>
                    <p>Ventes totales</p>
                  </div>
                </div>
              </>
            ) : user.role === 'admin' ? (
              <>
                <div className="stat-card">
                  <span className="stat-icon">🛒</span>
                  <div>
                    <h3>{stats.ordersCount}</h3>
                    <p>Commandes</p>
                  </div>
                </div>
                <div className="stat-card">
                  <span className="stat-icon">💰</span>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', letterSpacing: '-0.5px' }}>{formatPrice(stats.totalSales)}</h3>
                    <p>Volume total</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="stat-card">
                  <span className="stat-icon">📺</span>
                  <div>
                    <h3>{stats.ordersCount}</h3>
                    <p>Commandes</p>
                  </div>
                </div>
                <div className="stat-card">
                  <span className="stat-icon">❤️</span>
                  <div>
                    <h3>{stats.favoritesCount}</h3>
                    <p>Favoris</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Actions rapides */}
        <div>
          <div className="section-title">Actions rapides</div>
          <div className="actions-grid">
            {user.role === 'vendeur' ? (
              <>
                <Link to="/products/new" className="action-card">
                  <span className="action-icon">➕</span>
                  <div>
                    <h3>Vendre un produit</h3>
                    <p>Mettre en vente un nouveau produit</p>
                  </div>
                </Link>
                <Link to="/products/my-products" className="action-card">
                  <span className="action-icon">📋</span>
                  <div>
                    <h3>Mes produits</h3>
                    <p>Gérer vos produits en vente</p>
                  </div>
                </Link>
                <Link to="/orders" className="action-card">
                  <span className="action-icon">📦</span>
                  <div>
                    <h3>Commandes</h3>
                    <p>Voir les commandes reçues</p>
                  </div>
                </Link>
              </>
            ) : user.role === 'admin' ? (
              <>
                <Link to="/admin" className="action-card">
                  <span className="action-icon">🛠️</span>
                  <div>
                    <h3>Administration</h3>
                    <p>Gérer la plateforme</p>
                  </div>
                </Link>
                <Link to="/orders" className="action-card">
                  <span className="action-icon">📦</span>
                  <div>
                    <h3>Commandes</h3>
                    <p>Voir l'ensemble des commandes</p>
                  </div>
                </Link>
                <Link to="/products" className="action-card">
                  <span className="action-icon">🛍️</span>
                  <div>
                    <h3>Catalogue</h3>
                    <p>Consulter les produits</p>
                  </div>
                </Link>
              </>
            ) : (
              <>
                <Link to="/products" className="action-card">
                  <span className="action-icon">🛍️</span>
                  <div>
                    <h3>Acheter</h3>
                    <p>Découvrir de nouveaux produits</p>
                  </div>
                </Link>
                <Link to="/favorites" className="action-card">
                  <span className="action-icon">❤️</span>
                  <div>
                    <h3>Mes favoris</h3>
                    <p>Voir vos produits préférés</p>
                  </div>
                </Link>
                <Link to="/orders" className="action-card">
                  <span className="action-icon">📦</span>
                  <div>
                    <h3>Mes commandes</h3>
                    <p>Suivre vos achats</p>
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Contenu récent */}
        <div>
          <div className="section-title">
            {user.role === 'vendeur'
              ? 'Mes derniers produits'
              : user.role === 'admin'
              ? 'Dernières commandes'
              : 'Mes dernières commandes'}
          </div>

          {user.role === 'vendeur' ? (
            <div className="recent-section">
              <div className="recent-header">
                <h3>Mes derniers produits</h3>
                <Link to="/products/my-products" className="view-all-btn">Voir tout →</Link>
              </div>

              {recentProducts.length > 0 ? (
                recentProducts.map((product) => (
                  <div key={product._id} className="order-item">
                    <div className="order-info">
                      <h4>{product.name}</h4>
                      <p className="date">{product.category}</p>
                      <p className="total">{formatPrice(product.price)}</p>
                    </div>
                    <Link to={`/product/${product._id}`} className="view-all-btn">Voir →</Link>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <div>📦</div>
                  <p>Vous n'avez pas encore de produits.</p>
                  <Link to="/products/new">Ajouter un produit</Link>
                </div>
              )}
            </div>
          ) : (
            <div className="recent-section">
              <div className="recent-header">
                <h3>{user.role === 'admin' ? 'Dernières commandes' : 'Mes dernières commandes'}</h3>
                <Link to="/orders" className="view-all-btn">Voir tout →</Link>
              </div>

              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div key={order._id} className="order-item">
                    <div className="order-info">
                      <h4>#{order._id.slice(-8)}</h4>
                      <p className="date">📅 {formatDate(order.createdAt)}</p>
                      <p className="total">{formatPrice(order.totalPrice)}</p>
                    </div>
                    <span
                      className="status-badge"
                      data-status={order.status}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <div>📦</div>
                  <p>
                    {user.role === 'admin'
                      ? 'Aucune commande récente.'
                      : "Vous n'avez pas encore de commande."}
                  </p>
                  <Link to={user.role === 'admin' ? '/orders' : '/products'}>
                    {user.role === 'admin' ? 'Voir les commandes' : 'Commencer vos achats →'}
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default DashboardPage;