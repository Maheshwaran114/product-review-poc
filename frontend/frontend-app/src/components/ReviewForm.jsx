import React, { useState } from 'react';
import '../styles/ReviewForm.css';

const ReviewForm = ({ productId, onSuccess }) => {
  const [review, setReview] = useState({ userId: '', rating: '', comment: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [errors, setErrors] = useState({});

  // Validate the form fields
  const validate = () => {
    const formErrors = {};
    if (!review.userId) {
      formErrors.userId = 'User ID is required';
    }
    if (!review.rating) {
      formErrors.rating = 'Rating is required';
    } else if (review.rating < 1 || review.rating > 5) {
      formErrors.rating = 'Rating must be between 1 and 5';
    }
    if (!review.comment) {
      formErrors.comment = 'Comment is required';
    }
    return formErrors;
  };

  // Handle input changes and clear errors for that field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setReview(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Handle form submission with validations, loading state, and error/success notifications
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: parseInt(review.userId, 10),
          rating: parseInt(review.rating, 10),
          comment: review.comment,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to submit review');
      }
      const data = await response.json();
      setMessage({ type: 'success', text: 'Review submitted successfully!' });
      setReview({ userId: '', rating: '', comment: '' });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error submitting review:', error);
      setMessage({ type: 'error', text: 'Error submitting review. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-form">
      <h3>Submit a Review</h3>
      {message.text && <p className={`message ${message.type}`}>{message.text}</p>}
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="userId">User ID</label>
          <input
            type="number"
            name="userId"
            id="userId"
            placeholder="Enter your user ID"
            value={review.userId}
            onChange={handleChange}
            required
          />
          {errors.userId && <span className="error">{errors.userId}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="rating">Rating (1-5)</label>
          <input
            type="number"
            name="rating"
            id="rating"
            placeholder="Enter rating"
            value={review.rating}
            onChange={handleChange}
            required
          />
          {errors.rating && <span className="error">{errors.rating}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="comment">Comment</label>
          <textarea
            name="comment"
            id="comment"
            placeholder="Write your review"
            value={review.comment}
            onChange={handleChange}
            required
          />
          {errors.comment && <span className="error">{errors.comment}</span>}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;