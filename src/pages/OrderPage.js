import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { API_BASE_URL } from '../utils/api';
import toast from 'react-hot-toast';
import './OrderPage.css';

const STEPS = ['Produit', 'Livraison', 'Confirmation'];

const OrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(2); // Démarrage à l'étape 2 (Livraison) comme sur l'image
  const [orderSuccess, setOrderSuccess] = useState(null);

  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    address: '',
    quantity: 1,
    notes: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour passer une commande');
      navigate('/login');
      return;
    }
    loadProduct();
  }, [id, isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        clientName: user.name || '',
        clientPhone: user.phone || user.whatsapp || ''
      }));
    }
  }, [user]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${id}`);
      const productData = response.data.product;
      productData.price = parseFloat(productData?.price) || 0;
      setProduct(productData);
    } catch (error) {
      toast.error('Produit non trouvé');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => {
    const unitPrice = parseFloat(product?.price) || 0;
    const quantity = parseInt(formData?.quantity) || 1;
    return unitPrice * quantity;
  };

  const formatPrice = (price) => {
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || !isFinite(numericPrice)) return '0 FCFA';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(numericPrice).replace('XOF', 'FCFA');
  };

  const handleQuickWhatsApp = () => {
    const sellerPhone = product.seller?.whatsapp || product.sellerPhone;
    if (!sellerPhone) {
      toast.error('Numéro WhatsApp non disponible pour ce vendeur');
      return;
    }
    const message = `Bonjour, je suis intéressé par votre produit : ${product.name}\n\nPrix: ${formatPrice(product.price)}\n\nLien: ${window.location.origin}/product/${product._id}`;
    window.open(`https://wa.me/${sellerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product.isAvailable) {
      toast.error("Ce produit n'est pas disponible");
      return;
    }
    if (!formData.clientName || !formData.clientPhone || !formData.address) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    setSubmitting(true);
    try {
      const orderData = {
        productId: product._id,
        clientName: formData.clientName,
        phone: formData.clientPhone,
        address: formData.address,
        quantity: formData.quantity,
        totalPrice: (parseFloat(product.price) || 0) * parseInt(formData.quantity || 1),
        notes: formData.notes
      };
      const response = await api.post('/orders', orderData);
      setOrderSuccess(response.data.order || orderData);
      setCurrentStep(3);
      toast.success('Commande passée avec succès !');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la commande');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="order-page-v3 loading-container">
        <div className="spinner-v3"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="order-page-v3">
      {/* ── Header fixe avec Stepper ── */}
      <header className="order-header-v3">
        <div className="header-top-v3">
          <button onClick={() => navigate(`/product/${id}`)} className="back-link-v3">
            ← Retour au produit
          </button>
          <h1 className="white-text-v3">Passer une commande</h1>
          <div className="placeholder-v3"></div>
        </div>

        <div className="order-stepper-v3">
          <div className="stepper-track-v3">
            {STEPS.map((label, index) => {
              const step = index + 1;
              const isDone = currentStep > step;
              const isActive = currentStep === step;
              return (
                <React.Fragment key={label}>
                  <div className={`step-v3 ${isDone ? 'done' : isActive ? 'active' : 'disabled'}`}>
                    <span className="step-num-v3">{isDone ? '✓' : step}</span>
                    <div className="step-label-v3">
                      <span className="step-tag-v3">ÉTAPE {step}</span>
                      <strong>{label}</strong>
                    </div>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`step-divider-v3 ${currentStep > step ? 'active' : ''}`}></div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </header>

      {/* ── Contenu Principal ── */}
      <main className="order-main-v3">
        {currentStep === 3 ? (
          <section className="order-confirmation-v3">
            <div className="confirmation-card-v3">
              <span className="checkmark-v3">✓</span>
              <h2>Commande confirmée !</h2>
              <p>Votre demande a bien été envoyée au vendeur. Vous pouvez suivre l'état de votre commande depuis votre espace.</p>

              <div className="confirmation-details-v3">
                <div>
                  <span>Produit</span>
                  <strong>{product.name}</strong>
                </div>
                <div>
                  <span>Quantité</span>
                  <strong>{formData.quantity}</strong>
                </div>
                <div>
                  <span>Total estimé</span>
                  <strong>{formatPrice(calculateTotal())}</strong>
                </div>
                <div>
                  <span>Adresse de livraison</span>
                  <strong>{formData.address}</strong>
                </div>
              </div>

              <div className="confirmation-actions-v3">
                <button className="btn-confirm-v3" onClick={() => navigate('/orders')}>
                  Voir mes commandes
                </button>
                <button className="btn-cancel-v3" onClick={() => navigate('/products')}>
                  Retour à l'accueil
                </button>
              </div>
            </div>
          </section>
        ) : (
          <div className="order-grid-v3">
          
          {/* COLONNE GAUCHE : RÉSUMÉ PRODUIT */}
          <aside className="order-summary-side-v3">
            <div className="summary-product-card-v3">
              <div className="summary-img-wrapper-v3">
                {product.image ? (
                  <img src={`${API_BASE_URL}${product.image}`} alt={product.name} />
                ) : (
                  <div className="no-img-v3">📦</div>
                )}
              </div>
              <div className="summary-product-info-v3">
                <span className="cat-badge-v3">{product.category}</span>
                <h3>{product.name}</h3>
                <span className="seller-v3">Vendeur: {product.seller?.name || 'Vendeur'}</span>
                <div className="summary-price-v3">{formatPrice(product.price)}</div>
              </div>
            </div>

            <div className="billing-box-v3">
              <div className="billing-row-v3">
                <span>Prix unitaire</span>
                <span>{formatPrice(product.price)}</span>
              </div>
              <div className="billing-row-v3">
                <span>Quantité</span>
                <span>{formData.quantity}</span>
              </div>
              <div className="billing-row-v3">
                <span>Livraison</span>
                <span className="free-v3">Gratuite</span>
              </div>
              <div className="billing-divider-v3"></div>
              <div className="billing-row-v3 total-v3">
                <span>Total</span>
                <span>{formatPrice(calculateTotal())}</span>
              </div>
            </div>

            <div className="contact-box-v3">
              <div className="contact-header-v3">
                <span className="wa-icon-v3">💬</span>
                <div>
                  <strong>Contact direct</strong>
                  <p>Parler au vendeur sans formulaire</p>
                </div>
              </div>
              <button onClick={handleQuickWhatsApp} className="btn-wa-v3">
                WhatsApp — Contacter le vendeur
              </button>
            </div>
          </aside>

          {/* COLONNE DROITE : FORMULAIRE */}
          <section className="order-form-side-v3">
            <div className="form-header-v3">
              <span className="location-icon-v3">📍</span>
              <h2>Informations de livraison</h2>
            </div>

            <form onSubmit={handleSubmit} className="premium-form-v3">
              <div className="form-group-v3">
                <label>NOM COMPLET *</label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  placeholder="Madior Sane"
                  required
                />
              </div>

              <div className="form-row-v3">
                <div className="form-group-v3">
                  <label>TÉLÉPHONE *</label>
                  <input
                    type="tel"
                    name="clientPhone"
                    value={formData.clientPhone}
                    onChange={handleChange}
                    placeholder="+221 77 508 84 70"
                    required
                  />
                </div>
                <div className="form-group-v3 quantity-v3">
                  <label>QUANTITÉ</label>
                  <div className="quantity-selector-v3">
                    <button 
                      type="button" 
                      onClick={() => setFormData(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}
                      className="qty-btn-v3"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      min="1"
                      required
                    />
                    <button 
                      type="button" 
                      onClick={() => setFormData(prev => ({ ...prev, quantity: prev.quantity + 1 }))}
                      className="qty-btn-v3"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="form-group-v3">
                <label>ADRESSE DE LIVRAISON *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Quartier, rue, point de repère..."
                  required
                ></textarea>
              </div>

              <div className="form-group-v3">
                <label>NOTES <span>(OPTIONNEL)</span></label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Instructions spéciales pour la livraison..."
                ></textarea>
              </div>

              <div className="form-actions-v3">
                <button type="button" onClick={() => navigate(-1)} className="btn-cancel-v3">
                  ← Annuler
                </button>
                <button type="button" onClick={handleQuickWhatsApp} className="btn-wa-footer-v3">
                  <span className="wa-icon-v3">💬</span> WhatsApp
                </button>
                <button type="submit" className="btn-confirm-v3" disabled={submitting}>
                  Confirmer la commande →
                </button>
              </div>
            </form>
          </section>
        </div>
        )}
      </main>
      </div>
    );
};

export default OrderPage;
