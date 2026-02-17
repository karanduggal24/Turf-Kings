import { useMemo } from 'react';
import type { Turf } from '@/app/constants/turf-types';
import type { FilterState } from '../TurfsPageClient';

export function useTurfFilters(turfs: Turf[], filters: FilterState) {
  return useMemo(() => {
    return turfs.filter(turf => {
      // Sport filter - check if sport exists in available_sports array
      if (filters.sports.length > 0) {
        const venueAvailableSports = (turf as any).available_sports || [turf.sport_type];
        const hasSport = filters.sports.some(sport => venueAvailableSports.includes(sport));
        if (!hasSport) return false;
      }

      // Price filter - check if any turf price falls within range
      const minPrice = (turf as any).min_price || turf.price_per_hour;
      const maxPrice = (turf as any).max_price || turf.price_per_hour;
      
      // Venue matches if any of its turfs fall within the price range
      if (maxPrice < filters.priceRange[0] || minPrice > filters.priceRange[1]) {
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
