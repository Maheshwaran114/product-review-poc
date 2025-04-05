import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import { fetchProducts } from '../services/api';
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

  const loadProducts = async (reset = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProducts({ page, limit, search });
      if (reset) {
        setProducts(data);
      } else {
        setProducts(prev => [...prev, ...data]);
      }
      setHasMore(data.length === limit);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // When search changes, reset products, page, and fetch new data
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    loadProducts(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Load more products when page changes (for page > 1)
  useEffect(() => {
    if (page > 1) {
      loadProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          console.log('Loader visible. Fetching next page...');
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

  // Handle search action from SearchBar
  const handleSearch = (query) => {
    setSearch(query);
  };

  // Navigate to product detail page when a product is clicked
  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="product-list">
      {/* Search Bar integration */}
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
      <div ref={loader} className="loader" style={{ height: '50px', backgroundColor: 'rgba(255,0,0,0.2)' }}></div>
    </div>
  );
};

export default ProductList;
