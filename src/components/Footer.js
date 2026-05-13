import React from 'react';
import './Footer.css?v=20';

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

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">

          <div className="footer-section">
            <h3>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <ShopLogo />
                Sunu<span>Marché</span>
              </span>
            </h3>
            <p>Votre marketplace sénégalaise de confiance pour acheter et vendre en toute simplicité.</p>
            <span className="footer-badge">🇸🇳 Made in Sénégal</span>
          </div>

          <div className="footer-section">
            <h4>Navigation</h4>
            <ul>
              <li><a href="/products">Produits</a></li>
              <li><a href="/about">À propos</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="/help">Aide</a></li>
              <li><a href="/terms">Conditions d'utilisation</a></li>
              <li><a href="/privacy">Confidentialité</a></li>
            </ul>
          </div>

        </div>

        <div className="footer-bottom">
          <p>© 2026 SunuMarché. Tous droits réservés.</p>
          <a
            href="https://wa.me/221000000000"
            className="footer-bottom-whatsapp"
            target="_blank"
            rel="noreferrer"
          >
            ● WhatsApp support
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;