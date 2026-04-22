'use client';

import Image from 'next/image';
import Button from '@/components/common/Button';

interface VenueHeaderProps {
  venue: any;
  liveRating?: number;
  liveReviews?: number;
}

export default function VenueHeader({ venue, liveRating, liveReviews }: VenueHeaderProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: venue.name, text: `Check out ${venue.name}`, url: window.location.href });
    }
  };

  const handleGetDirections = () => {
    const address = encodeURIComponent(`${venue.location}, ${venue.city}, ${venue.state}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
  };

  // Use live data if available, fall back to server-rendered values
  const displayRating = liveRating !== undefined ? liveRating : (venue.rating || 0);
  const displayReviews = liveReviews !== undefined ? liveReviews : (venue.total_reviews || 0);

  // Compute operating hours from turfs
  const activeTurfs = (venue.turfs || []).filter((t: any) => t.is_active);
  const openHours = activeTurfs.map((t: any) => parseInt((t.open_time || '06:00').slice(0, 5)));
  const closeHours = activeTurfs.map((t: any) => parseInt((t.close_time || '22:00').slice(0, 5)));
  const earliestOpen = openHours.length > 0 ? Math.min(...openHours) : 6;
  const latestClose = closeHours.length > 0 ? Math.max(...closeHours) : 22;
  const fmt = (h: number) => `${String(h).padStart(2, '0')}:00`;

  return (
    <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={venue.images?.[0] || '/placeholder-turf.jpg'}
          alt={venue.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>

      <div className="relative h-full max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 flex flex-col justify-end pb-8">
        <div className="mb-4">
          <span className="inline-flex items-center gap-2 bg-primary/90 backdrop-blur-md px-4 py-2 rounded-full border border-primary">
            <span className="material-symbols-outlined text-black text-sm">verified</span>
            <span className="text-black text-sm font-bold uppercase tracking-wide">Premier Venue</span>
          </span>
        </div>

        <div className="mb-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3">{venue.name}</h1>
          <div className="flex items-center gap-4 flex-wrap">
            {/* Rating */}
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-surface-highlight">
              {[1, 2, 3, 4, 5].map(star => (
                <span key={star} className={`material-symbols-outlined text-sm ${star <= Math.round(displayRating) ? 'text-yellow-400' : 'text-gray-600'}`}>
                  star
                </span>
              ))}
              <span className="text-white font-bold ml-1">
                {displayRating > 0 ? displayRating.toFixed(1) : 'No ratings'}
                {displayReviews > 0 && ` (${displayReviews} review${displayReviews !== 1 ? 's' : ''})`}
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-gray-300">
              <span className="material-symbols-outlined text-primary">location_on</span>
              <span className="text-sm">{venue.city}, {venue.state}</span>
            </div>

            {/* Operating hours — from actual turf data */}
            {activeTurfs.length > 0 && (
              <div className="flex items-center gap-2 bg-primary/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-primary">
                <span className="material-symbols-outlined text-primary text-sm">schedule</span>
                <span className="text-primary text-sm font-bold">Open {fmt(earliestOpen)} – {fmt(latestClose)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleShare} variant="secondary" icon="share" className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20">
            Share
          </Button>
          <Button onClick={handleGetDirections} icon="directions" className="neon-glow-hover">
            Get Directions
          </Button>
        </div>
      </div>
    </div>
  );
}
