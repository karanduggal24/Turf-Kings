'use client';

import { useState, useEffect, useMemo } from 'react';
import TurfCard from '@/components/TurfCard';
import { useTurfsStore } from '@/stores/turfsStore';
import type { Turf } from '@/app/constants/turf-types';
import type { FilterState } from './TurfsPageClient';

interface TurfsGridProps {
  initialTurfs: Turf[];
  initialError: string | null;
  filters: FilterState;
}

const ITEMS_PER_PAGE = 9;

export default function TurfsGrid({ initialTurfs, initialError, filters }: TurfsGridProps) {
  const [sortBy, setSortBy] = useState('rating');
  const [currentPage, setCurrentPage] = useState(1);
  const { turfs, setTurfs, fetchTurfs, loading } = useTurfsStore();

  useEffect(() => {
    if (initialTurfs.length > 0) {
      setTurfs(initialTurfs);
    }
  }, [initialTurfs, setTurfs]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleSortChange = async (newSort: string) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const allTurfs = turfs.length > 0 ? turfs : initialTurfs;

  // Apply filters
  const filteredTurfs = useMemo(() => {
    return allTurfs.filter(turf => {
      // Sport filter
      if (filters.sports.length > 0 && !filters.sports.includes(turf.sport_type)) {
        return false;
      }

      // Price filter
      if (turf.price_per_hour < filters.priceRange[0] || turf.price_per_hour > filters.priceRange[1]) {
        return false;
      }

      // Amenities filter
      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every(amenity =>
          turf.amenities.some(turfAmenity =>
            turfAmenity.toLowerCase().includes(amenity.toLowerCase())
          )
        );
        if (!hasAllAmenities) return false;
      }

      return true;
    });
  }, [allTurfs, filters]);

  // Apply sorting
  const sortedTurfs = useMemo(() => {
    const turfsToSort = [...filteredTurfs];
    
    switch (sortBy) {
      case 'rating':
        return turfsToSort.sort((a, b) => b.rating - a.rating);
      case 'price_low':
        return turfsToSort.sort((a, b) => a.price_per_hour - b.price_per_hour);
      case 'price_high':
        return turfsToSort.sort((a, b) => b.price_per_hour - a.price_per_hour);
      case 'newest':
        return turfsToSort.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      default:
        return turfsToSort;
    }
  }, [filteredTurfs, sortBy]);
  
  // Calculate pagination
  const totalPages = Math.ceil(sortedTurfs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTurfs = sortedTurfs.slice(startIndex, endIndex);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      // Show all pages if 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      // Show pages around current page
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="flex-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold">Premium Venues</h2>
          <p className="text-gray-400">
            {loading ? 'Loading...' : `Showing ${sortedTurfs.length > 0 ? startIndex + 1 : 0}-${Math.min(endIndex, sortedTurfs.length)} of ${sortedTurfs.length} venues`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-400 shrink-0">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="bg-surface-dark border-surface-highlight rounded-lg text-sm font-medium py-2 pl-3 pr-8 focus:ring-primary focus:border-primary"
          >
            <option value="rating">Top Rated</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </div>

      {/* Error State */}
      {initialError && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6">
          <p className="text-red-400 text-sm">{initialError}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-16">
          <div className="flex flex-col items-center gap-4">
            <span className="animate-spin text-6xl">⚡</span>
            <p className="text-gray-400">Loading turfs...</p>
          </div>
        </div>
      )}

      {/* Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {paginatedTurfs.map((turf) => (
            <TurfCard
              key={turf.id}
              turfId={turf.id}
              sport={turf.sport_type}
              sportIcon={
                turf.sport_type === 'cricket' ? 'sports_cricket' :
                turf.sport_type === 'football' ? 'sports_soccer' :
                turf.sport_type === 'badminton' ? 'sports_tennis' :
                turf.sport_type === 'multi' ? 'sports' :
                'sports_soccer'
              }
              name={turf.name}
              location={`${turf.city}, ${turf.state}`}
              distance={turf.location}
              rating={turf.rating}
              amenities={turf.amenities}
              price={turf.price_per_hour}
              imageUrl={turf.images[0] || '/placeholder-turf.jpg'}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && sortedTurfs.length === 0 && !initialError && (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-6xl text-gray-600 mb-4">search_off</span>
          <h3 className="text-xl font-bold mb-2">No turfs found</h3>
          <p className="text-gray-400">Try adjusting your filters</p>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <nav className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="size-10 flex items-center justify-center rounded-lg border border-surface-highlight hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((page, index) => (
              page === '...' ? (
                <span key={`ellipsis-${index}`} className="px-2 text-gray-500">...</span>
              ) : (
                <button
                  key={page}
                  onClick={() => handlePageChange(page as number)}
                  className={`size-10 flex items-center justify-center rounded-lg font-bold transition-colors ${
                    currentPage === page
                      ? 'bg-primary text-black'
                      : 'border border-surface-highlight hover:border-primary'
                  }`}
                >
                  {page}
                </button>
              )
            ))}

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="size-10 flex items-center justify-center rounded-lg border border-surface-highlight hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </nav>
        </div>
      )}
    </section>
  );
}

