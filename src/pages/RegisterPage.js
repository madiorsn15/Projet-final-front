import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', whatsapp: '', password: '', confirmPassword: '', role: 'client' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState(null);
  const { register, loginWithGoogle, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Les mots de passe ne correspondent pas');
      return;
    }
    const result = await register({ ...formData, phone: formData.whatsapp });
    if (result.success) {
      navigate('/');
    } else {
      setLocalError(result.error);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

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

      {/* RIGHT — FORMULAIRE (60%) */}
      <div className="register-form-side">
        <div className="register-card-v3">
          <div className="auth-header-v3">
            <div className="auth-icon-badge-v3">👤</div>
            <h1>Créer un compte</h1>
            <p>Rejoignez SunuMarché en moins d’une minute</p>
          </div>

          {localError && <div className="error-message">{localError}</div>}

          <form className="auth-form-v3" onSubmit={handleSubmit}>
            <div className="role-toggle-v3">
              <button
                type="button"
                className={formData.role === 'client' ? 'active' : ''}
                onClick={() => setFormData({ ...formData, role: 'client' })}
              >
                👤 Client
              </button>
              <button
                type="button"
                className={formData.role === 'vendeur' ? 'active' : ''}
                onClick={() => setFormData({ ...formData, role: 'vendeur' })}
              >
                🏪 Vendeur
              </button>
            </div>

            <div className="form-group-v3">
              <label htmlFor="name">Nom complet</label>
              <input id="name" name="name" type="text" placeholder="Ex: Marie Fall" value={formData.name} onChange={handleChange} required autoComplete="name" />
            </div>
            <div className="form-group-v3">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" placeholder="marie@example.com" value={formData.email} onChange={handleChange} required autoComplete="email" />
            </div>
            <div className="form-group-v3">
              <label htmlFor="whatsapp">Numéro de téléphone (WhatsApp)</label>
              <input id="whatsapp" name="whatsapp" type="tel" placeholder="+221 77 000 00 00" value={formData.whatsapp} onChange={handleChange} required autoComplete="tel" />
            </div>
            <div className="form-group-v3">
              <label htmlFor="password">Mot de passe</label>
              <div className="input-with-icon">
                <input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={formData.password} onChange={handleChange} required autoComplete="new-password" />
                <button type="button" className="pass-toggle" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <div className="form-group-v3">
              <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
              <div className="input-with-icon">
                <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required autoComplete="new-password" />
                <button type="button" className="pass-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)} aria-label="Toggle password visibility">
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-submit-v3" disabled={loading}>
              {loading ? 'Création du compte...' : 'Créer mon compte gratuitement'}
            </button>

            <div className="auth-divider-v3"><span>Ou</span></div>

            <div className="social-buttons">
              <button type="button" className="btn-social" onClick={loginWithGoogle} disabled={loading}>
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
                S'inscrire avec Google
              </button>
            </div>
          </form>

          <div className="auth-footer-v3">
            Vous avez déjà un compte ? <Link to="/login">Se connecter</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
