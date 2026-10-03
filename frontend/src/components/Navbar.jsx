import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Menu, X, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-primary font-bold text-xl">
              <Home className="w-6 h-6 mr-2" />
              RealEstate Portal
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/properties" className="text-gray-600 hover:text-primary transition-colors">Properties</Link>
            <Link to="/agents" className="text-gray-600 hover:text-primary transition-colors">Agents</Link>
            
            {!isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-primary font-medium">Login</Link>
                <Link to="/register" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors">Register</Link>
              </div>
            ) : (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-primary">
                  <UserIcon className="w-5 h-5" />
                  <span>{user?.name || 'Account'}</span>
                  {user?.role && (
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded-full uppercase tracking-wider">{user.role}</span>
                  )}
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block border border-gray-100">
                  <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</Link>
                  {(user?.role === 'seller' || user?.role === 'agent') && (
                    <Link to="/dashboard/my-properties" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Properties</Link>
                  )}
                  <Link to="/dashboard/bookings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Bookings</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Logout</button>
                </div>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/properties" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">Properties</Link>
            <Link to="/agents" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">Agents</Link>
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">Login</Link>
                <Link to="/register" className="block px-3 py-2 text-primary font-medium hover:bg-gray-100 rounded-md">Register</Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">Dashboard</Link>
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100 rounded-md">Logout</button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
