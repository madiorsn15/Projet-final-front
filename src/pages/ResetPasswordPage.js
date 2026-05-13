import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import './AuthPages.css';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas.');
      return;
    }

    if (password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setLoading(true);

    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      setSuccess(true);
      toast.success('Mot de passe réinitialisé avec succès !');
      setTimeout(() => navigate('/login'), 2500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Token invalide ou expiré.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-split-page">
      {/* LEFT — BRANDING & MARKETING */}
      <div className="register-branding login-branding">
        <div className="branding-content">
          <div className="branding-tag">
            🏆 Marketplace n°1 au Sénégal
          </div>
          <h1>Achetez et vendez <span>partout au Sénégal</span>.</h1>
          <p>La marketplace moderne pour acheter, vendre et gérer vos commandes facilement.</p>

          {/* Feature Cards */}
          <div className="branding-features">
            <div className="b-feature">
              <div className="b-feature-icon">⚡</div>
              <div className="b-feature-text">
                <strong>Vente rapide</strong>
                <span>Mettez vos produits en ligne en quelques minutes</span>
              </div>
            </div>
            <div className="b-feature">
              <div className="b-feature-icon">📦</div>
              <div className="b-feature-text">
                <strong>Suivi des commandes</strong>
                <span>Gardez un œil sur vos achats et ventes</span>
              </div>
            </div>
            <div className="b-feature">
              <div className="b-feature-icon">💬</div>
              <div className="b-feature-text">
                <strong>Communication WhatsApp</strong>
                <span>Échangez facilement avec les vendeurs</span>
              </div>
            </div>
          </div>

          {/* Dashboard Illustration */}
          <div className="dashboard-placeholder">
            <div className="dashboard-header">
              <div className="dashboard-title">Tableau de bord</div>
            </div>
            <div className="dashboard-stats">
              <div className="stat-card">
                <div className="stat-value">1248</div>
                <div className="stat-label">Visites</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">2,450,000 FCFA</div>
                <div className="stat-label">Ventes</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">30</div>
                <div className="stat-label">Produits</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">145</div>
                <div className="stat-label">Clients</div>
              </div>
            </div>
            <div className="dashboard-chart">
              <div className="chart-bar"></div>
              <div className="chart-bar"></div>
              <div className="chart-bar"></div>
              <div className="chart-bar"></div>
              <div className="chart-bar"></div>
              <div className="chart-bar"></div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="trust-bar">
          <div className="trust-item">
            <span className="icon">🔒</span>
            <span className="text">Paiements sécurisés</span>
          </div>
          <div className="trust-item">
            <span className="icon">🚚</span>
            <span className="text">Livraison partout au Sénégal</span>
          </div>
          <div className="trust-item">
            <span className="icon">💬</span>
            <span className="text">Support 24/7</span>
          </div>
          <div className="trust-item">
            <span className="icon">✅</span>
            <span className="text">Satisfait ou remboursé</span>
          </div>
        </div>
      </div>

      {/* ─── COLONNE DROITE — 45% ─── */}
      <div className="register-form-side">
        <div className="register-card-v3">
          <div className="auth-header-v3">
            <div className="auth-icon-badge-v3">
              <span className="badge-icon">🔐</span>
            </div>
            <h1>Réinitialiser le mot de passe</h1>
            <p>Entrez votre nouveau mot de passe</p>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit} className="auth-form-v3">
              <div className="form-row-v3">
                <div className="form-group-v3">
                  <label htmlFor="password">Nouveau mot de passe</label>
                  <div className="input-with-icon">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 6 caractères"
                      required
                      disabled={loading}
                    />
                    <button 
                      type="button" 
                      className="pass-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "👁️‍🗨️" : "👁️"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="form-row-v3">
                <div className="form-group-v3">
                  <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                  <div className="input-with-icon">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Répétez le mot de passe"
                      required
                      disabled={loading}
                    />
                    <button 
                      type="button" 
                      className="pass-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? "👁️‍🗨️" : "👁️"}
                    </button>
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-submit-v3" disabled={loading}>
                {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
              </button>

              <div className="auth-footer-v3">
                <p>Retour à <Link to="/login">Se connecter</Link></p>
              </div>
            </form>
          ) : (
            <div className="auth-form-v3" style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
              <h3 style={{ color: '#fff', marginBottom: '0.5rem', fontSize: '1.25rem', fontWeight: 700 }}>
                Mot de passe réinitialisé !
              </h3>
              <p style={{ color: 'var(--muted)', marginBottom: '1rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Vous allez être redirigé vers la page de connexion.
              </p>
              <div className="auth-footer-v3" style={{ marginTop: '0' }}>
                <p>Aller à <Link to="/login">Se connecter</Link></p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
