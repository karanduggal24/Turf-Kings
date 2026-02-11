'use client';

import { useState } from 'react';
import DashboardStats from './DashboardStats';
import RevenueChart from './RevenueChart';
import BookingShare from './BookingShare';
import RecentBookings from './RecentBookings';

export default function AdminDashboardClient() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      {/* Header */}
      <header className="h-20 flex items-center justify-between px-8 border-b border-primary/10 sticky top-0 bg-black/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-4 bg-primary/5 border border-primary/10 px-4 py-2 rounded-xl w-96">
          <span className="material-symbols-outlined text-gray-400 text-lg">search</span>
          <input
            className="bg-transparent border-none focus:ring-0 text-sm w-full text-gray-200 placeholder:text-gray-500 outline-none"
            placeholder="Search bookings, turfs, or users..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-6">
          <button className="relative p-2 text-gray-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
          </button>
          <a
            href="/list-venue"
            className="bg-primary text-black px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            New Listing
          </a>
        </div>
      </header>

      {/* Dashboard Body */}
      <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
        <DashboardStats />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>
          <BookingShare />
        </div>

        <RecentBookings />
      </div>
    </>
  );
}
