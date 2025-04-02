import React, { useState } from 'react';
import './AffiliateDisplay.css';

const AffiliateDisplay = ({ token, userId }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy token:', error);
    }
  };

  return (
    <div className="affiliate-display">
      <h3>Affiliate Token</h3>
      <div className="affiliate-token-card">
        <p className="token">{token}</p>
        <button onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy Token'}
        </button>
      </div>
      {userId && <p className="user-id">User ID: {userId}</p>}
    </div>
  );
};

export default AffiliateDisplay;