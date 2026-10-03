import StarRating from './StarRating';

const ReviewCard = ({ review }) => {
  const name = review.reviewer_name || review.User?.name || 'Verified Buyer';
  const initials = name.charAt(0).toUpperCase();
  const rawDate = review.created_at || review.createdAt;
  const date = rawDate ? new Date(rawDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : '';

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold mr-3 text-sm">
          {initials}
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 text-sm">{name}</h4>
          <div className="flex items-center text-xs text-gray-500 mt-0.5">
            <StarRating value={review.rating} size={14} />
            {date && <span className="ml-2 text-gray-400">{date}</span>}
          </div>
        </div>
      </div>
      <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
    </div>
  );
};

export default ReviewCard;
