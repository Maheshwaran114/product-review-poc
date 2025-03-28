import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductSearch from './pages/ProductSearch';
import ProductDetail from './pages/ProductDetail';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Product Review POC</h1>
        <Routes>
          <Route path="/" element={<ProductSearch />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;