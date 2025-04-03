import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReviewForm from './ReviewForm';
import SearchBar from './SearchBar';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams(); // Get product id from URL parameters
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [errorProduct, setErrorProduct] = useState(null);
  const [errorReviews, setErrorReviews] = useState(null);

  // Function to handle search action; navigates to the product list with a search query
  const handleSearch = (query) => {
    navigate(`/products?search=${encodeURIComponent(query)}`);
  };

  // Fetch product details from the API
  const fetchProduct = async () => {
    setLoadingProduct(true);
    setErrorProduct(null);
    try {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) {
        throw new Error('Failed to fetch product');
      }
      const data = await res.json();
      setProduct(data);
    } catch (err) {
      setErrorProduct(err.message);
    }
    setLoadingProduct(false);
  };

  // Fetch reviews for the product from the API
  const fetchReviews = async () => {
    setLoadingReviews(true);
    setErrorReviews(null);
    try {
      const res = await fetch(`/api/products/${id}/reviews`);
      if (!res.ok) {
        throw new Error('Failed to fetch reviews');
      }
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      setErrorReviews(err.message);
    }
    setLoadingReviews(false);
  };

  // Run fetch operations when the component mounts or when the id changes
  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  return (
    <div className="product-detail">
      {/* Container for SearchBar to aid styling */}
      <div className="search-container">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Back button for navigation */}
      <button onClick={() => navigate(-1)} className="back-button">
        Back to Products
      </button>

      {loadingProduct ? (
        <p>Loading product details...</p>
      ) : errorProduct ? (
        <p className="error">{errorProduct}</p>
      ) : product ? (
        <div className="product-info">
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>
        </div>
      ) : (
        <p>Product not found.</p>
      )}

      <div className="reviews-section">
        <h3>Reviews</h3>
        {loadingReviews ? (
          <p>Loading reviews...</p>
        ) : errorReviews ? (
          <p className="error">{errorReviews}</p>
        ) : reviews.length > 0 ? (
          <ul>
            {reviews.map(review => (
              <li key={review.id}>
                <p><strong>Rating:</strong> {review.rating}</p>
                <p>{review.comment}</p>
                <p><em>{new Date(review.createdAt).toLocaleString()}</em></p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>

      <div className="review-form-section">
        <h3>Submit a Review</h3>
        {/* onSuccess callback refetches reviews after a new submission */}
        <ReviewForm productId={id} onSuccess={fetchReviews} />
      </div>
    </div>
  );
};

export default ProductDetail;