const API_BASE = process.env.REACT_APP_API_URL || '/api';

export const fetchProducts = async () => {
  try {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error(`Failed to fetch products: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error("Error in fetchProducts:", error);
    throw error;
  }
};

export const fetchProductById = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch product: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error("Error in fetchProductById:", error);
    throw error;
  }
};

export const submitReview = async (productId, reviewData) => {
  try {
    const res = await fetch(`${API_BASE}/products/${productId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });
    if (!res.ok) throw new Error(`Failed to submit review: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error("Error in submitReview:", error);
    throw error;
  }
};

export const createAffiliateToken = async (userId) => {
  try {
    const res = await fetch(`${API_BASE}/affiliate/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    if (!res.ok) throw new Error(`Failed to generate affiliate token: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error("Error in createAffiliateToken:", error);
    throw error;
  }
};