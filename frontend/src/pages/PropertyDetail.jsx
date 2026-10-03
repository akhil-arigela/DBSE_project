import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProperty } from '../api/propertyApi';
import { getPropertyReviews, createReview } from '../api/reviewApi';
import VirtualTourViewer from '../components/VirtualTourViewer';
import BookingModal from '../components/BookingModal';
import ReviewCard from '../components/ReviewCard';
import StarRating from '../components/StarRating';
import { useAuth } from '../context/AuthContext';
import { Check, MapPin, Bed, Bath, Square, Star, Phone, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const PropertyDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    Promise.all([getProperty(id), getPropertyReviews(id)])
      .then(([propRes, revRes]) => {
        const prop = propRes.data.data;
        setProperty(prop);
        // Set active image to primary
        const primary = prop?.media?.find(m => m.is_primary) || prop?.media?.[0];
        setActiveImage(primary?.url || null);
        setReviews(revRes.data.data || []);
      })
      .catch(err => { console.error(err); toast.error('Failed to load property'); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await createReview({ property_id: parseInt(id), ...reviewForm });
      const revRes = await getPropertyReviews(id);
      setReviews(revRes.data.data || []);
      setReviewForm({ rating: 5, comment: '' });
      toast.success('Review added!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-10 bg-gray-200 rounded w-2/3 mb-4" />
      <div className="h-96 bg-gray-200 rounded-xl mb-6" />
    </div>
  );
  if (!property) return <div className="text-center py-20 text-gray-500">Property not found.</div>;

  // Media
  const mediaList = property.media || [];
  const tourImage = mediaList.find(m => m.media_type === 'virtual_tour_360')?.url;
  const displayImage = activeImage || mediaList.find(m => m.is_primary)?.url || mediaList[0]?.url
    || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800';

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0
  }).format(property.price);

  // Agent info (flattened in response)
  const hasAgent = property.agent_id && property.agent_name;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="bg-blue-700 text-white text-xs px-3 py-1 rounded-full uppercase font-bold">
              For {property.listing_type}
            </span>
            <span className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full uppercase font-medium capitalize">
              {property.property_type}
            </span>
            {property.has_virtual_tour === 1 && (
              <span className="bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full font-medium">
                🎥 360° Virtual Tour
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
          <p className="flex items-center text-gray-500">
            <MapPin className="w-4 h-4 mr-1 text-gray-400" />
            {property.address}, {property.city}{property.state ? `, ${property.state}` : ''}
            {property.pincode ? ` - ${property.pincode}` : ''}
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-extrabold text-blue-700">{formattedPrice}</div>
          {property.listing_type === 'rent' && <div className="text-sm text-gray-500">per month</div>}
        </div>
      </div>

      {/* Media gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-10">
        <div className="lg:col-span-3 rounded-xl overflow-hidden h-[420px] bg-gray-100">
          {property.has_virtual_tour === 1 && tourImage ? (
            <VirtualTourViewer tourImageUrl={tourImage} />
          ) : (
            <img
              src={displayImage}
              alt={property.title}
              className="w-full h-full object-cover"
              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'; }}
            />
          )}
        </div>
        <div className="flex flex-col gap-3 h-[420px] overflow-y-auto">
          {mediaList.length > 0 ? mediaList.map(img => (
            <img
              key={img.media_id}
              src={img.url}
              alt="Gallery"
              onClick={() => setActiveImage(img.url)}
              className={`w-full h-28 object-cover rounded-lg cursor-pointer border-2 transition-all ${activeImage === img.url ? 'border-blue-600 opacity-100' : 'border-transparent opacity-80 hover:opacity-100'}`}
              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'; }}
            />
          )) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">No photos</div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">

          {/* Overview */}
          <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {property.bedrooms && (
                <div className="flex flex-col items-center bg-gray-50 p-3 rounded-lg">
                  <Bed className="w-5 h-5 text-blue-600 mb-1" />
                  <p className="font-bold text-lg">{property.bedrooms}</p>
                  <p className="text-gray-500 text-sm">Bedrooms</p>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex flex-col items-center bg-gray-50 p-3 rounded-lg">
                  <Bath className="w-5 h-5 text-blue-600 mb-1" />
                  <p className="font-bold text-lg">{property.bathrooms}</p>
                  <p className="text-gray-500 text-sm">Bathrooms</p>
                </div>
              )}
              {property.area_sqft && (
                <div className="flex flex-col items-center bg-gray-50 p-3 rounded-lg">
                  <Square className="w-5 h-5 text-blue-600 mb-1" />
                  <p className="font-bold text-lg">{property.area_sqft}</p>
                  <p className="text-gray-500 text-sm">Sq. Ft.</p>
                </div>
              )}
              <div className="flex flex-col items-center bg-gray-50 p-3 rounded-lg">
                <Star className="w-5 h-5 text-amber-500 mb-1" />
                <p className="font-bold text-lg">{property.avg_rating?.toFixed(1) || 'N/A'}</p>
                <p className="text-gray-500 text-sm">Rating</p>
              </div>
            </div>
            <h3 className="font-semibold mb-2 text-gray-800">Description</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{property.description}</p>
          </section>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {property.amenities.map(am => (
                  <div key={am.amenity_id} className="flex items-center text-gray-700">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>{am.name}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Reviews */}
          <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Reviews ({reviews.length})</h2>
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-sm">No reviews yet. Be the first to review!</p>
            ) : (
              <div className="space-y-4 mb-6">
                {reviews.map(rev => <ReviewCard key={rev.review_id} review={rev} />)}
              </div>
            )}
            {user?.role === 'buyer' && (
              <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-4 rounded-xl border border-gray-200 mt-4">
                <h4 className="font-semibold mb-3">Leave a Review</h4>
                <div className="mb-3">
                  <StarRating value={reviewForm.rating} onChange={v => setReviewForm({ ...reviewForm, rating: v })} size={24} />
                </div>
                <textarea
                  required
                  value={reviewForm.comment}
                  onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg mb-3 resize-none"
                  rows="3"
                  placeholder="Share your experience with this property..."
                />
                <button type="submit" className="bg-blue-700 text-white px-5 py-2 rounded-lg hover:bg-blue-800 transition-colors">
                  Submit Review
                </button>
              </form>
            )}
            {!user && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                <Link to="/login" className="font-semibold underline">Login as a buyer</Link> to leave a review.
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Agent Card */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold mb-4">
              {hasAgent ? 'Listed by Agent' : 'Listed by Seller'}
            </h3>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xl font-bold mr-4">
                {hasAgent ? property.agent_name?.charAt(0) : property.seller_name?.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-gray-900">{hasAgent ? property.agent_name : property.seller_name}</p>
                {hasAgent && property.agency_name && (
                  <p className="text-sm text-gray-500">{property.agency_name}</p>
                )}
                {hasAgent && property.experience_years && (
                  <p className="text-xs text-gray-400">{property.experience_years} years experience</p>
                )}
              </div>
            </div>
            {hasAgent && property.agent_rating > 0 && (
              <div className="flex items-center mb-4 text-sm text-gray-600">
                <Star className="w-4 h-4 text-amber-500 mr-1" />
                <span className="font-semibold">{parseFloat(property.agent_rating).toFixed(1)}</span>
                <span className="ml-1 text-gray-400">Agent Rating</span>
              </div>
            )}
            {hasAgent && property.agent_phone && (
              <a href={`tel:${property.agent_phone}`} className="flex items-center text-sm text-gray-600 mb-2 hover:text-blue-700">
                <Phone className="w-4 h-4 mr-2 text-gray-400" /> {property.agent_phone}
              </a>
            )}
            {property.seller_phone && !hasAgent && (
              <a href={`tel:${property.seller_phone}`} className="flex items-center text-sm text-gray-600 mb-2 hover:text-blue-700">
                <Phone className="w-4 h-4 mr-2 text-gray-400" /> {property.seller_phone}
              </a>
            )}

            {/* Booking Button */}
            <div className="mt-4">
              {user?.role === 'buyer' ? (
                <button
                  onClick={() => setShowBooking(true)}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-lg transition-colors"
                >
                  📅 Book Site Visit
                </button>
              ) : !user ? (
                <Link to="/login" className="block text-center w-full bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800 font-medium">
                  Login to Book Visit
                </Link>
              ) : (
                <div className="text-sm text-gray-500 text-center p-2">
                  Only buyers can book site visits.
                </div>
              )}
            </div>
          </div>

          {/* Property Info Card */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm text-sm text-gray-600 space-y-2">
            <div className="flex justify-between"><span>Status</span><span className="capitalize font-medium text-green-600">{property.status}</span></div>
            <div className="flex justify-between"><span>Type</span><span className="capitalize font-medium">{property.property_type}</span></div>
            <div className="flex justify-between"><span>Listed</span><span className="font-medium">{new Date(property.created_at).toLocaleDateString('en-IN')}</span></div>
            {property.pincode && <div className="flex justify-between"><span>Pincode</span><span className="font-medium">{property.pincode}</span></div>}
          </div>
        </div>
      </div>

      {showBooking && (
        <BookingModal
          property={property}
          onClose={() => setShowBooking(false)}
          onSuccess={() => toast.success('Visit booked successfully!')}
        />
      )}
    </div>
  );
};

export default PropertyDetail;
