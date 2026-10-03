import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import PropertyCard from '../components/PropertyCard';
import { getProperties } from '../api/propertyApi';

const Home = () => {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    getProperties({ limit: 6 }).then(res => setFeatured(res.data.data)).catch(console.error);
  }, []);

  const handleSearch = (filters) => {
    const params = new URLSearchParams(filters).toString();
    navigate(`/properties?${params}`);
  };

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary to-indigo-900 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">Find Your Dream Home</h1>
          <p className="text-xl text-blue-100 mb-8">Discover properties with immersive 360° virtual tours and connect with top agents.</p>
        </div>
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Stats */}
      <div className="bg-white py-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-around text-center gap-6">
          <div><div className="text-3xl font-bold text-gray-900">500+</div><div className="text-gray-500">Properties</div></div>
          <div><div className="text-3xl font-bold text-gray-900">50+</div><div className="text-gray-500">Agents</div></div>
          <div><div className="text-3xl font-bold text-gray-900">1000+</div><div className="text-gray-500">Happy Clients</div></div>
          <div><div className="text-3xl font-bold text-gray-900">100+</div><div className="text-gray-500">Virtual Tours</div></div>
        </div>
      </div>

      {/* Featured */}
      <div className="max-w-7xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map(prop => <PropertyCard key={prop.property_id} property={prop} />)}
        </div>
      </div>

      {/* How it works */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 text-primary rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-bold mb-2">Search</h3>
              <p className="text-gray-600">Find properties that match your criteria using our advanced search.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 text-primary rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-bold mb-2">Tour</h3>
              <p className="text-gray-600">Experience immersive 360° virtual tours from the comfort of your home.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 text-primary rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-bold mb-2">Book</h3>
              <p className="text-gray-600">Connect with agents and book in-person site visits effortlessly.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
