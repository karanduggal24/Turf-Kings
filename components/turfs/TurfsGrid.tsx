'use client';

import { useState, useEffect } from 'react';
import { useTurfsStore } from '@/stores/turfsStore';
import type { Turf } from '@/app/constants/turf-types';
import type { FilterState } from './TurfsPageClient';
import TurfsGridHeader from './TurfsGridHeader';
import TurfsGridContent from './TurfsGridContent';
import TurfsGridPagination from './TurfsGridPagination';
import { useTurfFilters } from './hooks/useTurfFilters';
import { useTurfSort } from './hooks/useTurfSort';
import { usePagination } from './hooks/usePagination';

interface TurfsGridProps {
  initialTurfs: Turf[];
  initialError: string | null;
  filters: FilterState;
}

const ITEMS_PER_PAGE = 9;

export default function TurfsGrid({ initialTurfs, initialError, filters }: TurfsGridProps) {
  const [sortBy, setSortBy] = useState('rating');
  const [currentPage, setCurrentPage] = useState(1);
  const { turfs, setTurfs, loading } = useTurfsStore();

  useEffect(() => {
    if (initialTurfs.length > 0) {
      setTurfs(initialTurfs);
    }
  }, [initialTurfs, setTurfs]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const allTurfs = turfs.length > 0 ? turfs : initialTurfs;
  const filteredTurfs = useTurfFilters(allTurfs, filters);
  const sortedTurfs = useTurfSort(filteredTurfs, sortBy);
  const { paginatedItems, totalPages, startIndex, endIndex } = usePagination(
    sortedTurfs,
    currentPage,
    ITEMS_PER_PAGE
  );

  return (
    <section className="flex-1">
      <TurfsGridHeader
        totalResults={sortedTurfs.length}
        startIndex={startIndex}
        endIndex={endIndex}
        loading={loading}
        sortBy={sortBy}
        onSortChange={handleSortChange}
      />

      <TurfsGridContent
        turfs={paginatedItems}
        loading={loading}
        error={initialError}
      />

      {!loading && (
        <TurfsGridPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </section>
  );
}

