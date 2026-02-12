'use client';

import { useState } from 'react';
import RejectedTurfsTable from './RejectedTurfsTable';
import VenuesSubNav from './VenuesSubNav';
import { useDebounce } from '@/hooks/useDebounce';

export default function AdminVenuesRejectedClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  return (
    <>
      {/* Header */}
      <header className="p-6 lg:p-10 pb-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <nav className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <span>Admin</span>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-primary/80">Venues</span>
            </nav>
            <h1 className="text-3xl font-bold text-white">Venue Management</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                search
              </span>
              <input
                className="pl-10 pr-4 py-2.5 bg-black border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none w-64 md:w-80 transition-all text-sm text-white placeholder:text-gray-500"
                placeholder="Search turfs, owners..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <a
              href="/list-venue"
              className="bg-primary hover:bg-primary/90 text-black font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Add New Venue
            </a>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <VenuesSubNav />
      </header>

      {/* Content */}
      <div className="p-6 lg:p-10 pt-0">
        <RejectedTurfsTable searchQuery={debouncedSearchQuery} />
      </div>
    </>
  );
}
