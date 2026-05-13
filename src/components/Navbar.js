import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './Navbar.css?v=20';

const ShopLogo = () => (
  <svg width="36" height="36" viewBox="0 0 110 132" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M0 70 Q55 10 110 70 Z" fill="#E8621A"/>
    <rect x="52" y="14" width="2.5" height="18" fill="#FDF6EE" rx="1"/>
    <polygon points="55,14 55,24 63,19" fill="#F5874A"/>
    <rect x="8" y="68" width="94" height="62" fill="#FDF6EE" rx="2"/>
    <rect x="4" y="66" width="102" height="12" fill="#B84D10" rx="2"/>
    <line x1="22" y1="68" x2="22" y2="76" stroke="#F5874A" strokeWidth="1.5"/>
    <line x1="40" y1="68" x2="40" y2="76" stroke="#F5874A" strokeWidth="1.5"/>
    <line x1="58" y1="68" x2="58" y2="76" stroke="#F5874A" strokeWidth="1.5"/>
    <line x1="76" y1="68" x2="76" y2="76" stroke="#F5874A" strokeWidth="1.5"/>
    <line x1="94" y1="68" x2="94" y2="76" stroke="#F5874A" strokeWidth="1.5"/>
    <rect x="14" y="84" width="28" height="22" fill="#E8621A" rx="3" opacity="0.2"/>
    <rect x="14" y="84" width="28" height="22" fill="none" stroke="#E8621A" strokeWidth="1.5" rx="3"/>
    <line x1="28" y1="84" x2="28" y2="106" stroke="#E8621A" strokeWidth="1"/>
    <line x1="14" y1="95" x2="42" y2="95" stroke="#E8621A" strokeWidth="1"/>
    <rect x="68" y="84" width="28" height="22" fill="#E8621A" rx="3" opacity="0.2"/>
    <rect x="68" y="84" width="28" height="22" fill="none" stroke="#E8621A" strokeWidth="1.5" rx="3"/>
    <line x1="82" y1="84" x2="82" y2="106" stroke="#E8621A" strokeWidth="1"/>
    <line x1="68" y1="95" x2="96" y2="95" stroke="#E8621A" strokeWidth="1"/>
    <rect x="41" y="92" width="28" height="38" fill="#3D2C1E" rx="3"/>
    <circle cx="63" cy="111" r="2" fill="#E8621A"/>
    <rect x="0" y="128" width="110" height="4" fill="#FDF6EE" rx="2" opacity="0.2"/>
  </svg>
);

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const result = await logout();
      if (!result.success) {
        toast.error(`${result.error}. La session locale a tout de même été fermée.`);
      }
      navigate('/');
    } finally {
      setIsLoggingOut(false);
    }
  };

  /* Dashboard selon le rôle */
  const getDashboardLink = () => {
    if (!user) return '/dashboard';
    if (user.role === 'admin') return '/admin';
    return '/dashboard';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <ShopLogo />
          <span className="navbar-logo-text">Sunu<span>Marché</span></span>
        </Link>

        <div className="navbar-menu">
          <Link to="/products" className="navbar-link">Produits</Link>

          {isAuthenticated ? (
            /* ── Utilisateur connecté ── */
            <>
              <Link to="/favorites"           className="navbar-link">Favoris</Link>
              <Link to={getDashboardLink()}   className="navbar-link">Dashboard</Link>
              <span className="navbar-user-name">{user?.name || user?.email}</span>
              <button
                onClick={handleLogout}
                className="navbar-logout-btn"
                disabled={isLoggingOut}
              >
                {isLoggingOut ? 'Déconnexion...' : 'Déconnexion'}
              </button>
            </>
          ) : (
            /* ── Utilisateur non connecté ── */
            <>
              <Link to="/register" className="navbar-btn-outline">Vendre gratuitement</Link>
              <Link to="/login"    className="navbar-btn-fill">Connexion</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;