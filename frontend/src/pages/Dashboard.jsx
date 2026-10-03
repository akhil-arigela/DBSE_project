import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Home, Calendar, Users, Settings } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
        <p className="text-gray-500 capitalize">{user?.role} Dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link to="/dashboard/bookings" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-100 text-primary rounded-full flex items-center justify-center mr-4"><Calendar /></div>
          <div><h3 className="font-bold text-gray-900">My Bookings</h3><p className="text-sm text-gray-500">Manage site visits</p></div>
        </Link>

        {(user?.role === 'seller' || user?.role === 'agent') && (
          <Link to="/dashboard/my-properties" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-100 text-accent rounded-full flex items-center justify-center mr-4"><Home /></div>
            <div><h3 className="font-bold text-gray-900">My Properties</h3><p className="text-sm text-gray-500">Manage listings</p></div>
          </Link>
        )}
        
        {user?.role === 'agent' && (
          <Link to="/profile" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-4"><Settings /></div>
            <div><h3 className="font-bold text-gray-900">Profile Settings</h3><p className="text-sm text-gray-500">Update agent profile</p></div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
