import React, { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard';
import SearchBar from './SearchBar';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Number of products per page
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const loader = useRef(null);

  // Function to fetch products; if reset is true, replaces current products
  const fetchProducts = async (reset = false) => {
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
      if (reset) {
        setProducts(data);
      } else {
        setProducts(prev => [...prev, ...data]);
      }
      // If fewer products than limit, assume no more products are available
      setHasMore(data.length === limit);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Reset products and page when search query changes
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    fetchProducts(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Fetch more products when page changes (except when page is 1 which is handled in the search effect)
  useEffect(() => {
    if (page === 1) return;
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Intersection Observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage(prev => prev + 1);
        }
      },
      {
        threshold: 0.5,       // Trigger when 50% of the loader is visible
        rootMargin: '100px',  // Trigger earlier by adding margin around the viewport
      }
    );
    if (loader.current) {
      observer.observe(loader.current);
    }
    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [hasMore, loading]);

  // Handle search query from SearchBar component
  const handleSearch = (query) => {
    setSearch(query);
  };

  return (
    <div className="product-list">
      {/* Sticky SearchBar positioned in the middle of the page */}
      <div className="search-bar-container">
        <SearchBar onSearch={handleSearch} />
      </div>
      <div className="product-grid">
        {products.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onClick={(id) => console.log('Product clicked:', id)} 
          />
        ))}
      </div>
      {error && <p className="error">{error}</p>}
      {loading && <p>Loading...</p>}
      {/* Loader element for triggering infinite scroll */} 
      <div ref={loader} className="loader"></div>
    </div>
  );
};

export default ProductList;