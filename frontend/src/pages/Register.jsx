import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register, login } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', role: 'buyer' });
  const { login: setAuthContext } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      const res = await login({ email: formData.email, password: formData.password });
      setAuthContext(res.data.data);   // backend: { success, data: { token, user } }
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">I am a...</label>
            <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
              <option value="agent">Agent</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary" />
          </div>
          <button type="submit" className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-blue-800">Register</button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
