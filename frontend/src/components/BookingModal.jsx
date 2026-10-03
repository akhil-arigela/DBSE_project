import { useState } from 'react';
import { X } from 'lucide-react';
import { createBooking } from '../api/bookingApi';
import toast from 'react-hot-toast';

const BookingModal = ({ property, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    visit_date: '',
    visit_time: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const propId = property.property_id || property.id;
      await createBooking({
        property_id: parseInt(propId),
        agent_id: property.agent_id || null,
        ...formData
      });
      toast.success('Site visit scheduled successfully!');
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to request booking');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="font-bold text-lg text-gray-900">Book Site Visit</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 bg-gray-50 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-800">{property.title}</p>
          <p className="text-xs text-gray-500">{property.city} {property.state ? `• ${property.state}` : ''}</p>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Visit Date</label>
            <input
              type="date"
              name="visit_date"
              min={today}
              required
              value={formData.visit_date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
            <input
              type="time"
              name="visit_time"
              required
              value={formData.visit_time}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes / Questions (Optional)</label>
            <textarea
              name="notes"
              rows="3"
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="e.g., Interested in checking the balcony and parking slot..."
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Confirm Visit Booking'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
