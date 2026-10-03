import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAgent } from '../api/agentApi';
import { createReview } from '../api/reviewApi';
import PropertyCard from '../components/PropertyCard';
import ReviewCard from '../components/ReviewCard';
import StarRating from '../components/StarRating';
import { useAuth } from '../context/AuthContext';
import { Phone, Mail, Award, Briefcase, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const AgentDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchAgentData = () => {
    getAgent(id)
      .then(res => setAgent(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAgentData();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await createReview({
        agent_id: parseInt(id),
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });
      toast.success('Thank you for rating this agent!');
      setReviewForm({ rating: 5, comment: '' });
      fetchAgentData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading agent profile...</div>;
  if (!agent) return <div className="text-center py-20 text-gray-500">Agent profile not found.</div>;

  const reviews = agent.reviews || [];
  const properties = agent.properties || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* Agent Card Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="w-28 h-28 bg-blue-100 text-blue-700 rounded-full flex-shrink-0 flex items-center justify-center text-4xl font-bold">
          {agent.name?.charAt(0) || 'A'}
        </div>
        <div className="flex-grow text-center md:text-left space-y-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{agent.name}</h1>
            <p className="text-base text-blue-700 font-semibold">{agent.agency_name || 'Independent Real Estate Agent'}</p>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-2">
            <StarRating value={parseFloat(agent.avg_rating) || 0} size={18} />
            <span className="font-bold text-gray-800">
              {parseFloat(agent.avg_rating) > 0 ? parseFloat(agent.avg_rating).toFixed(1) : 'No ratings yet'}
            </span>
            {agent.total_reviews > 0 && (
              <span className="text-xs text-gray-400">({agent.total_reviews} total reviews)</span>
            )}
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 justify-center md:justify-start pt-1">
            <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
              <Briefcase className="w-4 h-4 text-gray-400" />
              <span>{agent.experience_years || 0} years in industry</span>
            </div>
            {agent.license_number && (
              <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                <Award className="w-4 h-4 text-gray-400" />
                <span>RERA: {agent.license_number}</span>
              </div>
            )}
            {agent.phone && (
              <a href={`tel:${agent.phone}`} className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg hover:underline">
                <Phone className="w-4 h-4" />
                <span>{agent.phone}</span>
              </a>
            )}
            {agent.email && (
              <a href={`mailto:${agent.email}`} className="flex items-center gap-1.5 bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg hover:underline">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{agent.email}</span>
              </a>
            )}
          </div>

          {agent.bio && (
            <div className="pt-2">
              <h3 className="font-semibold text-gray-900 text-sm mb-1">About the Agent</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{agent.bio}</p>
            </div>
          )}
        </div>
      </div>

      {/* Agent's Property Listings */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Properties Managed by {agent.name} ({properties.length})
          </h2>
        </div>
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(p => (
              <PropertyCard key={p.property_id} property={p} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 p-8 rounded-xl text-center text-gray-500 text-sm">
            No active properties currently assigned to this agent.
          </div>
        )}
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Client Feedback & Ratings ({reviews.length})
        </h2>

        {reviews.length > 0 ? (
          <div className="space-y-4 mb-8">
            {reviews.map(r => (
              <ReviewCard key={r.review_id} review={r} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm mb-8">No reviews for this agent yet.</p>
        )}

        {/* Leave Review Form */}
        {user?.role === 'buyer' ? (
          <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="font-bold text-gray-900 text-base mb-3">Rate your experience with {agent.name}</h3>
            <div className="mb-4">
              <StarRating
                value={reviewForm.rating}
                onChange={v => setReviewForm({ ...reviewForm, rating: v })}
                size={24}
              />
            </div>
            <textarea
              required
              rows="3"
              value={reviewForm.comment}
              onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
              placeholder="Share feedback on communication, responsiveness, market knowledge..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm mb-3 resize-none"
            />
            <button
              type="submit"
              disabled={submittingReview}
              className="bg-blue-700 hover:bg-blue-800 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50"
            >
              {submittingReview ? 'Submitting...' : 'Post Agent Review'}
            </button>
          </form>
        ) : !user ? (
          <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-700 text-center">
            <Link to="/login" className="font-semibold underline">Login as a buyer</Link> to write a review for this agent.
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AgentDetail;
