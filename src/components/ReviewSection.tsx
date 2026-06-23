import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { formatDate } from '../utils/formatDate';

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles?: {
    full_name: string;
  };
}

interface Props {
  hostelId: string;
}

export default function ReviewSection({ hostelId }: Props) {
  const { user, profile } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [canReview, setCanReview] = useState(false);
  
  // Review Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
    if (user && profile?.role === 'STUDENT') {
      checkReviewEligibility();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hostelId, user, profile]);

  async function fetchReviews() {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          comment,
          created_at,
          profiles!inner ( full_name )
        `)
        .eq('hostel_id', hostelId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform data to handle Supabase's returned structure
      const formattedReviews = (data || []).map(r => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        created_at: r.created_at,
        profiles: Array.isArray(r.profiles) ? r.profiles[0] : r.profiles
      }));

      setReviews(formattedReviews as Review[]);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  async function checkReviewEligibility() {
    if (!user || !isSupabaseConfigured()) return;

    try {
      // Check if user has a CHECKED_IN booking for this hostel
      const { data: bookings } = await supabase
        .from('bookings')
        .select('id')
        .eq('student_id', user.id)
        .eq('hostel_id', hostelId)
        .eq('status', 'CHECKED_IN')
        .limit(1);

      // Check if user already reviewed this hostel
      const { data: existingReviews } = await supabase
        .from('reviews')
        .select('id')
        .eq('student_id', user.id)
        .eq('hostel_id', hostelId)
        .limit(1);

      if (bookings && bookings.length > 0 && (!existingReviews || existingReviews.length === 0)) {
        setCanReview(true);
      } else {
        setCanReview(false);
      }
    } catch (err) {
      console.error('Error checking eligibility:', err);
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !comment.trim()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          student_id: user.id,
          hostel_id: hostelId,
          rating,
          comment: comment.trim()
        });

      if (error) throw error;

      toast.success('Review submitted successfully! Thank you for your feedback.');
      setCanReview(false);
      setComment('');
      setRating(5);
      fetchReviews();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      toast.error('Failed to submit review: ' + errorMessage);
      console.error('Submit review error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="py-8 text-muted-foreground">Loading reviews...</div>;

  return (
    <section>
      <div className="flex items-center gap-3 mb-8">
        <Star className="w-6 h-6 shrink-0 fill-foreground text-foreground" aria-hidden="true" />
        <h2 className="text-2xl font-black text-foreground tracking-tight">Guest Reviews</h2>
      </div>

      {canReview && (
        <div className="mb-10 bg-card rounded-2xl p-6 border border-border">
          <h3 className="text-lg font-black text-foreground mb-4">Leave a Review</h3>
          <form onSubmit={submitReview} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-muted-foreground uppercase tracking-widest mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setRating(num)}
                    className="focus:outline-none"
                    aria-label={`Rate ${num} out of 5 stars`}
                  >
                    <Star className={`w-8 h-8 ${rating >= num ? 'fill-yellow-400 text-yellow-400' : 'fill-muted text-muted-foreground'} transition-colors`} aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-black text-muted-foreground uppercase tracking-widest mb-2">Your Experience</label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Share your experience staying here..."
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring min-h-[100px] resize-none"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={submitting}
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      )}
      
      {reviews.length === 0 ? (
        <div className="py-8 text-center bg-card rounded-2xl border border-border">
          <p className="text-muted-foreground font-medium">No reviews yet for this property.</p>
          <p className="text-sm text-muted-foreground mt-1">Check in and be the first to leave a review!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {reviews.map((review) => {
            const authorName = review.profiles?.full_name || 'Anonymous Student';
            
            return (
              <div key={review.id} className="pb-8 border-b border-border last:border-none">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold text-sm">
                      {authorName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-sm">{authorName}</h4>
                      <p className="text-xs text-muted-foreground font-medium">{formatDate(review.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-muted px-2 py-1 rounded-lg">
                    <span className="font-bold text-sm text-foreground">{review.rating.toFixed(1)}</span>
                    <Star className="w-4 h-4 shrink-0 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed font-medium italic">
                  "{review.comment}"
                </p>
              </div>
            );
          })}
          
          <p className="text-sm text-muted-foreground font-medium pt-4">
            Verified reviews by real students. All feedback is from confirmed residents.
          </p>
        </div>
      )}
    </section>
  );
}
