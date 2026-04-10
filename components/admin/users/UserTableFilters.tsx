'use client';

import Dropdown from '@/components/common/Dropdown';

interface UserTableFiltersProps {
  searchQuery: string;
  roleFilter: string;
  onSearchChange: (query: string) => void;
  onRoleFilterChange: (role: string) => void;
}

const roleOptions = [
  { value: 'all', label: 'All Roles' },
  { value: 'user', label: 'Player' },
  { value: 'turf_owner', label: 'Turf Owner' },
  { value: 'admin', label: 'Admin' },
];

export default function UserTableFilters({
  searchQuery,
  roleFilter,
  onSearchChange,
  onRoleFilterChange,
}: UserTableFiltersProps) {
  return (
    <div className="p-6 border-b border-primary/10 flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="relative w-full md:w-96">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          search
        </span>
        <input
          className="w-full bg-black border border-primary/20 rounded-lg pl-11 pr-4 py-2.5 focus:ring-2 focus:ring-primary text-white placeholder:text-gray-500 outline-none"
          placeholder="Search by name, email or ID..."
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Dropdown
        options={roleOptions}
        value={roleFilter}
        onChange={onRoleFilterChange}
        className="w-full md:w-auto"
      />
    </div>
  );
}
