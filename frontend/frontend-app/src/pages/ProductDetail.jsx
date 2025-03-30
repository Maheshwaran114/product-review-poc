import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState({ userId: '', rating: '', comment: '' });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching product:', error);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`/api/products/${id}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review)
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage('Review submitted successfully!');
        setReview({ userId: '', rating: '', comment: '' });
      })
      .catch((error) => {
        console.error('Error submitting review:', error);
        setMessage('Error submitting review.');
      });
  };

  if (loading) return <p>Loading product...</p>;

  return (
    <div className="product-detail">
      <h2>{product.name}</h2>
      <p><strong>Description:</strong> {product.description}</p>
      <p><strong>Price:</strong> ${product.price}</p>

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
}

export default ProductDetail;