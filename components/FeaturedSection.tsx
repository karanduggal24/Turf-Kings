'use client';

import { useEffect, useState } from 'react';
import { useTurfsStore } from '@/stores/turfsStore';
import TurfCard from './TurfCard';
import { TurfCardProps } from '@/app/constants/types';
import Link from 'next/link';

// Helper function to get sport icon
const getSportIcon = (sportType: string): string => {
  switch (sportType) {
    case 'cricket':
      return 'sports_cricket';
    case 'football':
      return 'sports_soccer';
    case 'badminton':
      return 'sports_tennis';
    case 'multi':
      return 'sports';
    default:
      return 'sports';
  }
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
    <div className="relative">
      <div 
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-8"
        style={{ 
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          overscrollBehaviorX: 'contain'
        }}
      >
        {turfs.map((venue) => (
          <Link 
            key={venue.id}
            href={`/turfs/${venue.id}`}
            className="shrink-0 w-72 h-[420px] block"
            style={{ scrollSnapAlign: 'start' }}
          >
            <div className="w-full h-full">
              <div className="group bg-surface-dark rounded-2xl overflow-hidden hover:shadow-neon-lg transition-all duration-300 border border-surface-highlight hover:border-primary h-full flex flex-col">
                <div className="relative aspect-4/3 w-full overflow-hidden shrink-0">
                  <div className="absolute top-3 left-3 z-10 bg-black/80 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 border border-surface-highlight">
                    <span className="material-symbols-outlined text-primary text-xs">{getSportIcon(venue.sport_type)}</span>
                    <span className="text-white text-xs font-bold uppercase tracking-wide">
                      {venue.sport_type.charAt(0).toUpperCase() + venue.sport_type.slice(1)}
                    </span>
                  </div>
                  
                  {/* Turf Count Badge */}
                  {venue.total_turfs && venue.total_turfs > 0 && (
                    <div className="absolute top-3 right-3 z-10 bg-primary/90 backdrop-blur-md px-2 py-1 rounded-full border border-primary">
                      <span className="text-black text-xs font-bold">{venue.total_turfs} Turf{venue.total_turfs !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                  
                  <div 
                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110" 
                    style={{ backgroundImage: `url('${venue.images?.[0] || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800'}')` }}
                  ></div>
                  <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1">
                    <span className="material-symbols-outlined text-yellow-400 text-xs">star</span>
                    <span className="text-white text-xs font-bold">{venue.rating || 0}</span>
                  </div>
                </div>
                
                <div className="p-4 flex flex-col grow min-h-0">
                  <div className="mb-3">
                    <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors line-clamp-1">{venue.name}</h3>
                    <p className="text-gray-400 text-xs flex items-center gap-1 mt-1 line-clamp-1">
                      <span className="material-symbols-outlined text-xs">near_me</span> 
                      {venue.city}, {venue.state} • {venue.location}
                    </p>
                  </div>
                  
                  {/* Available Sports */}
                  {venue.available_sports && venue.available_sports.length > 0 ? (
                    <div className="mb-4 flex items-center gap-1 overflow-hidden flex-wrap">
                      {venue.available_sports.slice(0, 2).map((sport: string, index: number) => (
                        <span key={index} className="flex items-center gap-1 px-2 py-1 bg-surface-highlight rounded-md text-xs text-gray-300 font-medium border border-surface-highlight whitespace-nowrap">
                          <span className="material-symbols-outlined text-xs text-primary">{getSportIcon(sport)}</span>
                          <span className="capitalize">{sport}</span>
                        </span>
                      ))}
                      {venue.available_sports.length > 2 && (
                        <span className="text-xs text-gray-400">+{venue.available_sports.length - 2}</span>
                      )}
                    </div>
                  ) : (
                    <div className="mb-4 flex items-center gap-1 overflow-hidden flex-wrap">
                      {(venue.amenities?.slice(0, 2) || []).map((amenity: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-surface-highlight rounded-md text-xs text-gray-300 font-medium border border-surface-highlight whitespace-nowrap">
                          {amenity}
                        </span>
                      ))}
                      {venue.amenities?.length > 2 && (
                        <span className="text-xs text-gray-400">+{venue.amenities.length - 2}</span>
                      )}
                    </div>
                  )}
                  
                  <div className="pt-3 border-t border-surface-highlight flex items-center justify-between mt-auto">
                    <div>
                      <p className="text-gray-400 text-xs">Starting from</p>
                      <p className="text-white font-bold text-sm">
                        {venue.min_price && venue.max_price && venue.min_price !== venue.max_price 
                          ? `₹${venue.min_price} - ₹${venue.max_price}`
                          : `₹${venue.price_per_hour}`
                        }<span className="text-xs font-normal text-gray-400">/hr</span>
                      </p>
                    </div>
                    <span className="bg-primary hover:bg-primary-hover text-black px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 neon-glow-hover">
                      Book Now
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

interface FeaturedSectionProps {
  initialTurfs: any[];
  initialError: string | null;
}

export default function FeaturedSection({ initialTurfs, initialError }: FeaturedSectionProps) {
  // Initialize with server data (no loading state on first render!)
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