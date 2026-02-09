'use client';

import TurfCard from '@/components/TurfCard';
import type { Turf } from '@/app/constants/turf-types';

interface TurfsGridContentProps {
  turfs: Turf[];
  loading: boolean;
  error: string | null;
}

export default function TurfsGridContent({ turfs, loading, error }: TurfsGridContentProps) {
  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="flex flex-col items-center gap-4">
          <span className="animate-spin text-6xl">⚡</span>
          <p className="text-gray-400">Loading turfs...</p>
        </div>
      </div>
    );
  }

  if (turfs.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="material-symbols-outlined text-6xl text-gray-600 mb-4">search_off</span>
        <h3 className="text-xl font-bold mb-2">No turfs found</h3>
        <p className="text-gray-400">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {turfs.map((turf) => (
        <TurfCard
          key={turf.id}
          turfId={turf.id}
          sport={turf.sport_type}
          sportIcon={
            turf.sport_type === 'cricket' ? 'sports_cricket' :
            turf.sport_type === 'football' ? 'sports_soccer' :
            turf.sport_type === 'badminton' ? 'sports_tennis' :
            turf.sport_type === 'multi' ? 'sports' :
            'sports_soccer'
          }
          name={turf.name}
          location={`${turf.city}, ${turf.state}`}
          distance={turf.location}
          rating={turf.rating}
          amenities={turf.amenities}
          price={turf.price_per_hour}
          imageUrl={turf.images[0] || '/placeholder-turf.jpg'}
        />
      ))}
    </div>
  );
}
