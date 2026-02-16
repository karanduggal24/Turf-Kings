'use client';

import { useState, useEffect } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface Stats {
  monthlyRevenue: number;
  revenueChange: number;
  activeTurfs: number;
  turfsChange: number;
  dailyBookings: number;
  bookingsChange: number;
  newRegistrations: number;
  registrationsChange: number;
}

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats>({
    monthlyRevenue: 0,
    revenueChange: 0,
    activeTurfs: 0,
    turfsChange: 0,
    dailyBookings: 0,
    bookingsChange: 0,
    newRegistrations: 0,
    registrationsChange: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { fetchAdminAPI } = await import('@/lib/admin-api');
      const response = await fetchAdminAPI('/api/admin/stats');
      const data = await response.json();
      
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (error) {
      // Silent fail
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Monthly Revenue',
      value: `₹${stats.monthlyRevenue.toLocaleString('en-IN')}`,
      change: `+${stats.revenueChange}%`,
      icon: 'trending_up',
      color: 'primary',
    },
    {
      title: 'Active Turfs',
      value: stats.activeTurfs.toString(),
      change: `+${stats.turfsChange} new`,
      icon: 'stadium',
      color: 'blue-500',
    },
    {
      title: 'Daily Bookings',
      value: stats.dailyBookings.toLocaleString(),
      change: `+${stats.bookingsChange}%`,
      icon: 'event_available',
      color: 'orange-500',
    },
    {
      title: 'New Registrations',
      value: stats.newRegistrations.toLocaleString(),
      change: `+${stats.registrationsChange}`,
      icon: 'person_add',
      color: 'purple-500',
    },
  ];

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading dashboard stats..." />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="bg-white/5 backdrop-blur-md border border-primary/10 p-6 rounded-2xl hover:border-primary/30 transition-all"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`w-12 h-12 rounded-xl bg-${stat.color}/10 flex items-center justify-center text-${stat.color === 'primary' ? 'primary' : stat.color}`}>
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <span className={`text-xs font-bold ${stat.color === 'primary' ? 'text-primary bg-primary/10' : `text-${stat.color} bg-${stat.color}/10`} px-2 py-1 rounded`}>
              {stat.change}
            </span>
          </div>
          <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
          <h3 className="text-2xl font-bold mt-1 text-white">{stat.value}</h3>
        </div>
      ))}
    </div>
  );
}
