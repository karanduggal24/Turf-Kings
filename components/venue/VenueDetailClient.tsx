'use client';

import { useState } from 'react';
import Image from 'next/image';
import Button from '@/components/common/Button';
import VenueHeader from './detail/VenueHeader';
import VenueTurfsList from './detail/VenueTurfsList';
import VenueAmenitiesSidebar from './detail/VenueAmenitiesSidebar';
import VenueLocationMap from './detail/VenueLocationMap';

interface VenueDetailClientProps {
  venue: any;
}

export default function VenueDetailClient({ venue }: VenueDetailClientProps) {
  const [selectedSport, setSelectedSport] = useState<string>('all');
  
  // Get unique sports from turfs
  const availableSports = Array.from(new Set(venue.turfs?.map((t: any) => t.sport_type as string) || [])) as string[];
  
  // Filter turfs by selected sport
  const filteredTurfs = selectedSport === 'all' 
    ? venue.turfs?.filter((t: any) => t.is_active) || []
    : venue.turfs?.filter((t: any) => t.is_active && t.sport_type === selectedSport) || [];

  return (
    <main className="flex-1 bg-black">
      {/* Hero Header with Image */}
      <VenueHeader venue={venue} />

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Turfs List */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Venue */}
            <div className="bg-surface-dark border border-surface-highlight rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary">info</span>
                <h2 className="text-xl font-bold text-white">About Venue</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                {venue.description || `${venue.name} is a premier multi-sport destination featuring premium facilities and professional-grade surfaces. Perfect for both casual games and competitive matches.`}
              </p>
            </div>

            {/* Sport Filter Tabs */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setSelectedSport('all')}
                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                  selectedSport === 'all'
                    ? 'bg-primary text-black'
                    : 'bg-surface-dark border border-surface-highlight text-gray-300 hover:border-primary'
                }`}
              >
                All Sports
              </button>
              {availableSports.map((sport) => (
                <button
                  key={sport}
                  onClick={() => setSelectedSport(sport)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all capitalize ${
                    selectedSport === sport
                      ? 'bg-primary text-black'
                      : 'bg-surface-dark border border-surface-highlight text-gray-300 hover:border-primary'
                  }`}
                >
                  {sport}
                </button>
              ))}
            </div>

            {/* Available Turfs */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Available Pitches
                <span className="text-primary ml-2">
                  {selectedSport === 'all' ? 'For All Sports' : `For ${selectedSport}`}
                </span>
              </h2>
              <VenueTurfsList turfs={filteredTurfs} venueId={venue.id} />
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <VenueAmenitiesSidebar amenities={venue.amenities || []} />
            <VenueLocationMap 
              location={venue.location}
              city={venue.city}
              state={venue.state}
              phone={venue.phone}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
