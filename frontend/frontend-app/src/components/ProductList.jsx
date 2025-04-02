import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Number of products per page
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch products whenever page or search changes
  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `/api/products?page=${page}&limit=${limit}`;
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleProductClick = (id) => {
    // Implement navigation or detailed view logic here
    console.log('Product clicked with ID:', id);
  };

  const handleNextPage = () => {
    setPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on search change
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // fetchProducts is triggered automatically by useEffect when 'search' state changes
  };

  return (
    <div className="product-list">
      <h2>Product List</h2>
      <form onSubmit={handleSearchSubmit} className="search-form">
        <input 
          type="text" 
          placeholder="Search products..." 
          value={search} 
          onChange={handleSearchChange}
        />
        <button type="submit">Search</button>
      </form>
      {loading && <p>Loading products...</p>}
      {error && <p className="error">{error}</p>}
      <div className="product-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} onClick={handleProductClick} />
        ))}
      </div>
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={page === 1}>Prev</button>
        <span>Page {page}</span>
        <button onClick={handleNextPage}>Next</button>
      </div>
    </div>
  );
};

export default ProductList;