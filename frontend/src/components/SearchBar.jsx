import { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearch, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    listing_type: '',
    min_price: '',
    max_price: '',
    ...initialFilters
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-lg flex flex-col md:flex-row gap-4 items-center w-full max-w-5xl mx-auto">
      <div className="flex-1 w-full relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Search by city or title..."
          className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      
      <select name="type" value={filters.type} onChange={handleChange} className="w-full md:w-auto px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-700">
        <option value="">All Types</option>
        <option value="House">House</option>
        <option value="Apartment">Apartment</option>
        <option value="Condo">Condo</option>
        <option value="Villa">Villa</option>
        <option value="Plot">Plot</option>
        <option value="Commercial">Commercial</option>
      </select>

      <select name="listing_type" value={filters.listing_type} onChange={handleChange} className="w-full md:w-auto px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-700">
        <option value="">All Status</option>
        <option value="Sale">For Sale</option>
        <option value="Rent">For Rent</option>
      </select>

      <div className="flex w-full md:w-auto gap-2">
        <input type="number" name="min_price" value={filters.min_price} onChange={handleChange} placeholder="Min ₹" className="w-1/2 md:w-24 px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        <input type="number" name="max_price" value={filters.max_price} onChange={handleChange} placeholder="Max ₹" className="w-1/2 md:w-24 px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>

      <button type="submit" className="w-full md:w-auto bg-primary hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-medium transition-colors">
        Search
      </button>
    </form>
  );
};

export default SearchBar;
