'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import Dropdown from '@/components/common/Dropdown';

interface BookingsFiltersProps {
  onFilterChange?: (filters: { search: string; sport: string; status: string }) => void;
}

const sportOptions = [
  { value: '', label: 'All Sports' },
  { value: 'cricket', label: 'Cricket', icon: 'sports_cricket' },
  { value: 'football', label: 'Football', icon: 'sports_soccer' },
  { value: 'badminton', label: 'Badminton', icon: 'sports_tennis' },
  { value: 'multi', label: 'Multi-Sport', icon: 'sports_kabaddi' },
];

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function BookingsFilters({ onFilterChange }: BookingsFiltersProps) {
  const [search, setSearch] = useState('');
  const [sport, setSport] = useState('');
  const [status, setStatus] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    onFilterChange?.({ search: debouncedSearch, sport, status });
  }, [debouncedSearch, sport, status]);

  return (
    <div className="relative z-20 bg-white/5 backdrop-blur-md border border-primary/10 p-4 rounded-xl flex flex-wrap items-center gap-4">
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
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Dropdown
        options={sportOptions}
        value={sport}
        onChange={setSport}
        label="Sport"
        zIndex={100}
      />

      <Dropdown
        options={statusOptions}
        value={status}
        onChange={setStatus}
        label="Status"
        zIndex={100}
      />

      <button className="ml-auto text-gray-400 hover:text-primary p-2">
        <span className="material-symbols-outlined">filter_list</span>
      </button>
    </div>
  );
}
