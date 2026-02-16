'use client';

import type { FilterState } from './TurfsPageClient';
import Button from '@/components/common/Button';

interface TurfsFiltersProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  isMobile: boolean;
}

export default function TurfsFilters({ filters, setFilters, isMobile }: TurfsFiltersProps) {
  const toggleSport = (sport: string) => {
    setFilters({
      ...filters,
      sports: filters.sports.includes(sport)
        ? filters.sports.filter(s => s !== sport)
        : [...filters.sports, sport]
    });
  };

  const toggleAmenity = (amenity: string) => {
    setFilters({
      ...filters,
      amenities: filters.amenities.includes(amenity)
        ? filters.amenities.filter(a => a !== amenity)
        : [...filters.amenities, amenity]
    });
  };

  const resetFilters = () => {
    setFilters({
      sports: [],
      priceRange: [0, 5000],
      amenities: [],
    });
  };

  return (
    <aside className={`${isMobile ? 'w-full' : 'w-72 shrink-0 hidden lg:block sticky top-24 h-[calc(100vh-8rem)] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-primary scrollbar-track-surface-dark'}`}>
      <div className="flex flex-col gap-8">
        {!isMobile && (
          <div>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">tune</span>
              Filters
            </h2>
            <p className="text-sm text-gray-400 mb-6">Refine your perfect match</p>
          </div>
        )}

        {/* Sports Type */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Sports Type</h3>
          <div className="space-y-2">
            <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
              filters.sports.includes('football')
                ? 'bg-primary/10 border-primary'
                : 'bg-surface-dark border-surface-highlight hover:border-primary/50'
            }`}>
              <input
                type="checkbox"
                checked={filters.sports.includes('football')}
                onChange={() => toggleSport('football')}
                className="rounded border-surface-highlight bg-transparent text-primary focus:ring-primary"
              />
              <span className="material-symbols-outlined text-xl">sports_soccer</span>
              <span className="text-sm font-medium">Football</span>
            </label>

            <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
              filters.sports.includes('cricket')
                ? 'bg-primary/10 border-primary'
                : 'bg-surface-dark border-surface-highlight hover:border-primary/50'
            }`}>
              <input
                type="checkbox"
                checked={filters.sports.includes('cricket')}
                onChange={() => toggleSport('cricket')}
                className="rounded border-surface-highlight bg-transparent text-primary focus:ring-primary"
              />
              <span className="material-symbols-outlined text-xl">sports_cricket</span>
              <span className="text-sm font-medium">Cricket</span>
            </label>

            <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
              filters.sports.includes('badminton')
                ? 'bg-primary/10 border-primary'
                : 'bg-surface-dark border-surface-highlight hover:border-primary/50'
            }`}>
              <input
                type="checkbox"
                checked={filters.sports.includes('badminton')}
                onChange={() => toggleSport('badminton')}
                className="rounded border-surface-highlight bg-transparent text-primary focus:ring-primary"
              />
              <span className="material-symbols-outlined text-xl">sports_tennis</span>
              <span className="text-sm font-medium">Badminton</span>
            </label>

            <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
              filters.sports.includes('multi')
                ? 'bg-primary/10 border-primary'
                : 'bg-surface-dark border-surface-highlight hover:border-primary/50'
            }`}>
              <input
                type="checkbox"
                checked={filters.sports.includes('multi')}
                onChange={() => toggleSport('multi')}
                className="rounded border-surface-highlight bg-transparent text-primary focus:ring-primary"
              />
              <span className="material-symbols-outlined text-xl">sports</span>
              <span className="text-sm font-medium">Multi-Sport</span>
            </label>
          </div>
        </div>

        {/* Price Range */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Price (per hr)</h3>
            <span className="text-xs font-bold text-primary">₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}</span>
          </div>
          <div className="space-y-4">
            <input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={filters.priceRange[1]}
              onChange={(e) => setFilters({
                ...filters,
                priceRange: [filters.priceRange[0], parseInt(e.target.value)]
              })}
              className="w-full h-2 bg-surface-highlight rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex gap-2 text-xs">
              <input
                type="number"
                min="0"
                max={filters.priceRange[1]}
                value={filters.priceRange[0]}
                onChange={(e) => setFilters({
                  ...filters,
                  priceRange: [parseInt(e.target.value) || 0, filters.priceRange[1]]
                })}
                className="w-20 px-2 py-1 bg-surface-dark border border-surface-highlight rounded text-center"
                placeholder="Min"
              />
              <span className="flex items-center text-gray-500">-</span>
              <input
                type="number"
                min={filters.priceRange[0]}
                max="5000"
                value={filters.priceRange[1]}
                onChange={(e) => setFilters({
                  ...filters,
                  priceRange: [filters.priceRange[0], parseInt(e.target.value) || 5000]
                })}
                className="w-20 px-2 py-1 bg-surface-dark border border-surface-highlight rounded text-center"
                placeholder="Max"
              />
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {['AC Rooms', 'Cafe', 'Parking', 'Showers', 'Equipment'].map((amenity) => (
              <button
                key={amenity}
                onClick={() => toggleAmenity(amenity)}
                className={`px-3 py-1 rounded-full border text-xs font-medium transition-all ${
                  filters.amenities.includes(amenity)
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-surface-highlight bg-surface-dark hover:border-primary/50'
                }`}
              >
                {amenity}
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={resetFilters}
          variant="secondary"
          fullWidth
          className="mt-4"
        >
          Reset All Filters
        </Button>
      </div>
    </aside>
  );
}
