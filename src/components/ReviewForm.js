import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import './ReviewForm.css';

const ReviewForm = ({ productId, onReviewCreated }) => {
  const { isAuthenticated } = useAuth();
  const [rating, setRating]         = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment]       = useState('');
  const [loading, setLoading]       = useState(false);
  const [canReview, setCanReview]   = useState(null); // null = chargement
  const [checkMsg, setCheckMsg]     = useState('');

  // ✅ Vérifie si l'utilisateur peut noter dès le chargement
  useEffect(() => {
    if (!isAuthenticated || !productId) return;
    const check = async () => {
      try {
        const res = await api.get(`/api/reviews/can-review/${productId}`);
        setCanReview(res.data.canReview);
        if (res.data.hasReview) {
          setCheckMsg('Vous avez déjà laissé un avis pour ce produit.');
        } else if (!res.data.hasOrder) {
          setCheckMsg('Vous devez avoir reçu ce produit pour laisser un avis.');
        }
      } catch {
        setCanReview(false);
      }
    };
    check();
  }, [isAuthenticated, productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Veuillez sélectionner une note.');
      return;
    }
    if (comment.trim().length < 10) {
      toast.error('Le commentaire doit contenir au moins 10 caractères.');
      return;
    }
    try {
      setLoading(true);
      const res = await api.post('/api/reviews', { productId, rating, comment });
      toast.success(res.data.message);
      setRating(0);
      setComment('');
      setCanReview(false);
      setCheckMsg('Vous avez déjà laissé un avis pour ce produit.');
      if (onReviewCreated) onReviewCreated(res.data.review);
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de la création de l'avis.");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () =>
    Array.from({ length: 5 }, (_, i) => {
      const val = i + 1;
      return (
        <span
          key={i}
          className={`review-star ${(hoverRating || rating) >= val ? 'filled' : 'empty'} interactive`}
          onClick={() => setRating(val)}
          onMouseEnter={() => setHoverRating(val)}
          onMouseLeave={() => setHoverRating(0)}
        >
          ★
        </span>
      );
    });

  // Non connecté
  if (!isAuthenticated) {
    return (
      <div className="review-form-container">
        <p className="review-form-login-message">
          Connectez-vous pour laisser un avis sur ce produit.
        </p>
      </div>
    );
  }

  // Chargement de la vérification
  if (canReview === null) {
    return (
      <div className="review-form-container">
        <p className="review-form-login-message">Vérification en cours...</p>
      </div>
    );
  }

  // Ne peut pas noter
  if (!canReview) {
    return (
      <div className="review-form-container">
        <p className="review-form-login-message">{checkMsg}</p>
      </div>
    );
  }

  return (
    <div className="review-form-container">
      <h3 className="review-form-title">Laisser un avis</h3>
      <form className="review-form" onSubmit={handleSubmit}>
        <div className="review-form-rating">
          <label className="review-form-label">Note</label>
          <div className="review-form-stars">{renderStars()}</div>
          {rating > 0 && (
            <span className="review-form-rating-label">
              {['', 'Très mauvais', 'Mauvais', 'Correct', 'Bien', 'Excellent'][rating]}
            </span>
          )}
        </div>
        <div className="review-form-comment">
          <label className="review-form-label" htmlFor="comment">Commentaire</label>
          <textarea
            id="comment"
            className="review-form-textarea"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Partagez votre expérience avec ce produit..."
            minLength="10"
            maxLength="500"
            rows="4"
          />
          <div className="review-form-char-count">{comment.length}/500 caractères</div>
        </div>
        <button type="submit" className="review-form-submit" disabled={loading || rating === 0}>
          {loading ? 'Publication en cours...' : 'Publier mon avis'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;