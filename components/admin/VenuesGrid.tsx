'use client';

import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

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

interface VenuesGridProps {
  searchQuery: string;
  onStatsChange: () => void;
}

export default function VenuesGrid({ searchQuery, onStatsChange }: VenuesGridProps) {
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    fetchTurfs();
  }, [page, debouncedSearchQuery]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery]);

  async function fetchTurfs() {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/venues?page=${page}&limit=6&search=${encodeURIComponent(debouncedSearchQuery)}`
      );
      if (response.ok) {
        const data = await response.json();
        setTurfs(data.turfs);
        setTotalPages(data.pagination.totalPages);
        setTotal(data.pagination.total);
      }
    } catch (error) {
      console.error('Error fetching turfs:', error);
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
        // Update local state
        setTurfs(turfs.map(turf => 
          turf.id === turfId ? { ...turf, is_active: !currentStatus } : turf
        ));
        // Trigger stats refresh
        onStatsChange();
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
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white/5 border border-primary/5 rounded-xl overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-700"></div>
            <div className="p-5 space-y-4">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
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
                <span
                  className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${
                    turf.is_active
                      ? 'bg-primary text-black'
                      : 'bg-gray-500 text-white'
                  }`}
                >
                  {turf.is_active && (
                    <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse"></span>
                  )}
                  {turf.is_active ? 'ACTIVE' : 'INACTIVE'}
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
                  <span className="text-[10px] text-gray-500">Users cannot book while ON</span>
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

        {/* Add New Placeholder */}
        <a
          href="/list-venue"
          className="flex flex-col items-center justify-center border-2 border-dashed border-primary/20 bg-primary/5 rounded-xl min-h-[400px] group hover:bg-primary/10 transition-all"
        >
          <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-3xl">add</span>
          </div>
          <h4 className="text-lg font-bold text-white">Register New Venue</h4>
          <p className="text-sm text-gray-400 px-10 text-center">
            Add another turf to the network and expand your management reach.
          </p>
        </a>
      </div>

      {/* Pagination */}
      <div className="mt-12 flex items-center justify-between border-t border-primary/10 pt-6">
        <p className="text-sm text-gray-400">
          Showing <span className="font-bold text-white">{turfs.length}</span> of{' '}
          <span className="font-bold text-white">{total}</span> venues
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="p-2 border border-primary/20 rounded-lg hover:bg-primary/10 disabled:opacity-50 transition-all"
          >
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={`w-10 h-10 rounded-lg transition-all ${
                page === pageNum
                  ? 'bg-primary text-black font-bold shadow-sm'
                  : 'border border-primary/20 hover:bg-primary/10 text-white'
              }`}
            >
              {pageNum}
            </button>
          ))}
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="p-2 border border-primary/20 rounded-lg hover:bg-primary/10 disabled:opacity-50 transition-all"
          >
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>
    </>
  );
}
