'use client';

import { useState } from 'react';
import { reviewsApi } from '@/lib/api';

interface ReviewFormProps {
  bookingId: string;
  venueName: string;
  onSubmitted: () => void;
}

export default function ReviewForm({ bookingId, venueName, onSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (rating === 0) { setError('Please select a rating'); return; }
    setError('');
    setLoading(true);
    try {
      await reviewsApi.submit({ booking_id: bookingId, rating, comment: comment.trim() || undefined });
      onSubmitted();
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const stars = [1, 2, 3, 4, 5];
  const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
  const activeRating = hovered || rating;

  return (
    <div className="bg-surface-dark border border-primary/20 rounded-xl p-6 space-y-5">
      <div>
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">rate_review</span>
          Rate Your Experience
        </h3>
        <p className="text-sm text-gray-400 mt-1">How was your visit to {venueName}?</p>
      </div>

      {/* Star Rating */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {stars.map(star => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="transition-transform hover:scale-110 active:scale-95"
            >
              <span className={`material-symbols-outlined text-3xl transition-colors ${
                star <= activeRating ? 'text-yellow-400' : 'text-gray-600'
              }`}
                style={{ fontVariationSettings: star <= activeRating ? "'FILL' 1" : "'FILL' 0" }}
              >
                star
              </span>
            </button>
          ))}
          {activeRating > 0 && (
            <span className="text-sm font-medium text-yellow-400 ml-1">{labels[activeRating]}</span>
          )}
        </div>
      </div>

      {/* Comment */}
      <div>
        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          Comment <span className="text-gray-600 font-normal normal-case">(optional)</span>
        </label>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          maxLength={500}
          rows={3}
          className="mt-1.5 w-full px-4 py-3 rounded-lg bg-black/40 border border-primary/20 text-white outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
          placeholder="Share your experience..."
        />
        <p className="text-xs text-gray-600 text-right mt-1">{comment.length}/500</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm">
          <span className="material-symbols-outlined text-base">error</span>
          {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || rating === 0}
        className="w-full py-3 rounded-xl bg-primary text-black font-bold text-sm hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />Submitting...</>
        ) : (
          <><span className="material-symbols-outlined text-base">send</span>Submit Review</>
        )}
      </button>
    </div>
  );
}
