import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReviewForm from '../components/ReviewForm';
import SearchBar from '../components/SearchBar';
import { fetchProductById } from '../services/api';
import '../styles/ProductDetail.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [errorProduct, setErrorProduct] = useState(null);
  const [errorReviews, setErrorReviews] = useState(null);

  // Handle search action to navigate back to product list with a search query
  const handleSearch = (query) => {
    navigate(`/products?search=${encodeURIComponent(query)}`);
  };

  // Fetch product details from API
  const fetchProduct = async () => {
    setLoadingProduct(true);
    setErrorProduct(null);
    try {
      const data = await fetchProductById(id);
      setProduct(data);
    } catch (err) {
      setErrorProduct(err.message);
    }
    setLoadingProduct(false);
  };

  // Fetch reviews from API
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

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  return (
    <div className="product-detail">
      <div className="search-container">
        <SearchBar onSearch={handleSearch} />
      </div>

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
          <p>
            <strong>Price:</strong> ${product.price.toFixed(2)}
          </p>
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
            {reviews.map((review) => (
              <li key={review.id}>
                <p>
                  <strong>Rating:</strong> {review.rating}
                </p>
                <p>{review.comment}</p>
                <p>
                  <em>{new Date(review.createdAt).toLocaleString()}</em>
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>

      <div className="review-form-section">
        <h3>Submit a Review</h3>
        <ReviewForm productId={id} onSuccess={fetchReviews} />
      </div>
    </div>
  );
};

export default ProductDetailPage;
