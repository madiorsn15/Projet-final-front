import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const CATEGORIES = [
  'Électronique','Vêtements','Alimentation','Maison & Jardin',
  'Beauté & Santé','Sports & Loisirs','Automobiles','Livres','Jeux & Jouets','Autres',
];

const ShopLogo = () => (
  <svg width="38" height="38" viewBox="0 0 110 132" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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
  </svg>
);

const SearchIcon  = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const ChevronDown = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>;
const HeartIcon   = () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const CartIcon    = () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>;
const UserIcon    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const GridIcon    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut]     = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCatOpen, setIsCatOpen]           = useState(false);
  const [searchQuery, setSearchQuery]       = useState('');
  const menuRef      = useRef(null);
  const hamburgerRef = useRef(null);
  const catRef       = useRef(null);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      setIsMobileMenuOpen(false);
      const result = await logout();
      if (!result.success) toast.error(`${result.error}. Session locale fermée.`);
      navigate('/');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getDashboardLink = () => (!user ? '/dashboard' : user.role === 'admin' ? '/admin' : '/dashboard');
  const getUserInitial   = () => (user?.name || user?.email || 'U').charAt(0).toUpperCase();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      closeMobileMenu();
    }
  };

  const handleCategorySelect = (cat) => {
    setIsCatOpen(false);
    navigate(`/products?category=${encodeURIComponent(cat)}`);
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(p => !p);
  const closeMobileMenu  = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    const handler = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) setIsCatOpen(false);
      if (menuRef.current && !menuRef.current.contains(e.target) &&
          hamburgerRef.current && !hamburgerRef.current.contains(e.target)) closeMobileMenu();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <nav className="navbar">
      {/* Ligne orange */}
      <div className="navbar-top-line" />

      {/* Barre principale */}
      <div className="navbar-main">
        <div className="navbar-container">

          {/* Logo */}
          <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
            <ShopLogo />
            <span className="navbar-logo-text">Sunu<span>Marché</span></span>
          </Link>

          {/* Catégories dropdown */}
          <div className="navbar-cat-wrap" ref={catRef}>
            <button className={`navbar-cat-btn ${isCatOpen ? 'open' : ''}`} onClick={() => setIsCatOpen(p => !p)}>
              <GridIcon />
              <span>Catégories</span>
              <span className={`cat-chevron ${isCatOpen ? 'open' : ''}`}><ChevronDown /></span>
            </button>
            {isCatOpen && (
              <div className="navbar-cat-menu">
                {CATEGORIES.map(cat => (
                  <button key={cat} className="navbar-cat-item" onClick={() => handleCategorySelect(cat)}>
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Recherche */}
          <form className="navbar-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Rechercher un produit, une catégorie..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="navbar-search-btn"><SearchIcon /></button>
          </form>

          {/* Actions desktop */}
          <div className="navbar-actions">
            <Link to="/products" className="navbar-link">Produits</Link>
            {!isAuthenticated && <Link to="/register" className="navbar-btn-outline">Vendre gratuitement</Link>}

            <Link to="/favorites" className="navbar-icon-btn" aria-label="Favoris"><HeartIcon /></Link>

            <Link to="/cart" className="navbar-icon-btn" aria-label="Panier" style={{ position: 'relative' }}>
              <CartIcon />
              <span className="navbar-badge">0</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link to={getDashboardLink()} className="navbar-avatar" title={user?.name}>{getUserInitial()}</Link>
                <button onClick={handleLogout} className="navbar-logout-btn" disabled={isLoggingOut}>
                  {isLoggingOut ? '...' : 'Déconnexion'}
                </button>
              </>
            ) : (
              <Link to="/login" className="navbar-btn-fill"><UserIcon /> Connexion</Link>
            )}
          </div>

          {/* Burger */}
          <button ref={hamburgerRef} className="navbar-hamburger" onClick={toggleMobileMenu} aria-label="Menu" aria-expanded={isMobileMenuOpen}>
            <span className={isMobileMenuOpen ? 'hamburger-line active' : 'hamburger-line'} />
            <span className={isMobileMenuOpen ? 'hamburger-line active' : 'hamburger-line'} />
            <span className={isMobileMenuOpen ? 'hamburger-line active' : 'hamburger-line'} />
          </button>
        </div>
      </div>

      {/* Bande de réassurance */}
      <div className="navbar-reassurance">
        <div className="navbar-container">
          <div className="reassurance-items">
            <div className="reassurance-item"><span>🛡️</span><div><strong>Achats sécurisés</strong><span>Vos transactions sont protégées</span></div></div>
            <div className="reassurance-item"><span>🚚</span><div><strong>Livraison rapide</strong><span>Partout au Sénégal</span></div></div>
            <div className="reassurance-item"><span>✅</span><div><strong>Produits de qualité</strong><span>Sélectionnés avec soin</span></div></div>
            <div className="reassurance-item"><span>💬</span><div><strong>Support 7/7</strong><span>Nous sommes là pour vous</span></div></div>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      <div ref={menuRef} className={`navbar-mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="navbar-mobile-menu-content">
          <form className="navbar-mobile-search" onSubmit={handleSearch}>
            <input type="text" placeholder="Rechercher..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            <button type="submit"><SearchIcon /></button>
          </form>
          <div className="navbar-mobile-divider" />
          {isAuthenticated ? (
            <>
              <div className="navbar-mobile-user">
                <div className="navbar-mobile-user-avatar">{getUserInitial()}</div>
                <span className="navbar-mobile-user-name">{user?.name || user?.email}</span>
              </div>
              <div className="navbar-mobile-divider" />
              <Link to="/products"          className="navbar-mobile-link" onClick={closeMobileMenu}>Produits</Link>
              <Link to="/favorites"         className="navbar-mobile-link" onClick={closeMobileMenu}>Favoris</Link>
              <Link to={getDashboardLink()} className="navbar-mobile-link" onClick={closeMobileMenu}>Dashboard</Link>
              <div className="navbar-mobile-divider" />
              <button onClick={handleLogout} className="navbar-mobile-logout" disabled={isLoggingOut}>
                {isLoggingOut ? 'Déconnexion...' : '🚪 Déconnexion'}
              </button>
            </>
          ) : (
            <>
              <Link to="/products" className="navbar-mobile-link"       onClick={closeMobileMenu}>Produits</Link>
              <div className="navbar-mobile-divider" />
              <Link to="/register" className="navbar-mobile-btn-outline" onClick={closeMobileMenu}>Vendre gratuitement</Link>
              <Link to="/login"    className="navbar-mobile-btn-fill"    onClick={closeMobileMenu}>Connexion</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;