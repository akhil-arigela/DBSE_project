import { useState, useEffect } from 'react';
import { getMyBookings, updateBookingStatus, cancelBooking } from '../api/bookingApi';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, MapPin, User, Phone, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchBookings = async () => {
    try {
      const res = await getMyBookings();
      setBookings(res.data.data || []);
    } catch (e) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await cancelBooking(bookingId);
        toast.success('Booking cancelled');
        fetchBookings();
      } catch (e) {
        toast.error('Failed to cancel booking');
      }
    }
  };

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      await updateBookingStatus(bookingId, status);
      toast.success(`Booking status updated to ${status}`);
      fetchBookings();
    } catch (e) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading your bookings...</div>;

  const isSellerOrAgent = user?.role === 'seller' || user?.role === 'agent';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isSellerOrAgent ? 'Property Site Visit Bookings' : 'My Scheduled Site Visits'}
        </h1>
        <p className="text-sm text-gray-500">
          {isSellerOrAgent
            ? 'Incoming site visit requests from prospective buyers'
            : 'Track your upcoming and past property visits'}
        </p>
      </div>

      <div className="space-y-4">
        {bookings.map(b => (
          <div
            key={b.booking_id}
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-gray-900">
                  {b.property_title || `Property #${b.property_id}`}
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                  b.status === 'confirmed'
                    ? 'bg-blue-100 text-blue-800'
                    : b.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : b.status === 'cancelled'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {b.status}
                </span>
              </div>

              {(b.address || b.city) && (
                <p className="text-sm text-gray-500 flex items-center">
                  <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                  {b.address}{b.city ? `, ${b.city}` : ''}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
                <span className="flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-blue-600" />
                  {new Date(b.visit_date).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
                <span className="flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-blue-600" />
                  {b.visit_time}
                </span>
                {isSellerOrAgent && b.buyer_name && (
                  <span className="flex items-center text-gray-700 font-medium">
                    <User className="w-3.5 h-3.5 mr-1 text-gray-500" />
                    Buyer: {b.buyer_name}
                  </span>
                )}
                {isSellerOrAgent && b.buyer_phone && (
                  <a href={`tel:${b.buyer_phone}`} className="flex items-center text-blue-600 hover:underline">
                    <Phone className="w-3.5 h-3.5 mr-1" />
                    {b.buyer_phone}
                  </a>
                )}
              </div>

              {b.notes && (
                <p className="text-xs text-gray-500 italic bg-gray-50 px-3 py-1.5 rounded-md">
                  Note: "{b.notes}"
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap self-end md:self-center">
              {b.status === 'pending' && user?.role === 'buyer' && (
                <button
                  onClick={() => handleCancel(b.booking_id)}
                  className="bg-red-50 text-red-600 hover:bg-red-100 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel Visit
                </button>
              )}

              {b.status === 'pending' && isSellerOrAgent && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(b.booking_id, 'confirmed')}
                    className="bg-blue-700 hover:bg-blue-800 text-white px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" /> Confirm
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(b.booking_id, 'cancelled')}
                    className="bg-red-50 text-red-600 hover:bg-red-100 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center"
                  >
                    <XCircle className="w-4 h-4 mr-1" /> Decline
                  </button>
                </>
              )}

              {b.status === 'confirmed' && isSellerOrAgent && (
                <button
                  onClick={() => handleStatusUpdate(b.booking_id, 'completed')}
                  className="bg-green-600 hover:bg-green-700 text-white px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center"
                >
                  <CheckCircle className="w-4 h-4 mr-1" /> Mark Completed
                </button>
              )}
            </div>
          </div>
        ))}

        {bookings.length === 0 && (
          <div className="text-center text-gray-500 py-16 bg-white rounded-xl border border-gray-100">
            <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-base font-semibold mb-1">No bookings scheduled yet</p>
            <p className="text-sm">
              {isSellerOrAgent
                ? 'When buyers request visits for your listings, they will show up here.'
                : 'Browse properties and click "Book Site Visit" to schedule an in-person tour!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
