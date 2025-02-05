import React, { useState } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import '../css/SearchSort.css';

const SearchSort = ({ onSearch, onSort }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="search-sort-container">
      <div className="search-wrapper">
        <Search size={20} className="search-icon" />
        <input
          type="text"
          placeholder="Search notes..."
          className="search-input"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="sort-wrapper">
        <Filter size={20} className="filter-icon" />
        <select 
          className="sort-select"
          onChange={(e) => onSort(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="title">Title A-Z</option>
          <option value="type">Type</option>
          <option value="favorite">Favorites</option>
        </select>
        <ChevronDown size={16} className="chevron-icon" />
      </div>
    </div>
  );
};

export default SearchSort;