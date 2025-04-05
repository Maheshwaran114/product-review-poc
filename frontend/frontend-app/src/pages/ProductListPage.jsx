import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import '../styles/ProductList.css';

const ProductList = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [search, setSearch] = useState(initialSearch);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Number of products per page
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const loader = useRef(null);
  const navigate = useNavigate();

  // Function to fetch products
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

  // When search query changes, reset products and page number
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    fetchProducts(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Fetch more products when page changes (for pages > 1)
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
        threshold: 0.5,
        rootMargin: '100px',
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

  // Handle search action
  const handleSearch = (query) => {
    setSearch(query);
    // The useEffect will handle resetting and fetching the products when 'search' changes
  };

  // Handle product click to navigate to detail page
  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="product-list">
      {/* SearchBar integration */}
      <div className="search-container">
        <SearchBar onSearch={handleSearch} />
      </div>
      
      <h2>Available Products</h2>
      
      <div className="product-grid">
        {products.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onClick={handleProductClick} 
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
