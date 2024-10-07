import React from 'react';

const Filters = ({ filters, filterOptions, onFilterChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  const handleClearFilters = () => {
    // Reset all filters to 'All'
    const clearedFilters = Object.keys(filters).reduce((acc, key) => {
      acc[key] = 'All';
      return acc;
    }, {});
    onFilterChange(clearedFilters);
  };

  return (
    <div className="filters-container">
      {Object.keys(filterOptions).map((key) => (
        <label key={key}>
          {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}:
          <select name={key} value={filters[key]} onChange={handleChange}>
            <option value="All">All</option>
            {filterOptions[key]?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      ))}
      {/* Clear Filters Button */}
      <button className="clear-filters-button" onClick={handleClearFilters}>
        Clear Filters
      </button>
    </div>
  );
};

export default Filters;
