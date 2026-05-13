import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import './AuthPages.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resetUrl, setResetUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/auth/forgot-password', { email });
      setResetUrl(res.data.resetUrl);
      setSuccess(true);
      toast.success('Lien de réinitialisation généré !');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur.');
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
              <span className="badge-icon">🔑</span>
            </div>
            <h1>Mot de passe oublié ?</h1>
            <p>Entrez votre email pour réinitialiser votre mot de passe</p>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit} className="auth-form-v3">
              <div className="form-row-v3">
                <div className="form-group-v3">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <button type="submit" className="btn-submit-v3" disabled={loading}>
                {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
              </button>

              <div className="auth-footer-v3">
                <p>Retour à <Link to="/login">Se connecter</Link></p>
              </div>
            </form>
          ) : (
            <div className="auth-form-v3" style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
              <h3 style={{ color: '#fff', marginBottom: '0.5rem', fontSize: '1.25rem', fontWeight: 700 }}>
                Lien généré !
              </h3>
              <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Pour le développement, le lien de réinitialisation est affiché ici :
              </p>
              <div style={{ 
                background: 'rgba(0,0,0,0.3)', 
                padding: '0.9rem 1.1rem', 
                borderRadius: '12px', 
                border: '1px solid var(--border)',
                marginBottom: '1.5rem',
                wordBreak: 'break-all',
                textAlign: 'left',
                fontSize: '0.85rem',
                color: 'var(--orange)',
                fontFamily: 'monospace'
              }}>
                {resetUrl}
              </div>
              <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                Copiez et collez ce lien dans votre navigateur pour réinitialiser votre mot de passe.
              </p>
              <div className="auth-footer-v3" style={{ marginTop: '0' }}>
                <p>Retour à <Link to="/login">Se connecter</Link></p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
