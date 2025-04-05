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

  // Effect to handle search changes explicitly (always fetch page 1)
  useEffect(() => {
    const fetchForSearch = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `/api/products?page=1&limit=${limit}`;
        if (search) {
          url += `&search=${encodeURIComponent(search)}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
        setHasMore(data.length === limit);
        setPage(1);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };
    fetchForSearch();
  }, [search, limit]);

  // Effect to load additional products when page increases (for pages > 1)
  useEffect(() => {
    if (page === 1) return; // Page 1 is already fetched in the search effect
    const loadMore = async () => {
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
        setProducts(prev => [...prev, ...data]);
        setHasMore(data.length === limit);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };
    loadMore();
  }, [page, limit, search]);

  // Intersection Observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          console.log('Loader is visible. Fetching next page...');
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

  // Handle search action from the SearchBar
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
      
      {/* Loader element for triggering infinite scroll */}
      <div ref={loader} className="loader" style={{ height: '50px', backgroundColor: 'rgba(255,0,0,0.2)' }}></div>
    </div>
  );
};

export default ProductList;
