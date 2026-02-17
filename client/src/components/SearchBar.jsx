import { useState, useEffect, useRef } from 'react';
import './SearchBar.css';

/**
 * Reusable SearchBar component with dynamic filters
 * @param {Function} onSearch - Callback function that receives {searchTerm, filters}
 * @param {String} placeholder - Placeholder text for search input
 * @param {Array} filters - Array of filter configs [{name, label, type, options}]
 * @param {Boolean} showSort - Whether to show sorting dropdown
 */
const SearchBar = ({ onSearch, placeholder = "Search...", filters = [], showSort = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [sortBy, setSortBy] = useState('');
  const onSearchRef = useRef(onSearch);
  
  // Keep ref updated with latest onSearch callback
  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  // Trigger search when any value changes
  useEffect(() => {
    console.log('🔍 SearchBar: triggering search with:', { searchTerm, activeFilters, sortBy });
    const timer = setTimeout(() => {
      onSearchRef.current({ 
        searchTerm, 
        filters: activeFilters,
        sortBy 
      });
    }, 300); // Debounce search by 300ms

    return () => clearTimeout(timer);
  }, [searchTerm, activeFilters, sortBy]);

  const handleFilterChange = (filterName, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleClearAll = () => {
    setSearchTerm('');
    setActiveFilters({});
    setSortBy('');
  };

  const hasActiveFilters = searchTerm || Object.keys(activeFilters).length > 0 || sortBy;

  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {hasActiveFilters && (
          <button className="clear-all-btn" onClick={handleClearAll} title="Clear all filters">
            ✕
          </button>
        )}
      </div>

      {(filters.length > 0 || showSort) && (
        <div className="filters-container">
          {filters.map((filter) => (
            <div key={filter.name} className="filter-group">
              {filter.type === 'select' && (
                <select
                  className="filter-select"
                  value={activeFilters[filter.name] || ''}
                  onChange={(e) => handleFilterChange(filter.name, e.target.value)}
                >
                  <option value="">{filter.label}</option>
                  {filter.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}

              {filter.type === 'date' && (
                <div className="filter-date-wrapper">
                  <label className="filter-label">{filter.label}</label>
                  <input
                    type="date"
                    className="filter-date"
                    value={activeFilters[filter.name] || ''}
                    onChange={(e) => handleFilterChange(filter.name, e.target.value)}
                  />
                </div>
              )}

              {filter.type === 'dateRange' && (
                <div className="filter-date-range">
                  <label className="filter-label">{filter.label}</label>
                  <div className="date-range-inputs">
                    <input
                      type="date"
                      className="filter-date"
                      placeholder="From"
                      value={activeFilters[`${filter.name}From`] || ''}
                      onChange={(e) => handleFilterChange(`${filter.name}From`, e.target.value)}
                    />
                    <span className="date-separator">to</span>
                    <input
                      type="date"
                      className="filter-date"
                      placeholder="To"
                      value={activeFilters[`${filter.name}To`] || ''}
                      onChange={(e) => handleFilterChange(`${filter.name}To`, e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}

          {showSort && (
            <select
              className="filter-select sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="">Sort By</option>
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="title_asc">Title (A-Z)</option>
              <option value="title_desc">Title (Z-A)</option>
            </select>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
