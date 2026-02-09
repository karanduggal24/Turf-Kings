'use client';

interface TurfsGridHeaderProps {
  totalResults: number;
  startIndex: number;
  endIndex: number;
  loading: boolean;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

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
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-400 shrink-0">Sort by:</span>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-surface-dark border-surface-highlight rounded-lg text-sm font-medium py-2 pl-3 pr-8 focus:ring-primary focus:border-primary"
        >
          <option value="rating">Top Rated</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
          <option value="newest">Newest First</option>
        </select>
      </div>
    </div>
  );
}
