'use client';

import Dropdown, { type DropdownOption } from '@/components/common/Dropdown';

interface TurfsGridHeaderProps {
  totalResults: number;
  startIndex: number;
  endIndex: number;
  loading: boolean;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const sortOptions: DropdownOption[] = [
  { value: 'rating', label: 'Top Rated', icon: 'star' },
  { value: 'price_low', label: 'Price: Low to High', icon: 'arrow_upward' },
  { value: 'price_high', label: 'Price: High to Low', icon: 'arrow_downward' },
  { value: 'newest', label: 'Newest First', icon: 'schedule' },
];

export default function TurfsGridHeader({
  totalResults,
  startIndex,
  endIndex,
  loading,
  sortBy,
  onSortChange
}: TurfsGridHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h2 className="text-2xl font-bold">Venues</h2>
        <p className="text-gray-400">
          {loading 
            ? 'Loading...' 
            : `Showing ${totalResults > 0 ? startIndex + 1 : 0}-${Math.min(endIndex, totalResults)} of ${totalResults} venues`
          }
        </p>
      </div>
      <Dropdown
        options={sortOptions}
        value={sortBy}
        onChange={onSortChange}
        label="Sort by:"
      />
    </div>
  );
}
