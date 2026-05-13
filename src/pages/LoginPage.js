import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState(null);
  const { login, loginWithGoogle, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    const result = await login(formData.email, formData.password);
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

      {/* RIGHT — FORMULAIRE */}
      <div className="register-form-side">
        <div className="register-card-v3">
          <div className="auth-header-v3">
            <div className="auth-icon-badge-v3">🔐</div>
            <h1>Connexion</h1>
            <p>Ravi de vous revoir ! Veuillez entrer vos accès</p>
          </div>

          {localError && <div className="error-message">{localError}</div>}

          <form className="auth-form-v3" onSubmit={handleSubmit}>
            <div className="form-group-v3">
              <label htmlFor="email">Email ou numéro de téléphone</label>
              <input id="email" name="email" type="text" placeholder="votre@email.com ou +221..." value={formData.email} onChange={handleChange} required autoComplete="username" />
            </div>
            <div className="form-group-v3">
              <div className="label-with-link">
                <label htmlFor="password">Mot de passe</label>
                <Link to="/forgot-password" className="forgot-link">Oublié ?</Link>
              </div>
              <div className="input-with-icon">
                <input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={formData.password} onChange={handleChange} required autoComplete="current-password" />
                <button type="button" className="pass-toggle" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-submit-v3" disabled={loading}>
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>

            <div className="auth-divider-v3"><span>Ou</span></div>

            <div className="social-buttons">
              <button type="button" className="btn-social" onClick={loginWithGoogle} disabled={loading}>
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
                Se connecter avec Google
              </button>
            </div>
          </form>

          <div className="auth-footer-v3">
            Pas encore de compte ? <Link to="/register">S'inscrire</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
