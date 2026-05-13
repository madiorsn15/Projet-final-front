import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import './AddProductPage.css';

const AddProductPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Électronique'
  });

  const categories = [
    'Électronique',
    'Vêtements',
    'Maison & Jardin',
    'Sports & Loisirs',
    'Beauté & Santé',
    'Alimentation',
    'Livres',
    'Jeux & Jouets',
    'Automobiles',
    'Autres'
  ];

  // Vérifier si l'utilisateur est vendeur
  if (!user || user.role !== 'vendeur') {
    return (
      <div className="add-product-page">
        <div className="container">
          <div className="access-denied">
            <div className="denied-icon">🚫</div>
            <h2>Accès réservé aux vendeurs</h2>
            <p>Vous devez être inscrit en tant que vendeur pour ajouter des produits.</p>
            <button
              onClick={() => navigate('/register')}
              className="btn btn-primary"
            >
              Devenir vendeur
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validation de l'image
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        toast.error('Format d\'image non supporté. Utilisez JPG, PNG ou WebP.');
        return;
      }

      if (file.size > maxSize) {
        toast.error('L\'image est trop lourde. Maximum 5 Mo.');
        return;
      }

      // Créer la prévisualisation
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const trimmedName = formData.name.trim();
    const trimmedDescription = formData.description.trim();
    const parsedPrice = parseFloat(formData.price);

    if (!trimmedName) {
      toast.error('Le nom du produit est requis');
      return;
    }

    if (trimmedName.length < 2) {
      toast.error('Le nom du produit doit contenir au moins 2 caractères');
      return;
    }

    if (!formData.price || Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      toast.error('Le prix doit être supérieur à 0');
      return;
    }

    if (!trimmedDescription) {
      toast.error('La description est requise');
      return;
    }

    if (trimmedDescription.length < 10) {
      toast.error('La description doit contenir au moins 10 caractères');
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('name', trimmedName);
      submitData.append('price', parsedPrice);
      submitData.append('description', trimmedDescription);
      submitData.append('category', formData.category);

      // Ajouter l'image si elle existe
      const imageInput = document.getElementById('product-image');
      if (imageInput.files[0]) {
        submitData.append('image', imageInput.files[0]);
      }

      const response = await api.post('/products', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Produit ajouté avec succès !');
      navigate('/dashboard');

    } catch (error) {
      console.error('Erreur ajout produit:', error);
      const apiErrors = error.response?.data?.errors;
      if (Array.isArray(apiErrors) && apiErrors.length > 0) {
        toast.error(apiErrors[0].message || 'Données invalides');
      } else {
        toast.error(error.response?.data?.message || 'Erreur lors de l\'ajout du produit');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-page">
      <div className="container">
        <div className="page-header">
          <div className="header-inner">
            <div className="header-content">
              <div className="header-icon">📦</div>
              <div>
                <h1>Ajouter un nouveau produit</h1>
                <p>Mettez votre produit en vente sur SunuMarché</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="back-btn"
            >
              ← Retour au tableau de bord
            </button>
          </div>
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-section">
              <h2>Informations du produit</h2>

              <div className="form-group">
                <label htmlFor="name">Nom du produit *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: iPhone 15 Pro Max"
                  required
                  maxLength="100"
                />
                <small>{formData.name.length}/100 caractères</small>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Prix (FCFA) *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">Catégorie *</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Décrivez votre produit en détail..."
                  rows="6"
                  required
                  maxLength="1000"
                />
                <small>{formData.description.length}/1000 caractères</small>
              </div>
            </div>

            <div className="form-section">
              <h2>Image du produit</h2>
              <div className="image-upload">
                <div className="upload-area">
                  <input
                    type="file"
                    id="product-image"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="product-image" className="upload-label">
                    {imagePreview ? (
                      <div className="image-preview">
                        <img src={imagePreview} alt="Aperçu" />
                        <div className="preview-overlay">
                          <span>Changer l'image</span>
                        </div>
                      </div>
                    ) : (
                      <div className="upload-placeholder">
                        <div className="upload-icon">📷</div>
                        <div className="upload-text">
                          <strong>Cliquez pour ajouter une image</strong>
                          <small>JPG, PNG, WebP • Max 5 Mo</small>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
                <div className="image-tips">
                  <h4>Conseils pour de belles photos :</h4>
                  <ul>
                    <li>Utilisez un fond neutre</li>
                    <li>Prenez la photo en journée</li>
                    <li>Montrez le produit sous tous les angles</li>
                    <li>Évitez les flashs directs</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn btn-secondary"
                disabled={loading}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Publication en cours...
                  </>
                ) : (
                  <>
                    📤 Publier le produit
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;