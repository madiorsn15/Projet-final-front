import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const ShopLogo = () => (
  <svg width="28" height="28" viewBox="0 0 110 132" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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

// Icônes réseaux sociaux
const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

const ChevronIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const Footer = () => {
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!agreed) return;
    // TODO: connecter à l'API newsletter
    setEmail('');
    setAgreed(false);
  };

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* ── Grille principale ── */}
        <div className="footer-grid">

          {/* Colonne 1 — Marque */}
          <div className="footer-col footer-brand-col">
            <div className="footer-logo">
              <ShopLogo />
              <span className="footer-logo-text">Sunu<span>Marché</span></span>
            </div>
            <p className="footer-tagline">
              Votre marketplace sénégalaise de confiance pour acheter et vendre en toute simplicité.
            </p>
            <div className="footer-badge">
              <span>🇸🇳</span> MADE IN SÉNÉGAL
            </div>
            <div className="footer-socials">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="footer-social-btn" aria-label="Facebook">
                <FacebookIcon />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="footer-social-btn" aria-label="Instagram">
                <InstagramIcon />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="footer-social-btn" aria-label="Twitter/X">
                <TwitterIcon />
              </a>
              <a href="https://wa.me/221000000000" target="_blank" rel="noreferrer" className="footer-social-btn" aria-label="WhatsApp">
                <WhatsAppIcon />
              </a>
            </div>
          </div>

          {/* Colonne 2 — Navigation */}
          <div className="footer-col">
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links">
              <li><Link to="/products"><ChevronIcon /> Produits</Link></li>
              <li><Link to="/products"><ChevronIcon /> Catégories</Link></li>
              <li><Link to="/register"><ChevronIcon /> Vendre gratuitement</Link></li>
              <li><Link to="/about"><ChevronIcon /> À propos</Link></li>
              <li><Link to="/contact"><ChevronIcon /> Contact</Link></li>
            </ul>
          </div>

          {/* Colonne 3 — Support */}
          <div className="footer-col">
            <h4 className="footer-col-title">Support</h4>
            <ul className="footer-links">
              <li><Link to="/help"><ChevronIcon /> Centre d'aide</Link></li>
              <li><Link to="/terms"><ChevronIcon /> Conditions d'utilisation</Link></li>
              <li><Link to="/privacy"><ChevronIcon /> Politique de confidentialité</Link></li>
              <li><Link to="/returns"><ChevronIcon /> Livraison et retours</Link></li>
              <li><Link to="/contact"><ChevronIcon /> Nous contacter</Link></li>
            </ul>
          </div>

          {/* Colonne 4 — Newsletter */}
          <div className="footer-col footer-newsletter-col">
            <h4 className="footer-col-title">Newsletter</h4>
            <p className="footer-newsletter-desc">
              Abonnez-vous pour recevoir nos offres exclusives et nouveautés.
            </p>
            <form className="footer-newsletter-form" onSubmit={handleNewsletter}>
              <div className="footer-newsletter-input-wrap">
                <input
                  type="email"
                  placeholder="Votre email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" aria-label="S'abonner">
                  <SendIcon />
                </button>
              </div>
              <label className="footer-newsletter-check">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <span>J'accepte de recevoir des emails promotionnels de SunuMarché</span>
              </label>
            </form>
          </div>

        </div>

        {/* ── Bas du footer ── */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} SunuMarché. Tous droits réservés.</p>

          {/* Logos paiement */}
          <div className="footer-payments">
            <span className="payment-badge visa">VISA</span>
            <span className="payment-badge mastercard">MC</span>
            <span className="payment-badge wave">wave</span>
            <span className="payment-badge om">OM</span>
            <span className="payment-badge apple">Apple Pay</span>
            <span className="payment-badge google">G Pay</span>
          </div>

          {/* WhatsApp support */}
          <a
            href="https://wa.me/221000000000"
            className="footer-whatsapp-btn"
            target="_blank"
            rel="noreferrer"
          >
            <WhatsAppIcon />
            WhatsApp Support
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;