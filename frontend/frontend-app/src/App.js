import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import ProductList from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage'; // Updated import

function App() {
  return (
    <div className="App">
      <h1>Product Review POC</h1>
      <nav>
        <Link to="/products">Product List</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
      </Routes>
    </div>
  );
}

export default App;
