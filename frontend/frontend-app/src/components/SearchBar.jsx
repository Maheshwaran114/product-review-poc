import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    console.log('SearchBar: Input changed, query:', e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    console.log('SearchBar: Search initiated with query:', trimmedQuery);
    if (onSearch) {
      onSearch(trimmedQuery);
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={handleInputChange}
        aria-label="Search products"
      />
      <button type="submit">Search</button>
    </form>
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default SearchBar;