'use client';

import { useEffect, useState } from 'react';

interface StatsData {
  totalUsers: number;
  players: number;
  turfOwners: number;
  newThisMonth: number;
  playersGrowth: number;
  newUsersGrowth: number;
  ownersGrowth: number;
}

export default function UsersStats() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/admin/users-stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/5 p-6 rounded-xl border border-primary/10 animate-pulse">
            <div className="h-10 w-10 bg-gray-700 rounded-lg mb-4"></div>
            <div className="h-8 bg-gray-700 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Players */}
      <div className="bg-white/5 border border-primary/10 p-6 rounded-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined text-6xl text-primary">groups</span>
        </div>
        <p className="text-gray-400 font-medium text-sm">Total Players</p>
        <div className="flex items-baseline gap-3 mt-2">
          <h3 className="text-4xl font-bold text-white">{stats?.players.toLocaleString() || 0}</h3>
          <span className="text-primary text-sm font-semibold flex items-center">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            {stats?.playersGrowth}%
          </span>
        </div>
        <div className="mt-4 w-full h-1 bg-gray-800 rounded-full">
          <div className="bg-primary h-full w-[85%] rounded-full shadow-[0_0_8px_rgba(51,242,13,0.5)]"></div>
        </div>
      </div>

      {/* New This Month */}
      <div className="bg-white/5 border border-primary/10 p-6 rounded-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined text-6xl text-primary">person_add</span>
        </div>
        <p className="text-gray-400 font-medium text-sm">New This Month</p>
        <div className="flex items-baseline gap-3 mt-2">
          <h3 className="text-4xl font-bold text-white">{stats?.newThisMonth || 0}</h3>
          <span className="text-primary text-sm font-semibold flex items-center">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            {stats?.newUsersGrowth}%
          </span>
        </div>
        <div className="mt-4 w-full h-1 bg-gray-800 rounded-full">
          <div className="bg-primary h-full w-[60%] rounded-full shadow-[0_0_8px_rgba(51,242,13,0.5)]"></div>
        </div>
      </div>

      {/* Active Turf Owners */}
      <div className="bg-white/5 border border-primary/10 p-6 rounded-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined text-6xl text-primary">storefront</span>
        </div>
        <p className="text-gray-400 font-medium text-sm">Active Turf Owners</p>
        <div className="flex items-baseline gap-3 mt-2">
          <h3 className="text-4xl font-bold text-white">{stats?.turfOwners || 0}</h3>
          <span className="text-primary text-sm font-semibold flex items-center">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            {stats?.ownersGrowth}%
          </span>
        </div>
        <div className="mt-4 w-full h-1 bg-gray-800 rounded-full">
          <div className="bg-primary h-full w-[40%] rounded-full shadow-[0_0_8px_rgba(51,242,13,0.5)]"></div>
        </div>
      </div>
    </div>
  );
}
