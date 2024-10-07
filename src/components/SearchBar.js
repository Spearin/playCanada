import React from 'react';

const SearchBar = ({ onSearch, onReset }) => {
  return (
    <div className="search-bar">
      <input
        className="search-bar-input"
        type="text"
        placeholder="Search for games..."
        onChange={(e) => onSearch(e.target.value)}
      />
      <button className="reset-button" onClick={onReset}>
        Reset
      </button>
    </div>
  );
};

export default SearchBar;
