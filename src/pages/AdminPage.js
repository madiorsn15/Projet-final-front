import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api, { API_BASE_URL } from '../utils/api';
import './AdminPage.css';

const ORDER_STATUS_LABELS = {
  en_attente: 'En attente',
  'confirmée': 'Confirmée',
  en_livraison: 'En livraison',
  'livrée': 'Livrée',
  'annulée': 'Annulée',
};

const AdminPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [busyKey, setBusyKey] = useState('');

  useEffect(() => {
    console.log('[DEBUG] AdminPage - authLoading:', authLoading);
    console.log('[DEBUG] AdminPage - user:', user);
    console.log('[DEBUG] AdminPage - user role:', user?.role);
    
    if (authLoading) {
      return;
    }

    if (user?.role === 'admin') {
      console.log('[DEBUG] AdminPage - Loading admin data...');
      loadAdminData();
    } else {
      console.log('[DEBUG] AdminPage - Not admin, setting loading false');
      setLoading(false);
    }
  }, [authLoading, user]);

  const loadAdminData = async () => {
    try {
      setLoading(true);

      const [usersRes, productsRes, ordersRes] = await Promise.all([
        api.get('/users'),
        api.get('/products?limit=50'),
        api.get('/orders'),
      ]);

      const usersData = usersRes.data.users || [];
      const productsData = productsRes.data.products || [];
      const ordersData = ordersRes.data.orders || [];

      setUsers(usersData);
      setProducts(productsData);
      setOrders(ordersData);

      setStats({
        totalUsers: usersData.length,
        totalProducts: productsData.length,
        totalOrders: ordersData.length,
        totalRevenue: ordersData.reduce((sum, order) => sum + (order.totalPrice || 0), 0),
      });
    } catch (error) {
      console.error('Erreur chargement données admin:', error);
      toast.error(error.response?.data?.message || 'Erreur lors du chargement des données admin');
    } finally {
      setLoading(false);
    }
  };

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

  const getOrderStatusLabel = (status) => ORDER_STATUS_LABELS[status] || status;

  const handleToggleUser = async (targetUser) => {
    const busyId = `user-toggle-${targetUser._id}`;

    try {
      setBusyKey(busyId);
      const response = await api.patch(`/users/${targetUser._id}/toggle`);
      const updatedUser = response.data.user;

      setUsers((prevUsers) =>
        prevUsers.map((currentUser) =>
          currentUser._id === updatedUser._id ? updatedUser : currentUser
        )
      );

      toast.success(response.data.message || 'Utilisateur mis à jour');
      await loadAdminData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour de l’utilisateur');
    } finally {
      setBusyKey('');
    }
  };

  const handleDeleteUser = async (targetUser) => {
    const confirmed = window.confirm(`Supprimer définitivement ${targetUser.name} ?`);
    if (!confirmed) {
      return;
    }

    const busyId = `user-delete-${targetUser._id}`;

    try {
      setBusyKey(busyId);
      const response = await api.delete(`/users/${targetUser._id}`);

      setUsers((prevUsers) => prevUsers.filter((currentUser) => currentUser._id !== targetUser._id));
      toast.success(response.data.message || 'Utilisateur supprimé');
      await loadAdminData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
    } finally {
      setBusyKey('');
    }
  };

  const handleToggleProduct = async (product) => {
    const busyId = `product-toggle-${product._id}`;

    try {
      setBusyKey(busyId);
      const response = await api.put(`/products/${product._id}`, {
        isAvailable: !product.isAvailable,
      });
      const updatedProduct = response.data.product;

      setProducts((prevProducts) =>
        prevProducts.map((currentProduct) =>
          currentProduct._id === updatedProduct._id ? updatedProduct : currentProduct
        )
      );

      toast.success(response.data.message || 'Produit mis à jour');
      await loadAdminData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour du produit');
    } finally {
      setBusyKey('');
    }
  };

  const handleDeleteProduct = async (product) => {
    const confirmed = window.confirm(`Supprimer définitivement le produit "${product.name}" ?`);
    if (!confirmed) {
      return;
    }

    const busyId = `product-delete-${product._id}`;

    try {
      setBusyKey(busyId);
      const response = await api.delete(`/products/${product._id}`);

      setProducts((prevProducts) => prevProducts.filter((currentProduct) => currentProduct._id !== product._id));
      toast.success(response.data.message || 'Produit supprimé');
      await loadAdminData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression du produit');
    } finally {
      setBusyKey('');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="admin-page">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Chargement des données administrateur...</p>
          </div>
        </div>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    console.log('[DEBUG] AdminPage - Access denied - user role:', user?.role, 'expected: admin');
    return (
      <div className="admin-page">
        <div className="container">
          <div className="access-denied">
            <h2>Accès refusé</h2>
            <p>Vous n'avez pas les permissions pour accéder à cette page.</p>
            <p><small>Débug: Role actuel: {user?.role || 'non défini'}</small></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1>Panneau d'administration</h1>
          <p>Gestion de la plateforme SunuMarché</p>
        </div>

        <div className="admin-tabs">
          <button
            className={activeTab === 'overview' ? 'active' : ''}
            onClick={() => setActiveTab('overview')}
          >
            Vue d'ensemble
          </button>
          <button
            className={activeTab === 'users' ? 'active' : ''}
            onClick={() => setActiveTab('users')}
          >
            Utilisateurs ({stats.totalUsers})
          </button>
          <button
            className={activeTab === 'products' ? 'active' : ''}
            onClick={() => setActiveTab('products')}
          >
            Produits ({stats.totalProducts})
          </button>
          <button
            className={activeTab === 'orders' ? 'active' : ''}
            onClick={() => setActiveTab('orders')}
          >
            Commandes ({stats.totalOrders})
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="overview-content">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <h3>{stats.totalUsers}</h3>
                  <p>Utilisateurs inscrits</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-info">
                  <h3>{stats.totalProducts}</h3>
                  <p>Produits référencés</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🛒</div>
                <div className="stat-info">
                  <h3>{stats.totalOrders}</h3>
                  <p>Commandes totales</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <h3>{formatPrice(stats.totalRevenue)}</h3>
                  <p>Chiffre d'affaires</p>
                </div>
              </div>
            </div>

            <div className="recent-activity">
              <h2>Activité récente</h2>
              <div className="activity-list">
                <div className="activity-item">
                  <span className="activity-icon">🆕</span>
                  <div className="activity-info">
                    <p>Nouveaux utilisateurs cette semaine: {users.filter((currentUser) => new Date(currentUser.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}</p>
                    <small>{formatDate(new Date())}</small>
                  </div>
                </div>
                <div className="activity-item">
                  <span className="activity-icon">📦</span>
                  <div className="activity-info">
                    <p>Nouveaux produits cette semaine: {products.filter((product) => new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}</p>
                    <small>{formatDate(new Date())}</small>
                  </div>
                </div>
                <div className="activity-item">
                  <span className="activity-icon">🛒</span>
                  <div className="activity-info">
                    <p>Commandes cette semaine: {orders.filter((order) => new Date(order.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}</p>
                    <small>{formatDate(new Date())}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-content">
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Date d'inscription</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((currentUser) => {
                    const toggleBusy = busyKey === `user-toggle-${currentUser._id}`;
                    const deleteBusy = busyKey === `user-delete-${currentUser._id}`;
                    const isAdmin = currentUser.role === 'admin';

                    return (
                      <tr key={currentUser._id}>
                        <td>{currentUser.name}</td>
                        <td>{currentUser.email}</td>
                        <td>
                          <span className={`role-badge ${currentUser.role}`}>
                            {currentUser.role === 'admin' ? 'Admin' : currentUser.role === 'vendeur' ? 'Vendeur' : 'Acheteur'}
                          </span>
                        </td>
                        <td>{formatDate(currentUser.createdAt)}</td>
                        <td>
                          <span className={`status-badge ${currentUser.isActive ? 'active' : 'inactive'}`}>
                            {currentUser.isActive ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button
                              type="button"
                              className={`action-btn-small ${currentUser.isActive ? 'warning' : 'success'}`}
                              onClick={() => handleToggleUser(currentUser)}
                              disabled={toggleBusy || deleteBusy || isAdmin}
                            >
                              {toggleBusy ? '...' : currentUser.isActive ? 'Désactiver' : 'Activer'}
                            </button>
                            <button
                              type="button"
                              className="action-btn-small danger"
                              onClick={() => handleDeleteUser(currentUser)}
                              disabled={toggleBusy || deleteBusy || isAdmin}
                            >
                              {deleteBusy ? '...' : 'Supprimer'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="products-content">
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Nom</th>
                    <th>Vendeur</th>
                    <th>Prix</th>
                    <th>Catégorie</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const toggleBusy = busyKey === `product-toggle-${product._id}`;
                    const deleteBusy = busyKey === `product-delete-${product._id}`;

                    return (
                      <tr key={product._id}>
                        <td>
                          {product.image ? (
                            <img
                              src={`${API_BASE_URL}${product.image}`}
                              alt={product.name}
                              className="product-thumb"
                              onError={(e) => {
                                e.target.src = '/placeholder-product.png';
                              }}
                            />
                          ) : (
                            <div className="no-image-thumb">📦</div>
                          )}
                        </td>
                        <td>{product.name}</td>
                        <td>{product.seller?.name || 'N/A'}</td>
                        <td>{formatPrice(product.price)}</td>
                        <td>{product.category}</td>
                        <td>
                          <span className={`status-badge ${product.isAvailable ? 'active' : 'inactive'}`}>
                            {product.isAvailable ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button
                              type="button"
                              className={`action-btn-small ${product.isAvailable ? 'warning' : 'success'}`}
                              onClick={() => handleToggleProduct(product)}
                              disabled={toggleBusy || deleteBusy}
                            >
                              {toggleBusy ? '...' : product.isAvailable ? 'Masquer' : 'Publier'}
                            </button>
                            <button
                              type="button"
                              className="action-btn-small danger"
                              onClick={() => handleDeleteProduct(product)}
                              disabled={toggleBusy || deleteBusy}
                            >
                              {deleteBusy ? '...' : 'Supprimer'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-content">
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>ID Commande</th>
                    <th>Acheteur</th>
                    <th>Vendeur</th>
                    <th>Montant</th>
                    <th>Statut</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>#{order._id.slice(-8)}</td>
                      <td>{order.client?.name || order.clientName || 'N/A'}</td>
                      <td>{order.product?.seller?.name || 'N/A'}</td>
                      <td>{formatPrice(order.totalPrice || 0)}</td>
                      <td>
                        <span className={`status-badge order-status-badge ${order.status}`}>
                          {getOrderStatusLabel(order.status)}
                        </span>
                      </td>
                      <td>{formatDate(order.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
