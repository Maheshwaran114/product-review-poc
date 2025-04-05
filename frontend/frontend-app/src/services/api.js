// frontend/frontend-app/src/services/api.js

// Base URL for API calls; uses an environment variable if provided, or defaults to '/api'
const API_BASE = process.env.REACT_APP_API_URL || '/api';

/**
 * Fetch a list of products with optional pagination and search.
 * @param {Object} options - Options for fetching products.
 * @param {number} [options.page=1] - Current page number.
 * @param {number} [options.limit=10] - Number of products per page.
 * @param {string} [options.search=''] - Search query for product names.
 * @returns {Promise<Array>} - Returns an array of products.
 */
export const fetchProducts = async ({ page = 1, limit = 10, search = '' } = {}) => {
  try {
    let url = `${API_BASE}/products?page=${page}&limit=${limit}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in fetchProducts:', error);
    throw error;
  }
};

/**
 * Fetch details for a single product by its ID.
 * @param {number|string} id - The product ID.
 * @returns {Promise<Object>} - Returns the product details object.
 */
export const fetchProductById = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/products/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch product (ID: ${id}): ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in fetchProductById:', error);
    throw error;
  }
};

/**
 * Submit a review for a given product.
 * @param {number|string} productId - The product ID to review.
 * @param {Object} reviewData - The review payload (e.g., { userId, rating, comment }).
 * @returns {Promise<Object>} - Returns the newly created review object.
 */
export const submitReview = async (productId, reviewData) => {
  try {
    const response = await fetch(`${API_BASE}/products/${productId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit review (Product ID: ${productId}): ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in submitReview:', error);
    throw error;
  }
};

/**
 * Create an affiliate token for a given user.
 * @param {number|string} userId - The user ID for affiliate token generation.
 * @returns {Promise<Object>} - Returns an object containing the userId and token.
 */
export const createAffiliateToken = async (userId) => {
  try {
    const response = await fetch(`${API_BASE}/affiliate/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate affiliate token (User ID: ${userId}): ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in createAffiliateToken:', error);
    throw error;
  }
};
