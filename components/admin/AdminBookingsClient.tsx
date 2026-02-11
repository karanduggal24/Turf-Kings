'use client';

import { useState } from 'react';
import BookingsTable from './BookingsTable';
import BookingsStats from './BookingsStats';
import BookingsFilters from './BookingsFilters';

export default function AdminBookingsClient() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      {/* Header */}
      <header className="h-20 flex items-center justify-between px-8 border-b border-primary/10 sticky top-0 bg-black/80 backdrop-blur-md z-10">
        <h1 className="text-xl font-semibold text-white">Bookings Management</h1>

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
            Manual Entry
          </a>
        </div>
      </header>

      {/* Dashboard Body */}
      <div className="p-8 space-y-8">
        <BookingsStats />
        <BookingsFilters />
        <BookingsTable />
      </div>
    </>
  );
}
