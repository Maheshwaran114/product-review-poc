import React, { useState } from 'react';
import './ReviewForm.css';

const ReviewForm = ({ productId, onSuccess }) => {
  const [review, setReview] = useState({ userId: '', rating: '', comment: '' });
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`/api/products/${productId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review)
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to submit review');
        return res.json();
      })
      .then((data) => {
        setMessage('Review submitted successfully!');
        setReview({ userId: '', rating: '', comment: '' });
        if (onSuccess) onSuccess(); // optional callback
      })
      .catch((error) => {
        console.error('Error submitting review:', error);
        setMessage('Error submitting review.');
      });
  };

  return (
    <div className="review-form">
      <h3>Submit a Review</h3>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="userId"
          placeholder="User ID"
          value={review.userId}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="rating"
          placeholder="Rating (1-5)"
          value={review.rating}
          onChange={handleChange}
          required
        />
        <textarea
          name="comment"
          placeholder="Your review"
          value={review.comment}
          onChange={handleChange}
          required
        />
        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
};

export default ReviewForm;
