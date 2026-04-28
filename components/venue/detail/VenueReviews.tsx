'use client';

import { useEffect, useState } from 'react';
import { reviewsApi } from '@/lib/api';

interface Review {
  id: string;
  rating: number;
  comment?: string;
  created_at: string;
  user?: { full_name: string };
}

interface VenueReviewsProps {
  venueId: string;
  onStatsChange?: (avgRating: number, total: number) => void;
}

function Stars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const cls = size === 'lg' ? 'text-2xl' : 'text-base';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <span
          key={s}
          className={`material-symbols-outlined ${cls} ${s <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-600'}`}
          style={{ fontVariationSettings: s <= Math.round(rating) ? "'FILL' 1" : "'FILL' 0" }}
        >
          star
        </span>
      ))}
    </div>
  );
}

export default function VenueReviews({ venueId, onStatsChange }: VenueReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  useEffect(() => {
    setLoading(true);
    reviewsApi.getByVenue(venueId, page)
      .then((data: any) => {
        const fetched = data.reviews || [];
        const fetchedTotal = data.pagination?.total || 0;
        setReviews(fetched);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotal(fetchedTotal);
        if (onStatsChange) {
          const avg = fetched.length > 0
            ? fetched.reduce((s: number, r: any) => s + r.rating, 0) / fetched.length
            : 0;
          onStatsChange(avg, fetchedTotal);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [venueId, page]);

  return (
    <div className="bg-surface-dark border border-surface-highlight rounded-xl p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">reviews</span>
          Reviews
          {total > 0 && <span className="text-sm font-normal text-gray-400">({total})</span>}
        </h2>
        {total > 0 && (
          <div className="flex items-center gap-3">
            <Stars rating={avgRating} size="lg" />
            <div>
              <span className="text-2xl font-black text-white">{avgRating.toFixed(1)}</span>
              <p className="text-xs text-gray-400">{total} review{total !== 1 ? 's' : ''}</p>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse space-y-2">
              <div className="h-4 bg-white/5 rounded w-1/4" />
              <div className="h-3 bg-white/5 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-gray-400 text-sm">No reviews yet. Be the first to review after your booking!</p>
      ) : (
        <div className="space-y-5">
          {reviews.map(review => (
            <div key={review.id} className="border-b border-surface-highlight pb-5 last:border-0 last:pb-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                    {(review.user?.full_name || 'U')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">{review.user?.full_name || 'Anonymous'}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(review.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <Stars rating={review.rating} />
              </div>
              {review.comment && (
                <p className="text-sm text-gray-300 mt-3 leading-relaxed">{review.comment}</p>
              )}
            </div>
          ))}

          {totalPages > 1 && (
            <div className="flex gap-2 pt-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border border-primary/20 text-xs text-gray-400 hover:text-primary disabled:opacity-40 transition-colors">
                Previous
              </button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg border border-primary/20 text-xs text-gray-400 hover:text-primary disabled:opacity-40 transition-colors">
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
