import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { submitReview } from '../services/api';
import '../styles/ReviewForm.css';

const ReviewForm = ({ productId, onSuccess }) => {
  const [userId, setUserId] = useState(''); // Temporary field for testing
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage('');
    setLoading(true);
    try {
      // Include userId in the payload temporarily
      await submitReview(productId, { userId, rating, comment });
      setMessage('Review submitted successfully!');
      setUserId('');  // Clear userId field after submission
      setRating('');
      setComment('');
      onSuccess(); // Refresh reviews after successful submission
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>User ID:</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Rating:</label>
        <input
          type="number"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          min="1"
          max="5"
          required
        />
      </div>
      <div className="form-group">
        <label>Comment:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={loading}>
        Submit Review
      </button>
      {loading && <p>Submitting review...</p>}
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}
    </form>
  );
};

ReviewForm.propTypes = {
  productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default ReviewForm;
