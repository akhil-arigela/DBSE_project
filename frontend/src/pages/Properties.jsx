import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import PropertyCard from '../components/PropertyCard';
import { getProperties } from '../api/propertyApi';

const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const filters = Object.fromEntries(searchParams.entries());
      const res = await getProperties(filters);
      setProperties(res.data.data || []);
      setPagination(res.data.pagination || null);
    } catch (error) {
      console.error(error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProperties(); }, [searchParams]);

  const handleSearch = (filters) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => { if (val) params.set(key, val); });
    params.delete('page');
    setSearchParams(params);
  };

  const goToPage = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page);
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <SearchBar onSearch={handleSearch} initialFilters={Object.fromEntries(searchParams.entries())} />
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {pagination ? `${pagination.totalItems} Properties Found` : 'Properties'}
        </h2>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-xl h-72 animate-pulse" />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <div className="text-6xl mb-4">🏠</div>
          <p className="text-xl font-semibold mb-2">No properties found</p>
          <p className="text-sm">Try adjusting your search filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(p => <PropertyCard key={p.property_id} property={p} />)}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-10 flex justify-center items-center gap-2">
          <button
            disabled={pagination.currentPage <= 1}
            onClick={() => goToPage(pagination.currentPage - 1)}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-40"
          >← Prev</button>
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`w-10 h-10 rounded-lg font-medium ${page === pagination.currentPage ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >{page}</button>
          ))}
          <button
            disabled={pagination.currentPage >= pagination.totalPages}
            onClick={() => goToPage(pagination.currentPage + 1)}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-40"
          >Next →</button>
        </div>
      )}
    </div>
  );
};

export default Properties;
