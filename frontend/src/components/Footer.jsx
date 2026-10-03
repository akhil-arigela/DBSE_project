import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center text-xl font-bold mb-4">
              <Home className="w-6 h-6 mr-2 text-primary" />
              RealEstate Portal
            </Link>
            <p className="text-gray-400 max-w-sm">
              Your trusted partner in finding the perfect home. Browse listings, take virtual tours, and connect with top agents.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/properties" className="text-gray-400 hover:text-white transition-colors">Properties</Link></li>
              <li><Link to="/agents" className="text-gray-400 hover:text-white transition-colors">Agents</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} RealEstate Portal. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
