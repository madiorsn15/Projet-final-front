import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { API_BASE_URL } from '../utils/api';
import toast from 'react-hot-toast';
import './EditProductPage.css';

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Électronique',
    isAvailable: true
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

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setFetchLoading(true);
      const response = await api.get(`/products/${id}`);
      const product = response.data;

      // Vérifier si l'utilisateur est le propriétaire
      if (product.seller._id !== user._id) {
        toast.error('Vous n\'êtes pas autorisé à modifier ce produit');
        navigate(`/product/${id}`);
        return;
      }

      setFormData({
        name: product.name,
        price: product.price,
        description: product.description,
        category: product.category,
        isAvailable: product.isAvailable
      });

      if (product.image) {
        setOriginalImage(`${API_BASE_URL}${product.image}`);
        setImagePreview(`${API_BASE_URL}${product.image}`);
      }

    } catch (error) {
      console.error('Erreur chargement produit:', error);
      toast.error('Produit non trouvé ou erreur de chargement');
      navigate('/dashboard');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
      submitData.append('isAvailable', formData.isAvailable);

      // Ajouter l'image si elle a été changée
      const imageInput = document.getElementById('product-image');
      if (imageInput.files[0]) {
        submitData.append('image', imageInput.files[0]);
      }

      await api.put(`/products/${id}`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Produit modifié avec succès !');
      navigate(`/product/${id}`);

    } catch (error) {
      console.error('Erreur modification produit:', error);
      const apiErrors = error.response?.data?.errors;
      if (Array.isArray(apiErrors) && apiErrors.length > 0) {
        toast.error(apiErrors[0].message || 'Données invalides');
      } else {
        toast.error(error.response?.data?.message || 'Erreur lors de la modification du produit');
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="edit-product-page">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Chargement du produit...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-product-page">
      <div className="container">
        <div className="page-header">
          <div className="header-inner">
            <div className="header-content">
              <div className="header-icon">📝</div>
              <div>
                <h1>Modifier le produit</h1>
                <p>Mettez à jour les informations de votre produit</p>
              </div>
            </div>
            <div className="header-actions">
              <button
                onClick={() => navigate(`/product/${id}`)}
                className="back-btn"
              >
                Voir le produit
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="back-btn"
              >
                Tableau de bord
              </button>
            </div>
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

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleInputChange}
                  />
                  <span className="checkmark"></span>
                  Produit disponible à la vente
                </label>
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
                  {originalImage && (
                    <p className="current-image-info">
                      <small>Image actuelle : Conservez l'image existante ou téléchargez une nouvelle image</small>
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate(`/product/${id}`)}
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
                    Modification en cours...
                  </>
                ) : (
                  <>
                    Enregistrer les modifications
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

export default EditProductPage;
