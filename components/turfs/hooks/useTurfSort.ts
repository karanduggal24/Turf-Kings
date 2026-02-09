import { useMemo } from 'react';
import type { Turf } from '@/app/constants/turf-types';

export function useTurfSort(turfs: Turf[], sortBy: string) {
  return useMemo(() => {
    const turfsToSort = [...turfs];
    
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
  }, [turfs, sortBy]);
}
