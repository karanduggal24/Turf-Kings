'use client';

import TurfCard from '@/components/TurfCard';
import type { Turf } from '@/app/constants/turf-types';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';

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
        <LoadingSpinner size="lg" text="Loading turfs..." />
      </div>
    );
  }

  if (turfs.length === 0) {
    return (
      <EmptyState
        icon="search_off"
        title="No turfs found"
        description="Try adjusting your filters"
      />
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
