import { useMemo } from 'react';
import type { Turf } from '@/app/constants/turf-types';
import type { FilterState } from '../TurfsPageClient';

export function useTurfFilters(turfs: Turf[], filters: FilterState) {
  return useMemo(() => {
    return turfs.filter(turf => {
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
  }, [turfs, filters]);
}
