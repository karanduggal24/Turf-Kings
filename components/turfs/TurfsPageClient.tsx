'use client';

import { useState } from 'react';
import TurfsGrid from './TurfsGrid';
import TurfsFilters from './TurfsFilters';
import type { Turf } from '@/app/constants/turf-types';

interface TurfsPageClientProps {
  initialTurfs: Turf[];
  initialError: string | null;
}

export interface FilterState {
  sports: string[];
  priceRange: [number, number];
  amenities: string[];
}

export default function TurfsPageClient({ initialTurfs, initialError }: TurfsPageClientProps) {
  const [filters, setFilters] = useState<FilterState>({
    sports: [],
    priceRange: [0, 5000],
    amenities: [],
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 md:px-10 lg:px-20 py-8">
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsFilterOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 bg-primary text-black px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 hover:bg-primary-hover transition-all"
      >
        <span className="material-symbols-outlined">tune</span>
        Filters
      </button>

      {/* Mobile Filter Overlay */}
      {isFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)}>
          <div 
            className="absolute right-0 top-0 h-full w-80 bg-surface-dark border-l border-surface-highlight overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-surface-dark border-b border-surface-highlight p-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">tune</span>
                Filters
              </h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="size-8 flex items-center justify-center rounded-lg hover:bg-surface-highlight transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-4">
              <TurfsFilters filters={filters} setFilters={setFilters} isMobile={true} />
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-8">
        <TurfsFilters filters={filters} setFilters={setFilters} isMobile={false} />
        <TurfsGrid 
          initialTurfs={initialTurfs} 
          initialError={initialError}
          filters={filters}
        />
      </div>
    </main>
  );
}
