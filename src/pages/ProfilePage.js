import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, updateProfile, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        whatsapp: user.whatsapp || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateProfile({
        name: formData.name,
        whatsapp: formData.whatsapp,
      });

      if (result.success) {
        toast.success('Profil mis à jour avec succès');
        setIsEditing(false);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="auth-required">
            <h2>Connexion requise</h2>
            <p>Veuillez vous connecter pour accéder à votre profil.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <h1>Mon Profil</h1>
          <p>Gérez vos informations personnelles</p>
        </div>

        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-avatar">
              <span>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
            </div>

            <div className="profile-info">
              <h2>{user?.name}</h2>
              <p className="role-badge">{user?.role === 'vendeur' ? 'Vendeur' : 'Client'}</p>
              <p className="email">{user?.email}</p>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="edit-btn"
            >
              {isEditing ? 'Annuler' : 'Modifier'}
            </button>
          </div>

          {isEditing && (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="name">Nom complet</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  disabled
                />
                <small>L'email ne peut pas être modifié depuis cette page.</small>
              </div>

              <div className="form-group">
                <label htmlFor="whatsapp">WhatsApp</label>
                <input
                  type="tel"
                  id="whatsapp"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="+221 XX XXX XX XX"
                  disabled={loading}
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="save-btn"
                  disabled={loading}
                >
                  {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="cancel-btn"
                  disabled={loading}
                >
                  Annuler
                </button>
              </div>
            </form>
          )}

          <div className="profile-stats">
            <div className="stat-card">
              <h3>Rôle</h3>
              <p>{user?.role === 'vendeur' ? 'Vendeur' : 'Client'}</p>
            </div>
            <div className="stat-card">
              <h3>Statut</h3>
              <p className={user?.isActive ? 'active' : 'inactive'}>
                {user?.isActive ? 'Actif' : 'Inactif'}
              </p>
            </div>
            <div className="stat-card">
              <h3>Membre depuis</h3>
              <p>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
