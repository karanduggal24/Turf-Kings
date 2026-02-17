'use client';

import { useEffect, useState } from 'react';

interface StatsData {
  totalVenues: number;
  totalTurfs: number;
  activeTurfs: number;
  maintenanceTurfs: number;
  rejectedTurfs: number;
  avgRating: number;
}

export default function VenuesStats() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/admin/venues-stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        // Error fetching stats
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white/5 p-5 rounded-xl border border-primary/10 animate-pulse">
            <div className="h-10 w-10 bg-gray-700 rounded-lg mb-4"></div>
            <div className="h-8 bg-gray-700 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Registered Venues */}
      <div className="bg-white/5 border border-primary/10 p-5 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 bg-primary/10 text-primary flex items-center justify-center rounded-lg">
            <span className="material-symbols-outlined">sports_soccer</span>
          </div>
          <span className="text-xs font-bold text-primary px-2 py-1 bg-primary/10 rounded-full">
            {stats?.totalTurfs || 0} turfs
          </span>
        </div>
        <div className="text-2xl font-bold text-white">{stats?.totalVenues || 0}</div>
        <div className="text-sm text-gray-400">Total Registered Venues</div>
      </div>

      {/* Rejected Venues */}
      <div className="bg-white/5 border border-primary/10 p-5 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 bg-red-500/10 text-red-500 flex items-center justify-center rounded-lg">
            <span className="material-symbols-outlined">cancel</span>
          </div>
          <span className="text-xs font-bold text-red-500 px-2 py-1 bg-red-500/10 rounded-full">
            Rejected
          </span>
        </div>
        <div className="text-2xl font-bold text-white">{stats?.rejectedTurfs || 0}</div>
        <div className="text-sm text-gray-400">Rejected Venues</div>
      </div>

      {/* Avg Customer Rating */}
      <div className="bg-white/5 border border-primary/10 p-5 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 bg-yellow-500/10 text-yellow-500 flex items-center justify-center rounded-lg">
            <span className="material-symbols-outlined">star</span>
          </div>
          <span className="text-xs font-bold text-yellow-500 px-2 py-1 bg-yellow-500/10 rounded-full">
            Top Rated
          </span>
        </div>
        <div className="text-2xl font-bold text-white">{stats?.avgRating || 0}</div>
        <div className="text-sm text-gray-400">Avg. Customer Rating</div>
      </div>

      {/* Maintenance Mode */}
      <div className="bg-white/5 border border-primary/10 p-5 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 bg-primary/10 text-primary flex items-center justify-center rounded-lg">
            <span className="material-symbols-outlined">construction</span>
          </div>
          <span className="text-xs font-bold text-gray-400 px-2 py-1 bg-gray-400/10 rounded-full">
            Inactive
          </span>
        </div>
        <div className="text-2xl font-bold text-white">{String(stats?.maintenanceTurfs || 0).padStart(2, '0')}</div>
        <div className="text-sm text-gray-400">Maintenance Mode</div>
      </div>
    </div>
  );
}
