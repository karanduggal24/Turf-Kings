'use client';

import { useEffect, useState } from 'react';
import { useTurfsStore } from '@/stores/turfsStore';
import TurfCard from './TurfCard';
import { TurfCardProps } from '@/app/constants/types';
import Link from 'next/link';
import { reviewsApi } from '@/lib/api';

const getSportIcon = (sportType: string): string => {
  const icons: Record<string, string> = {
    cricket: 'sports_cricket', football: 'sports_soccer',
    badminton: 'sports_tennis', multi: 'sports',
  };
  return icons[sportType] || 'sports';
};

// Helper function to convert database venue to TurfCard props
const convertTurfToCardProps = (venue: any): TurfCardProps & { 
  turfId: string;
  totalTurfs?: number;
  availableSports?: string[];
  minPrice?: number;
  maxPrice?: number;
} => {
  return {
    turfId: venue.id,
    sport: venue.sport_type.charAt(0).toUpperCase() + venue.sport_type.slice(1),
    sportIcon: getSportIcon(venue.sport_type),
    name: venue.name,
    location: `${venue.city}, ${venue.state}`,
    distance: venue.location,
    rating: venue.rating || 0,
    amenities: venue.amenities?.slice(0, 3) || [],
    price: venue.price_per_hour,
    imageUrl: venue.images?.[0] || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800',
    totalTurfs: venue.total_turfs,
    availableSports: venue.available_sports,
    minPrice: venue.min_price,
    maxPrice: venue.max_price,
  };
};

// Mobile Carousel Component
function MobileCarousel({ turfs }: { turfs: any[] }) {
  return (
    <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 items-stretch" style={{ scrollSnapType: 'x mandatory' }}>
      {turfs.map(venue => (
        <div key={venue.id} className="shrink-0 w-[280px]" style={{ scrollSnapAlign: 'start' }}>
          <TurfCard {...convertTurfToCardProps(venue)} />
        </div>
      ))}
    </div>
  );
}

interface FeaturedSectionProps {
  initialTurfs: any[];
  initialError: string | null;
}

export default function FeaturedSection({ initialTurfs, initialError }: FeaturedSectionProps) {
  const [turfs, setTurfs] = useState(initialTurfs);
  const [currentError, setCurrentError] = useState(initialError);
  const [isRefetching, setIsRefetching] = useState(false);
  const { fetchTurfs } = useTurfsStore();

  // Sync initial data with Zustand store
  useEffect(() => {
    if (initialTurfs.length > 0) {
      useTurfsStore.setState({ 
        turfs: initialTurfs, 
        loading: false, 
        error: initialError 
      });
    }
  }, [initialTurfs, initialError]);

  // Fetch live ratings and merge into turfs
  useEffect(() => {
    reviewsApi.getLiveRatings()
      .then((data: any) => {
        if (!data.ratings) return;
        setTurfs(prev => prev.map(venue => {
          const live = data.ratings[(venue as any).id];
          if (!live) return venue;
          return { ...venue, rating: live.rating, total_reviews: live.total_reviews };
        }));
      })
      .catch(() => {});
  }, []);

  // Function to refetch data (for filters, refresh, etc.)
  const handleRefetch = async (filters?: any) => {
    setIsRefetching(true);
    setCurrentError(null);

    try {
      await fetchTurfs(filters);
      const state = useTurfsStore.getState();
      setTurfs(state.turfs);
      setCurrentError(state.error);
    } catch (error) {
      setCurrentError('Failed to fetch turfs');
    } finally {
      setIsRefetching(false);
    }
  };

  // Show error if initial fetch failed
  if (currentError && turfs.length === 0) {
    return (
      <section className="py-20 px-4 md:px-10 lg:px-20 max-w-[1440px] mx-auto w-full bg-black">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white">Featured Turfs</h2>
            <p className="text-gray-400 mt-3 text-lg">Top rated grounds chosen by our community</p>
          </div>
        </div>
        
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">❌ Failed to load venues</p>
          <p className="text-gray-400 mb-6">{currentError}</p>
          <button 
            onClick={() => handleRefetch()}
            className="bg-primary hover:bg-primary-hover text-black px-6 py-3 rounded-lg font-bold transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 md:px-10 lg:px-20 max-w-[1440px] mx-auto w-full bg-black">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-white">Featured Venues</h2>
          <p className="text-gray-400 mt-3 text-lg">Top rated venues chosen by our community</p>
        </div>
        <div className="flex items-center gap-4">
          {isRefetching && (
            <span className="text-primary text-sm flex items-center gap-2">
              <span className="animate-spin">⚡</span>
              Updating...
            </span>
          )}
          <Link 
            href="/turfs"
            className="text-primary hover:text-white font-medium flex items-center gap-2 transition-colors text-lg"
          >
            View all turfs
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      </div>

      {turfs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No venues available at the moment</p>
          <p className="text-gray-500 text-sm mt-2">Check back later for new listings</p>
        </div>
      ) : (
        <>
          {/* Mobile Carousel */}
          <div className="md:hidden">
            <MobileCarousel turfs={turfs} />
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {turfs.map((turf) => (
              <TurfCard key={turf.id} {...convertTurfToCardProps(turf)} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}