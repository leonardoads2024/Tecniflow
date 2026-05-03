import { Star } from 'lucide-react';

function normalizeRating(value) {
  const numeric = Number(value || 0);

  if (Number.isNaN(numeric)) {
    return 0;
  }

  return Math.max(0, Math.min(5, numeric));
}

export default function RatingStars({
  value = 0,
  showValue = true,
  size = 16,
  className = '',
}) {
  const rating = normalizeRating(value);
  const filledStars = Math.round(rating);

  return (
    <div className={`rating-stars ${className}`.trim()} aria-label={`Avaliacao ${rating} de 5`}>
      <div className="rating-stars-icons">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={size}
            className={index < filledStars ? 'rating-star filled' : 'rating-star'}
            fill={index < filledStars ? 'currentColor' : 'none'}
            strokeWidth={1.8}
          />
        ))}
      </div>

      {showValue && <span className="rating-stars-value">{rating.toFixed(1).replace('.', ',')}</span>}
    </div>
  );
}
