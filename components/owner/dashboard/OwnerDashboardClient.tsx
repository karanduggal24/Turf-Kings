'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ownerApi } from '@/lib/api';

interface Stats {
  totalVenues: number;
  activeVenues: number;
  pendingVenues: number;
  totalBookings: number;
  totalRevenue: number;
  totalTurfs: number;
}

const statCards = (s: Stats) => [
  { label: 'My Venues', value: s.totalVenues, icon: 'stadium', color: 'text-primary', sub: `${s.activeVenues} active` },
  { label: 'Total Turfs', value: s.totalTurfs, icon: 'sports_soccer', color: 'text-blue-400', sub: 'across all venues' },
  { label: 'Total Bookings', value: s.totalBookings, icon: 'event_available', color: 'text-purple-400', sub: 'all time' },
  { label: 'Total Revenue', value: `₹${s.totalRevenue.toLocaleString('en-IN')}`, icon: 'payments', color: 'text-yellow-400', sub: 'confirmed bookings' },
];

export default function OwnerDashboardClient() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ownerApi.getStats()
      .then((data: any) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 lg:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Overview of your venues and bookings</p>
        </div>
        <Link
          href="/list-venue"
          className="inline-flex items-center gap-2 bg-primary text-black font-bold px-5 py-2.5 rounded-xl hover:brightness-110 transition-all text-sm"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Add Venue
        </Link>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/5 border border-primary/10 rounded-xl p-6 animate-pulse h-28" />
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards(stats).map(card => (
            <div key={card.label} className="bg-white/5 border border-primary/10 rounded-xl p-6 hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className={`material-symbols-outlined text-2xl ${card.color}`}>{card.icon}</span>
              </div>
              <p className="text-2xl font-black text-white">{card.value}</p>
              <p className="text-sm text-gray-400 mt-1">{card.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{card.sub}</p>
            </div>
          ))}
        </div>
      ) : null}

      {/* Pending notice */}
      {stats && stats.pendingVenues > 0 && (
        <div className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
          <span className="material-symbols-outlined text-yellow-400 mt-0.5">info</span>
          <div>
            <p className="font-bold text-yellow-400">
              {stats.pendingVenues} venue{stats.pendingVenues > 1 ? 's' : ''} pending approval
            </p>
            <p className="text-sm text-gray-400 mt-0.5">
              Our team reviews new venues within 24 hours.
            </p>
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/owner/venues" className="group flex items-center gap-4 bg-white/5 border border-primary/10 rounded-xl p-6 hover:border-primary/40 transition-all">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <span className="material-symbols-outlined text-primary text-2xl">stadium</span>
          </div>
          <div>
            <p className="font-bold text-white">Manage Venues</p>
            <p className="text-sm text-gray-400">View and edit your listed venues</p>
          </div>
          <span className="material-symbols-outlined text-gray-600 ml-auto group-hover:text-primary transition-colors">arrow_forward</span>
        </Link>

        <Link href="/owner/bookings" className="group flex items-center gap-4 bg-white/5 border border-primary/10 rounded-xl p-6 hover:border-primary/40 transition-all">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
            <span className="material-symbols-outlined text-purple-400 text-2xl">event_available</span>
          </div>
          <div>
            <p className="font-bold text-white">View Bookings</p>
            <p className="text-sm text-gray-400">See all bookings for your venues</p>
          </div>
          <span className="material-symbols-outlined text-gray-600 ml-auto group-hover:text-primary transition-colors">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}
