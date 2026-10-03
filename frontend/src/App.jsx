import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyProperties from './pages/MyProperties';
import Bookings from './pages/Bookings';
import Agents from './pages/Agents';
import AgentDetail from './pages/AgentDetail';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/agents/:id" element={<AgentDetail />} />
            
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/my-properties" element={<ProtectedRoute allowedRoles={['seller', 'agent']}><MyProperties /></ProtectedRoute>} />
            <Route path="/dashboard/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
        <Toaster position="top-right" />
      </div>
    </AuthProvider>
  );
}

export default App;
