import React from 'react';
import './ReviewList.css';

const ReviewList = ({ reviews, stats }) => {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      const isFilled = rating >= starValue;
      return (
        <span
          key={i}
          className={`review-list-star ${isFilled ? 'filled' : 'empty'}`}
        >
          ★
        </span>
      );
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div className="review-list-container">
        <div className="review-list-empty">
          <p>Aucun avis pour l'instant.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="review-list-container">
      <div className="review-list-header">
        <div className="review-list-stats">
          <div className="review-list-average">
            <span className="review-list-average-number">{stats?.averageRating || 0}</span>
            <div className="review-list-stars">
              {renderStars(Math.round(stats?.averageRating || 0))}
            </div>
          </div>
          <div className="review-list-count">
            {stats?.count || 0} avis
          </div>
        </div>
      </div>
      <div className="review-list-items">
        {reviews.map((review) => (
          <div key={review._id} className="review-list-item">
            <div className="review-list-item-header">
              <div className="review-list-item-user">
                <div className="review-list-item-avatar">
                  {review.buyerId?.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div className="review-list-item-info">
                  <span className="review-list-item-name">
                    {review.buyerId?.name || 'Utilisateur'}
                  </span>
                  <span className="review-list-item-date">
                    {formatDate(review.createdAt)}
                  </span>
                </div>
              </div>
              <div className="review-list-item-rating">
                {renderStars(review.rating)}
              </div>
            </div>
            <p className="review-list-item-comment">
              {review.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
