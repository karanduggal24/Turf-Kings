'use client';

import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';

interface Turf {
  id: string;
  name: string;
  location: string;
  city: string;
  images: string[];
  rating: number;
  total_reviews: number;
  is_active: boolean;
  owner: {
    full_name: string;
    email: string;
  };
}

interface MaintenanceTurfsGridProps {
  searchQuery: string;
  onRefresh: () => void;
}

export default function MaintenanceTurfsGrid({ searchQuery, onRefresh }: MaintenanceTurfsGridProps) {
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaintenanceTurfs();
  }, [searchQuery]);

  async function fetchMaintenanceTurfs() {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/maintenance-turfs?page=1&limit=100&search=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setTurfs(data.turfs || []);
      }
    } catch (error) {
      console.error('Error fetching maintenance turfs:', error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleMaintenance(turfId: string, currentStatus: boolean) {
    try {
      const response = await fetch('/api/admin/venues', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: turfId,
          is_active: !currentStatus,
        }),
      });

      if (response.ok) {
        // Remove from list since it's no longer in maintenance
        setTurfs(turfs.filter(turf => turf.id !== turfId));
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

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading maintenance venues..." />;
  }

  if (turfs.length === 0) {
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
      {turfs.map((turf) => (
        <div
          key={turf.id}
          className="group bg-white/5 border border-primary/5 rounded-xl overflow-hidden hover:border-primary/40 transition-all duration-300"
        >
          {/* Image */}
          <div className="relative h-48 overflow-hidden">
            <img
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              src={turf.images[0] || '/placeholder-turf.jpg'}
              alt={turf.name}
            />
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="flex items-center gap-1 bg-gray-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                INACTIVE
              </span>
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              <a
                href={`/admin/venues/edit/${turf.id}`}
                className="w-8 h-8 bg-black/50 backdrop-blur-md text-white rounded-lg flex items-center justify-center hover:bg-primary hover:text-black transition-colors"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
              </a>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-4 left-4">
              <h3 className="text-white font-bold text-lg">{turf.name}</h3>
              <p className="text-gray-300 text-xs flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">location_on</span>
                {turf.location}, {turf.city}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-primary/10">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">
                  Owner
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                    {getInitials(turf.owner?.full_name || 'U')}
                  </div>
                  <span className="text-sm font-medium text-white">
                    {turf.owner?.full_name || 'Unknown'}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">
                  Rating
                </p>
                <div className="flex items-center gap-1 text-yellow-500">
                  <span className="material-symbols-outlined text-sm">star</span>
                  <span className="text-sm font-bold text-white">{turf.rating || 0}</span>
                  <span className="text-[10px] text-gray-500">({turf.total_reviews || 0})</span>
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
                  checked={!turf.is_active}
                  onChange={() => toggleMaintenance(turf.id, turf.is_active)}
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
