'use client';

import { useEffect, useState } from 'react';
import type { FilterState } from './TurfsPageClient';
import Button from '@/components/common/Button';
import Checkbox from '@/components/common/Checkbox';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface TurfsFiltersProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  isMobile: boolean;
}

interface SportOption {
  value: string;
  label: string;
  icon: string;
}

const amenitiesOptions = ['AC Rooms', 'Cafe', 'Parking', 'Showers', 'Equipment'];

export default function TurfsFilters({ filters, setFilters, isMobile }: TurfsFiltersProps) {
  const [sportsOptions, setSportsOptions] = useState<SportOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSportsTypes = async () => {
      try {
        const response = await fetch('/api/sports-types');
        const data = await response.json();
        
        if (data.sports) {
          setSportsOptions(data.sports);
        }
      } catch (error) {
        // Error fetching sports types
      } finally {
        setLoading(false);
      }
    };

    fetchSportsTypes();
  }, []);

  const toggleFilter = (filterType: 'sports' | 'amenities', value: string) => {
    const currentArray = filters[filterType];
    setFilters({
      ...filters,
      [filterType]: currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value]
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
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner size="sm" />
            </div>
          ) : sportsOptions.length > 0 ? (
            <div className="space-y-2">
              {sportsOptions.map((sport) => (
                <Checkbox
                  key={sport.value}
                  checked={filters.sports.includes(sport.value)}
                  onChange={() => toggleFilter('sports', sport.value)}
                  label={sport.label}
                  icon={sport.icon}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">No sports available</p>
          )}
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
                onWheel={(e) => e.currentTarget.blur()}
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
                onWheel={(e) => e.currentTarget.blur()}
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
            {amenitiesOptions.map((amenity) => (
              <button
                key={amenity}
                onClick={() => toggleFilter('amenities', amenity)}
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
