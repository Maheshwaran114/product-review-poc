import React from 'react';
import '../styles/ReviewList.css';

const ReviewList = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return <p>No reviews yet.</p>;
  }

  return (
    <ul className="review-list">
      {reviews.map(review => (
        <li key={review.id} className="review-item">
          <div className="review-rating">
            <strong>Rating:</strong> {review.rating}
          </div>
          <div className="review-comment">
            {review.comment}
          </div>
          <div className="review-date">
            {new Date(review.createdAt).toLocaleString()}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ReviewList;