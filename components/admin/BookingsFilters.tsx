'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

interface BookingsFiltersProps {
  onFilterChange?: (filters: {
    search: string;
    sport: string;
    status: string;
  }) => void;
}

export default function BookingsFilters({ onFilterChange }: BookingsFiltersProps) {
  const [search, setSearch] = useState('');
  const [sport, setSport] = useState('');
  const [status, setStatus] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  // Trigger filter change when debounced search changes
  useEffect(() => {
    onFilterChange?.({ search: debouncedSearch, sport, status });
  }, [debouncedSearch, sport, status]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleSportChange = (value: string) => {
    setSport(value);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
  };

  return (
    <div className="bg-white/5 backdrop-blur-md border border-primary/10 p-4 rounded-xl flex flex-wrap items-center gap-4">
      {/* Search */}
      <div className="relative flex-1 min-w-[240px]">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
          search
        </span>
        <input
          className="w-full bg-black border border-primary/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none text-gray-200 placeholder:text-gray-500"
          placeholder="Search by ID, Name or Phone..."
          type="text"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      {/* Sport Filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 uppercase font-semibold">Sport</span>
        <select
          className="bg-black border border-primary/10 rounded-lg px-3 py-2 text-sm text-gray-200 focus:ring-primary outline-none"
          value={sport}
          onChange={(e) => handleSportChange(e.target.value)}
        >
          <option value="">All Sports</option>
          <option value="cricket">Cricket</option>
          <option value="football">Football</option>
          <option value="badminton">Badminton</option>
          <option value="multi">Multi-Sport</option>
        </select>
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 uppercase font-semibold">Status</span>
        <select
          className="bg-black border border-primary/10 rounded-lg px-3 py-2 text-sm text-gray-200 focus:ring-primary outline-none"
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <button className="ml-auto text-gray-400 hover:text-primary p-2">
        <span className="material-symbols-outlined">filter_list</span>
      </button>
    </div>
  );
}
