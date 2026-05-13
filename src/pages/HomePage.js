import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useStats from '../hooks/useStats';
import './HomePage.css?v=20';

/* ─── CONSTANTES ─── */
const CATEGORIES = [
  { id: 'electronique',  label: 'Téléphones',    icon: '📱' },
  { id: 'mode',          label: 'Mode & Pagnes',  icon: '👗' },
  { id: 'beaute',        label: 'Beauté',         icon: '✨' },
  { id: 'maison',        label: 'Maison',         icon: '🏠' },
  { id: 'alimentation',  label: 'Alimentaire',    icon: '🍲' },
  { id: 'auto',          label: 'Auto & Moto',    icon: '🚗' },
];

const DUMMY_PRODUCTS = [
  {
    _id: '1',
    name: 'iPhone 14 Pro Max - État Neuf',
    category: 'Électronique',
    price: 850000,
    images: [],
    isNew: true,
    isHot: true,
    rating: 4.9,
    reviewCount: 24,
    seller: { name: 'Aliou Diallo', shopName: 'Tech Dakar', phone: '221771234567' }
  },
  {
    _id: '2',
    name: 'Pagne Wax Sénégalais - Collection 2024',
    category: 'Mode',
    price: 25000,
    images: [],
    isNew: true,
    rating: 4.7,
    reviewCount: 18,
    seller: { name: 'Aissatou Fall', shopName: 'Fashion Ndaw', phone: '221779876543' }
  },
  {
    _id: '3',
    name: 'Sneakers Nike Air Max - Taille 42',
    category: 'Mode',
    price: 45000,
    images: [],
    isHot: true,
    discount: 15,
    rating: 4.5,
    reviewCount: 31,
    seller: { name: 'Moussa Ndiaye', shopName: 'Sport Store', phone: '221774567890' }
  },
  {
    _id: '4',
    name: 'Samsung Galaxy S23 - Garantie 1 an',
    category: 'Électronique',
    price: 650000,
    images: [],
    isNew: true,
    rating: 4.8,
    reviewCount: 42,
    seller: { name: 'Fatou Sarr', shopName: 'Mobile Plus', phone: '221772345678' }
  },
  {
    _id: '5',
    name: 'Coffret Cosmétiques Naturels',
    category: 'Beauté',
    price: 18000,
    images: [],
    isNew: true,
    rating: 4.6,
    reviewCount: 15,
    seller: { name: 'Marième Kane', shopName: 'Beauté Bio', phone: '221773456789' }
  },
  {
    _id: '6',
    name: 'Meuble TV Moderne - Bois local',
    category: 'Maison',
    price: 120000,
    images: [],
    isHot: true,
    rating: 4.4,
    reviewCount: 8,
    seller: { name: 'Cheikh Ba', shopName: 'Artisanat Sénégal', phone: '221775678901' }
  },
  {
    _id: '7',
    name: 'Thiéboudienne Préparée - Livraison rapide',
    category: 'Alimentation',
    price: 5000,
    images: [],
    isNew: true,
    rating: 4.9,
    reviewCount: 56,
    seller: { name: 'Aminata Gueye', shopName: 'Chez Aminata', phone: '221776789012' }
  },
  {
    _id: '8',
    name: 'Montagne de Riz Wolof - 25kg',
    category: 'Alimentation',
    price: 22000,
    images: [],
    rating: 4.3,
    reviewCount: 23,
    seller: { name: 'Demba Sow', shopName: 'Épicerie du Coin', phone: '221777890123' }
  }
];

const CATEGORY_ICON_MAP = {
  electronique: '📱', mode: '👗', beaute: '✨',
  maison: '🏠', alimentation: '🍲', auto: '🚗',
  sport: '⚽', sante: '💊',
};

/* ─── UTILS ─── */
const formatPrice = (price) =>
  new Intl.NumberFormat('fr-SN').format(price);

const getCategoryIcon = (cat = '') =>
  CATEGORY_ICON_MAP[cat.toLowerCase()] || '🏷️';

const buildWhatsAppLink = (product) => {
  const phone = (product.seller?.phone || '').replace(/\D/g, '');
  if (!phone) return null;
  const msg = encodeURIComponent(
    `Bonjour ! Je suis intéressé(e) par "${product.name}" à ${formatPrice(product.price)} FCFA sur SunuMarché. Est-il disponible ?`
  );
  return `https://wa.me/${phone}?text=${msg}`;
};

/* ════════════════════════════════════════════════════════
   HOMEPAGE
═══════════════════════════════════════════════════════ */
const HomePage = () => {
  const navigate = useNavigate();
  const [query,    setQuery]    = useState('');
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const { productsFormatted, sellersFormatted } = useStats();

  /* ─── Fetch produits tendances ─── */
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res  = await fetch('/api/products?sort=popular&limit=8');
      if (!res.ok) throw new Error('Erreur serveur');
      const data = await res.json();
      setProducts(data.products || data || []);
    } catch {
      setProducts(DUMMY_PRODUCTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  /* ─── Handlers ─── */
  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (q) navigate(`/products?search=${encodeURIComponent(q)}`);
  };

  const handleWhatsApp = (e, product) => {
    e.stopPropagation();
    const link = buildWhatsAppLink(product);
    if (link) window.open(link, '_blank', 'noopener');
    else alert('Numéro WhatsApp du vendeur non disponible.');
  };

  /* ─── Render ─── */
  return (
    <div className="home-page">

      {/* ════ HERO ════ */}
      <section className="hero-v2">
        <svg className="hero-wax-bg" viewBox="0 0 300 300" fill="none" aria-hidden="true">
          <circle cx="150" cy="150" r="60"  stroke="#E8621A" strokeWidth="0.8"/>
          <circle cx="150" cy="150" r="110" stroke="#E8621A" strokeWidth="0.8"/>
          <circle cx="150" cy="150" r="150" stroke="#E8621A" strokeWidth="0.8"/>
          <line x1="0"   y1="150" x2="300" y2="150" stroke="#E8621A" strokeWidth="0.8"/>
          <line x1="150" y1="0"   x2="150" y2="300" stroke="#E8621A" strokeWidth="0.8"/>
          <line x1="0"   y1="0"   x2="300" y2="300" stroke="#E8621A" strokeWidth="0.8"/>
          <line x1="300" y1="0"   x2="0"   y2="300" stroke="#E8621A" strokeWidth="0.8"/>
        </svg>

        <div className="hero-v2-container">
          <div className="location-badge">
            <span>📍</span> DAKAR &amp; ENVIRONS
          </div>

          <h1>
            Trouvez tout,<br />
            achetez <span>local.</span>
          </h1>

          <p className="hero-v2-description">
            Produits sénégalais · Vendeurs vérifiés · Paiement à la livraison
          </p>

          <form className="hero-v2-search" onSubmit={handleSearch}>
            <div className="search-input-wrapper">
              <div className="search-field">
                <span>🔍</span>
                <input
                  type="text"
                  placeholder="Que recherchez-vous ? (Téléphones, pagnes, cosmétiques...)"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoComplete="off"
                />
              </div>
              <button type="submit" className="search-btn">
                Rechercher
              </button>
            </div>
          </form>

          <div className="hero-v2-trends">
            <div className="trend-tags">
              {CATEGORIES.map((cat) => (
                <span
                  key={cat.id}
                  className="trend-tag"
                  onClick={() => navigate(`/products?category=${cat.id}`)}
                >
                  {cat.icon} {cat.label}
                </span>
              ))}
              <span className="trend-tag" onClick={() => navigate('/products')}>
                ➕ Tout voir
              </span>
            </div>
          </div>

          <div className="hero-v2-actions">
            <Link to="/products" className="btn-primary">
              Parcourir les produits
            </Link>
            <Link to="/register?role=seller" className="btn-secondary">
              Ouvrir ma boutique — c'est gratuit
            </Link>
          </div>
        </div>
      </section>

      {/* ════ TICKER SUPPRIMÉ ════ */}

      {/* ════ PRODUITS TENDANCES ════ */}
      <section className="trending-products">
        <div className="why-sunu-container">
          <div className="trending-header">
            <h2>Produits <span>tendances</span></h2>
            <Link to="/products" className="view-all">Tout voir →</Link>
          </div>

          <div className="products-grid">
            {loading
              ? [...Array(8)].map((_, i) => (
                  <div key={i} className="product-card-dark product-skeleton" />
                ))
              : products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onWhatsApp={handleWhatsApp}
                    onClick={() => navigate(`/products/${product._id}`)}
                  />
                ))
            }
          </div>
        </div>
      </section>

      {/* ════ POURQUOI SUNUMARCHÉ ════ */}
      <section className="why-sunu">
        <div className="why-sunu-container">
          <div className="why-sunu-header">
            <h2>Pourquoi <span>SunuMarché</span> ?</h2>
          </div>
          <div className="why-grid">
            <div className="why-card">
              <div className="why-icon">💬</div>
              <h3>Achetez via WhatsApp</h3>
              <p>Contactez le vendeur en 1 clic avec un message pré-rempli. Pas d'inscription requise pour acheter.</p>
            </div>
            <div className="why-card">
              <div className="why-icon">🤝</div>
              <h3>Payez à la livraison</h3>
              <p>Aucun paiement en ligne. Vous payez en main propre quand vous recevez votre commande. Zéro risque.</p>
            </div>
            <div className="why-card">
              <div className="why-icon">✅</div>
              <h3>Vendeurs locaux vérifiés</h3>
              <p>Tous nos vendeurs sont basés à Dakar et environs, vérifiés et évalués par la communauté SunuMarché.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ════ COMMENT ÇA MARCHE ════ */}
      <section className="how-it-works">
        <div className="why-sunu-container">
          <div className="why-sunu-header">
            <h2>Comment ça <span>marche</span> ?</h2>
          </div>
          <div className="how-grid">
            {[
              { num: '01', icon: '🔍', title: 'Chercher',  desc: "Trouvez parmi des milliers d'offres locales." },
              { num: '02', icon: '💬', title: 'Contacter', desc: '1 clic pour écrire au vendeur sur WhatsApp.' },
              { num: '03', icon: '🚚', title: 'Recevoir',  desc: 'Livraison rapide, paiement à la réception.' },
              { num: '04', icon: '⭐', title: 'Noter',     desc: 'Évaluez le vendeur et aidez la communauté.' },
            ].map((step) => (
              <div key={step.num} className="how-item">
                <div className="how-number">{step.num}</div>
                <div className="how-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ SELLER BANNER ════ */}
      <section className="why-sunu-container">
        <div className="seller-banner">
          <div className="seller-banner-content">
            <div className="seller-banner-tag">VENDEURS — 0 FCFA DE COMMISSION</div>
            <h2>Ouvrez votre boutique<br />en <span>5 minutes.</span></h2>
            <p>Plus de {sellersFormatted} vendeurs actifs. Rejoignez-les gratuitement.</p>
            <div className="seller-stats">
              <div className="stat-item"><h4>{sellersFormatted}+</h4><p>Vendeurs actifs</p></div>
              <div className="stat-item"><h4>{productsFormatted}+</h4><p>Produits listés</p></div>
              <div className="stat-item"><h4>0 FCFA</h4><p>Commission</p></div>
            </div>
          </div>
          <div className="seller-banner-actions">
            <Link to="/register?role=seller" className="btn-primary">
              Créer ma boutique gratuitement
            </Link>
            <Link to="/register?role=seller" className="btn-secondary">
              En savoir plus
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   PRODUCT CARD
═══════════════════════════════════════════════════════ */
const ProductCard = ({ product, onWhatsApp, onClick }) => {
  const badges = [];
  if (product.isNew)        badges.push({ label: 'NEW',                  cls: 'badge-new'  });
  if (product.isHot)        badges.push({ label: 'HOT 🔥',               cls: 'badge-hot'  });
  if (product.discount > 0) badges.push({ label: `-${product.discount}%`, cls: 'badge-sale' });

  return (
    <div className="product-card-dark" onClick={onClick}>
      <div className="product-image-placeholder">
        {product.images?.[0]
          ? <img src={product.images[0]} alt={product.name} className="product-real-img" />
          : <div className="placeholder-icon">{getCategoryIcon(product.category)}</div>
        }
        {badges.length > 0 && (
          <div className="product-badges">
            {badges.map((b, i) => (
              <span key={i} className={`product-badge ${b.cls}`}>{b.label}</span>
            ))}
          </div>
        )}
      </div>

      <div className="product-content">
        <span className="product-cat">
          {product.category?.toUpperCase() || 'PRODUIT'}
        </span>
        <h3>{product.name}</h3>
        <p className="product-seller">
          <span className="seller-online-dot" />
          {product.seller?.shopName || product.seller?.name || 'Vendeur SunuMarché'}
        </p>
        <div className="product-footer">
          <span className="product-price">{formatPrice(product.price)} F</span>
          {product.rating > 0 && (
            <div className="product-rating">
              ⭐ {product.rating.toFixed(1)}
              {product.reviewCount > 0 && (
                <span className="rating-count"> · {product.reviewCount} avis</span>
              )}
            </div>
          )}
        </div>

        <button
          className="contact-btn-small"
          onClick={(e) => onWhatsApp(e, product)}
          aria-label={`Contacter le vendeur de ${product.name} via WhatsApp`}
        >
          💬 Contacter via WhatsApp
        </button>
      </div>
    </div>
  );
};

export default HomePage;