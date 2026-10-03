import { Star } from 'lucide-react';

const StarRating = ({ value, onChange, size = 16 }) => {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <div className="flex">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange && onChange(star)}
          disabled={!onChange}
          className={`${onChange ? 'cursor-pointer' : 'cursor-default'} focus:outline-none`}
        >
          <Star
            size={size}
            className={`${star <= value ? 'fill-accent text-accent' : 'fill-transparent text-gray-300'}`}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
