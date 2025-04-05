import React from 'react';
import '../styles/Alert.css';

const Alert = ({ type = 'success', message }) => {
  if (!message) return null;

  return (
    <div className={`alert ${type}`}>
      {message}
    </div>
  );
};

export default Alert;
