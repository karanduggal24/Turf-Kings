'use client';

import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface StatsData {
  todayBookings: number;
  pendingPayments: number;
  todayRevenue: number;
  occupancyRate: number;
}

export default function BookingsStats() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/admin/bookings-stats');
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
    return <LoadingSpinner size="lg" text="Loading booking stats..." />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Bookings Today */}
      <div className="bg-white/5 backdrop-blur-md border border-primary/10 p-6 rounded-xl hover:border-primary/30 transition-all">
        <p className="text-gray-400 text-sm mb-1">Total Bookings Today</p>
        <div className="flex items-end justify-between">
          <h3 className="text-3xl font-bold text-white">{stats?.todayBookings || 0}</h3>
          <span className="text-primary text-sm font-medium flex items-center">
            <span className="material-symbols-outlined text-xs">trending_up</span> +12%
          </span>
        </div>
      </div>

      {/* Pending Payments */}
      <div className="bg-white/5 backdrop-blur-md border border-primary/10 p-6 rounded-xl hover:border-primary/30 transition-all">
        <p className="text-gray-400 text-sm mb-1">Pending Payments</p>
        <div className="flex items-end justify-between">
          <h3 className="text-3xl font-bold text-amber-500">{stats?.pendingPayments || 0}</h3>
          <span className="text-amber-500/60 text-xs font-medium">Action Needed</span>
        </div>
      </div>

      {/* Revenue (24h) */}
      <div className="bg-white/5 backdrop-blur-md border border-primary/10 p-6 rounded-xl hover:border-primary/30 transition-all">
        <p className="text-gray-400 text-sm mb-1">Revenue (24h)</p>
        <div className="flex items-end justify-between">
          <h3 className="text-3xl font-bold text-white">₹{stats?.todayRevenue.toLocaleString('en-IN') || 0}</h3>
          <span className="text-primary text-sm font-medium flex items-center">
            <span className="material-symbols-outlined text-xs">payments</span>
          </span>
        </div>
      </div>

      {/* Occupancy Rate */}
      <div className="bg-white/5 backdrop-blur-md border border-primary/10 p-6 rounded-xl hover:border-primary/30 transition-all">
        <p className="text-gray-400 text-sm mb-1">Occupancy Rate</p>
        <div className="flex items-end justify-between">
          <h3 className="text-3xl font-bold text-white">{stats?.occupancyRate || 0}%</h3>
          <div className="w-16 bg-gray-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-500" 
              style={{ width: `${stats?.occupancyRate || 0}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
