import React from 'react';
import { useParams } from 'react-router-dom';

function ProductDetail() {
  const { id } = useParams(); // assuming we'll pass :id in the route

  return (
    <div>
      <h2>Product Detail</h2>
      <p>Details for product ID: {id} (Mock view)</p>
    </div>
  );
}

export default ProductDetail;