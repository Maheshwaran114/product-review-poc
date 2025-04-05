import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product, onClick }) => {
  return (
    <div className="product-card" role="button" tabIndex={0} onClick={() => onClick(product.id)}>
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>
    </div>
  );
};

export default ProductCard;
