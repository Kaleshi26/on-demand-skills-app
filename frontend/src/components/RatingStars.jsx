// frontend/src/components/RatingStars.jsx
import { FaStar } from 'react-icons/fa';

export default function RatingStars({ 
  rating = 0, 
  maxRating = 5, 
  size = 'md', 
  interactive = false, 
  onRatingChange,
  className = '' 
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleStarClick = (starRating) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const renderStars = () => {
    const stars = [];
    
    for (let i = 1; i <= maxRating; i++) {
      const isFilled = i <= rating;
      const isHalfFilled = i === Math.ceil(rating) && rating % 1 !== 0;
      
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => handleStarClick(i)}
          disabled={!interactive}
          className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
        >
          <FaStar
            className={`${sizeClasses[size]} ${
              isFilled 
                ? 'fill-yellow-400 text-yellow-400' 
                : isHalfFilled 
                  ? 'fill-yellow-400/50 text-yellow-400'
                  : 'text-gray-300'
            }`}
          />
        </button>
      );
    }
    
    return stars;
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {renderStars()}
      {rating > 0 && (
        <span className="ml-2 text-sm text-gray-600">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
