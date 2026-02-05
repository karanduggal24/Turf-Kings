'use client';

import { useEffect } from 'react';
import { useTurfsStore } from '@/stores/turfsStore';
import TurfCard from './TurfCard';
import { TurfCardProps } from '@/app/constants/types';

// Helper function to get sport icon
const getSportIcon = (sportType: string): string => {
  switch (sportType) {
    case 'cricket':
      return 'sports_cricket';
    case 'football':
      return 'sports_soccer';
    case 'badminton':
      return 'sports_tennis'; // Using tennis icon as closest to badminton
    case 'multi':
      return 'sports';
    default:
      return 'sports';
  }
};

// Helper function to convert database turf to TurfCard props
const convertTurfToCardProps = (turf: any): TurfCardProps => {
  return {
    sport: turf.sport_type.charAt(0).toUpperCase() + turf.sport_type.slice(1),
    sportIcon: getSportIcon(turf.sport_type),
    name: turf.name,
    location: `${turf.location}, ${turf.city}`,
    distance: '2.5 km', // You can calculate this based on user location later
    rating: turf.rating || 0,
    amenities: turf.amenities?.slice(0, 3) || [], // Show only first 3 amenities
    price: turf.price_per_hour,
    imageUrl: turf.images?.[0] || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800'
  };
};

// Mobile Carousel Component
function MobileCarousel({ turfs }: { turfs: any[] }) {
  return (
    <div className="relative">
      {/* Carousel Container - Pure native scroll */}
      <div 
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-8"
        style={{ 
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          overscrollBehaviorX: 'contain'
        }}
      >
        {turfs.map((turf) => (
          <div 
            key={turf.id} 
            className="shrink-0 w-72 h-[420px]"
            style={{ 
              scrollSnapAlign: 'start'
            }}
          >
            {/* Fixed size container for uniform cards */}
            <div className="w-full h-full">
              <div className="group bg-surface-dark rounded-2xl overflow-hidden hover:shadow-neon-lg transition-all duration-300 border border-surface-highlight hover:border-primary h-full flex flex-col">
                {/* Image section - fixed height */}
                <div className="relative aspect-4/3 w-full overflow-hidden shrink-0">
                  <div className="absolute top-3 left-3 z-10 bg-black/80 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 border border-surface-highlight">
                    <span className="material-symbols-outlined text-primary text-xs">{getSportIcon(turf.sport_type)}</span>
                    <span className="text-white text-xs font-bold uppercase tracking-wide">
                      {turf.sport_type.charAt(0).toUpperCase() + turf.sport_type.slice(1)}
                    </span>
                  </div>
                  <div 
                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110" 
                    style={{ backgroundImage: `url('${turf.images?.[0] || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800'}')` }}
                  ></div>
                  <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1">
                    <span className="material-symbols-outlined text-yellow-400 text-xs">star</span>
                    <span className="text-white text-xs font-bold">{turf.rating || 0}</span>
                  </div>
                </div>
                
                {/* Content section - flexible but constrained */}
                <div className="p-4 flex flex-col grow min-h-0">
                  {/* Title and location */}
                  <div className="mb-3">
                    <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors line-clamp-1">{turf.name}</h3>
                    <p className="text-gray-400 text-xs flex items-center gap-1 mt-1 line-clamp-1">
                      <span className="material-symbols-outlined text-xs">near_me</span> 
                      {turf.location}, {turf.city} • 2.5 km away
                    </p>
                  </div>
                  
                  {/* Amenities */}
                  <div className="mb-4 flex items-center gap-1 overflow-hidden flex-wrap">
                    {(turf.amenities?.slice(0, 2) || []).map((amenity: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-surface-highlight rounded-md text-xs text-gray-300 font-medium border border-surface-highlight whitespace-nowrap">
                        {amenity}
                      </span>
                    ))}
                    {turf.amenities?.length > 2 && (
                      <span className="text-xs text-gray-400">+{turf.amenities.length - 2}</span>
                    )}
                  </div>
                  
                  {/* Price and button - fixed at bottom */}
                  <div className="pt-3 border-t border-surface-highlight flex items-center justify-between mt-auto">
                    <div>
                      <p className="text-gray-400 text-xs">Starting from</p>
                      <p className="text-white font-bold text-sm">
                        ₹{turf.price_per_hour}<span className="text-xs font-normal text-gray-400">/hr</span>
                      </p>
                    </div>
                    <button className="bg-primary hover:bg-primary-hover text-black px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 neon-glow-hover">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FeaturedSection() {
  // Use Zustand store instead of custom hook
  const { turfs, loading, error, fetchTurfs } = useTurfsStore()

  useEffect(() => {
    // Fetch turfs on component mount
    fetchTurfs({ limit: 8 })
  }, [fetchTurfs])

  if (loading) {
    return (
      <section className="py-20 px-4 md:px-10 lg:px-20 max-w-[1440px] mx-auto w-full bg-black">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white">Featured Turfs</h2>
            <p className="text-gray-400 mt-3 text-lg">Top rated grounds chosen by our community</p>
          </div>
        </div>
        
        {/* Mobile Loading */}
        <div className="md:hidden">
          <div className="flex gap-4 overflow-hidden pb-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="shrink-0 w-72 h-[420px]">
                <div className="bg-surface-dark rounded-2xl overflow-hidden border border-surface-highlight animate-pulse h-full flex flex-col">
                  <div className="aspect-4/3 bg-surface-highlight shrink-0"></div>
                  <div className="p-4 flex flex-col grow min-h-0">
                    <div className="mb-3">
                      <div className="h-4 bg-surface-highlight rounded mb-2"></div>
                      <div className="h-3 bg-surface-highlight rounded w-3/4"></div>
                    </div>
                    <div className="mb-4 flex gap-2">
                      <div className="h-6 bg-surface-highlight rounded w-16"></div>
                      <div className="h-6 bg-surface-highlight rounded w-20"></div>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-surface-highlight mt-auto">
                      <div className="space-y-1">
                        <div className="h-3 bg-surface-highlight rounded w-16"></div>
                        <div className="h-4 bg-surface-highlight rounded w-12"></div>
                      </div>
                      <div className="h-8 bg-surface-highlight rounded w-20"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Loading */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-surface-dark rounded-2xl overflow-hidden border border-surface-highlight animate-pulse">
              <div className="aspect-4/3 bg-surface-highlight"></div>
              <div className="p-6 space-y-4">
                <div className="h-6 bg-surface-highlight rounded"></div>
                <div className="h-4 bg-surface-highlight rounded w-3/4"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-surface-highlight rounded w-16"></div>
                  <div className="h-6 bg-surface-highlight rounded w-20"></div>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <div className="h-8 bg-surface-highlight rounded w-20"></div>
                  <div className="h-10 bg-surface-highlight rounded w-24"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-4 md:px-10 lg:px-20 max-w-[1440px] mx-auto w-full bg-black">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white">Featured Turfs</h2>
            <p className="text-gray-400 mt-3 text-lg">Top rated grounds chosen by our community</p>
          </div>
        </div>
        
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">❌ Failed to load turfs</p>
          <p className="text-gray-400">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 md:px-10 lg:px-20 max-w-[1440px] mx-auto w-full bg-black">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-white">Featured Turfs</h2>
          <p className="text-gray-400 mt-3 text-lg">Top rated grounds chosen by our community</p>
        </div>
        <a className="text-primary hover:text-white font-medium flex items-center gap-2 transition-colors text-lg" href="#">
          View all turfs
          <span className="material-symbols-outlined">arrow_forward</span>
        </a>
      </div>

      {turfs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No turfs available at the moment</p>
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