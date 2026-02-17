'use client';

import Image from 'next/image';
import Button from '@/components/common/Button';

interface VenueHeaderProps {
  venue: any;
}

export default function VenueHeader({ venue }: VenueHeaderProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: venue.name,
        text: `Check out ${venue.name}`,
        url: window.location.href,
      });
    }
  };

  const handleGetDirections = () => {
    const address = encodeURIComponent(`${venue.location}, ${venue.city}, ${venue.state}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
  };

  return (
    <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
      {/* Background Image with Overlay */}
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

      {/* Content */}
      <div className="relative h-full max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 flex flex-col justify-end pb-8">
        {/* Premier Venue Badge */}
        <div className="mb-4">
          <span className="inline-flex items-center gap-2 bg-primary/90 backdrop-blur-md px-4 py-2 rounded-full border border-primary">
            <span className="material-symbols-outlined text-black text-sm">verified</span>
            <span className="text-black text-sm font-bold uppercase tracking-wide">Premier Venue</span>
          </span>
        </div>

        {/* Venue Name and Rating */}
        <div className="mb-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3">
            {venue.name}
          </h1>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-surface-highlight">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`material-symbols-outlined text-sm ${
                    star <= Math.round(venue.rating) ? 'text-yellow-400' : 'text-gray-600'
                  }`}
                >
                  star
                </span>
              ))}
              <span className="text-white font-bold ml-1">
                {venue.rating.toFixed(1)} ({venue.total_reviews} reviews)
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <span className="material-symbols-outlined text-primary">location_on</span>
              <span className="text-sm">{venue.city}, {venue.state}</span>
            </div>
            <div className="flex items-center gap-2 bg-primary/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-primary">
              <span className="material-symbols-outlined text-primary text-sm">schedule</span>
              <span className="text-primary text-sm font-bold">Open 06:00 - 23:00</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            onClick={handleShare}
            variant="secondary"
            icon="share"
            className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20"
          >
            Share
          </Button>
          <Button
            onClick={handleGetDirections}
            icon="directions"
            className="neon-glow-hover"
          >
            Get Directions
          </Button>
        </div>
      </div>
    </div>
  );
}
