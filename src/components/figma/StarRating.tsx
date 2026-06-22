import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  reviews?: number;
  size?: number;
}

export function StarRating({ rating, reviews, size = 14 }: StarRatingProps) {
  return (
    <span className="inline-flex items-center gap-1">
      <Star size={size} className="fill-amber-400 text-amber-400" />
      <span className="font-semibold text-sm">{rating.toFixed(1)}</span>
      {reviews !== undefined && (
        <span className="text-muted-foreground text-xs">({reviews})</span>
      )}
    </span>
  );
}
