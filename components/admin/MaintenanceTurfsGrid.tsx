'use client';

import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import Image from 'next/image';

interface Turf {
  id: string;
  name: string;
  sport_type: string;
  price_per_hour: number;
  is_active: boolean;
}

interface Venue {
  id: string;
  name: string;
  location: string;
  city: string;
  state: string;
  images: string[];
  rating: number;
  total_reviews: number;
  is_active: boolean;
  owner: {
    full_name: string;
    email: string;
  };
  turfs: Turf[];
  total_turfs: number;
  available_sports: string[];
  min_price: number;
  max_price: number;
}

interface MaintenanceTurfsGridProps {
  searchQuery: string;
  onRefresh: () => void;
}

export default function MaintenanceTurfsGrid({ searchQuery, onRefresh }: MaintenanceTurfsGridProps) {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaintenanceVenues();
  }, [searchQuery]);

  async function fetchMaintenanceVenues() {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/maintenance-turfs?page=1&limit=100&search=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setVenues(data.venues || []);
      }
    } catch (error) {
      console.error('Error fetching maintenance venues:', error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleMaintenance(venueId: string, currentStatus: boolean) {
    try {
      const response = await fetch('/api/admin/venues', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: venueId,
          is_active: !currentStatus,
        }),
      });

      if (response.ok) {
        // Remove from list since it's no longer in maintenance
        setVenues(venues.filter(venue => venue.id !== venueId));
        onRefresh();
      }
    } catch (error) {
      console.error('Error toggling maintenance:', error);
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getSportIcon = (sport: string) => {
    const icons: Record<string, string> = {
      football: 'sports_soccer',
      cricket: 'sports_cricket',
      badminton: 'sports_tennis',
      multi: 'sports_kabaddi',
    };
    return icons[sport] || 'sports';
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading maintenance venues..." />;
  }

  if (venues.length === 0) {
    return (
      <EmptyState
        icon="construction"
        title="No venues in maintenance mode"
        description="All venues are currently active and available for booking"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {venues.map((venue) => (
        <div
          key={venue.id}
          className="group bg-white/5 border border-primary/5 rounded-xl overflow-hidden hover:border-primary/40 transition-all duration-300"
        >
          {/* Image */}
          <div className="relative h-48 overflow-hidden">
            <Image
              src={venue.images[0] || '/placeholder-turf.jpg'}
              alt={venue.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="flex items-center gap-1 bg-gray-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                INACTIVE
              </span>
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              <a
                href={`/admin/venues/edit/${venue.id}`}
                className="w-8 h-8 bg-black/50 backdrop-blur-md text-white rounded-lg flex items-center justify-center hover:bg-primary hover:text-black transition-colors"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
              </a>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-white font-bold text-lg">{venue.name}</h3>
              <div className="flex items-center justify-between">
                <p className="text-gray-300 text-xs flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">location_on</span>
                  {venue.city}, {venue.state}
                </p>
                {venue.total_turfs > 0 && (
                  <span className="text-xs bg-gray-500/20 text-gray-300 px-2 py-0.5 rounded-full font-bold">
                    {venue.total_turfs} turf{venue.total_turfs !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Turfs Info */}
            {venue.turfs && venue.turfs.length > 0 && (
              <div className="mb-4 pb-4 border-b border-primary/10">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-2">
                  Available Sports
                </p>
                <div className="flex flex-wrap gap-2">
                  {venue.available_sports.slice(0, 3).map((sport, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-gray-500/10 text-gray-300 text-xs rounded-full border border-gray-500/20"
                    >
                      <span className="material-symbols-outlined text-xs">
                        {getSportIcon(sport)}
                      </span>
                      <span className="capitalize">{sport}</span>
                    </span>
                  ))}
                  {venue.available_sports.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 bg-gray-500/10 text-gray-300 text-xs rounded-full border border-gray-500/20">
                      +{venue.available_sports.length - 3} more
                    </span>
                  )}
                </div>
                {venue.min_price > 0 && (
                  <div className="mt-2 text-xs text-gray-400">
                    Price: <span className="text-white font-bold">₹{venue.min_price}</span>
                    {venue.min_price !== venue.max_price && (
                      <> - <span className="text-white font-bold">₹{venue.max_price}</span></>
                    )}/hr
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between mb-4 pb-4 border-b border-primary/10">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">
                  Owner
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                    {getInitials(venue.owner?.full_name || 'U')}
                  </div>
                  <span className="text-sm font-medium text-white">
                    {venue.owner?.full_name || 'Unknown'}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">
                  Rating
                </p>
                <div className="flex items-center gap-1 text-yellow-500">
                  <span className="material-symbols-outlined text-sm">star</span>
                  <span className="text-sm font-bold text-white">{venue.rating || 0}</span>
                  <span className="text-[10px] text-gray-500">({venue.total_reviews || 0})</span>
                </div>
              </div>
            </div>

            {/* Maintenance Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-gray-400">Maintenance Mode</span>
                <span className="text-[10px] text-gray-500">Turn OFF to activate venue</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={!venue.is_active}
                  onChange={() => toggleMaintenance(venue.id, venue.is_active)}
                />
                <div className="w-11 h-6 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
