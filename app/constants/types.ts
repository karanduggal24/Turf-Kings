// Component Props Interfaces
export interface TurfCardProps {
  sport: string;
  sportIcon: string;
  name: string;
  location: string;
  distance: string;
  rating: number;
  amenities: string[];
  price: number;
  imageUrl: string;
}

// Re-export all types for convenience
export * from './auth-types'
export * from './turf-types'
export * from './booking-types'
