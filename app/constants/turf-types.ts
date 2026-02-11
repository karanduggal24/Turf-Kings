// Turf Data Interface
export interface Turf {
  id: string
  name: string
  description: string | null
  location: string
  city: string
  state: string
  phone: string | null
  price_per_hour: number
  sport_type: 'cricket' | 'football' | 'badminton' | 'multi'
  amenities: string[]
  images: string[]
  rating: number
  total_reviews: number
  is_active: boolean
  owner_id: string
  created_at: string
  updated_at: string
}

// Turf Query Parameters
export interface TurfParams {
  city?: string
  sport?: string
  page?: number
  limit?: number
}

// Pagination Interface (shared across stores)
export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

// Turf Store State Interface
export interface TurfsState {
  // State
  turfs: Turf[]
  loading: boolean
  error: string | null
  pagination: Pagination
  filters: TurfParams
  
  // Actions
  setTurfs: (turfs: Turf[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setPagination: (pagination: Pagination) => void
  setFilters: (filters: TurfParams) => void
  fetchTurfs: (params?: TurfParams) => Promise<Turf[]>
  fetchTurfById: (id: string) => Promise<Turf | null>
  clearTurfs: () => void
  resetFilters: () => void
}

// Default Values
export const DEFAULT_PAGINATION: Pagination = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0
}

export const DEFAULT_TURF_FILTERS: TurfParams = {
  page: 1,
  limit: 10
}

// Turf Store Configuration
export const TURF_STORE_CONFIG = {
  devtoolsName: 'turfs-store',
} as const

// Sport Types
export const SPORT_TYPES = {
  CRICKET: 'cricket',
  FOOTBALL: 'football', 
  BADMINTON: 'badminton',
  MULTI: 'multi'
} as const

export type SportType = typeof SPORT_TYPES[keyof typeof SPORT_TYPES]