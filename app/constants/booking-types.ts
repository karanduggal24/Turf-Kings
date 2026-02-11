import { Pagination } from './turf-types'

// Booking Status Types
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
} as const

export type BookingStatus = typeof BOOKING_STATUS[keyof typeof BOOKING_STATUS]

// Payment Status Types
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded'
} as const

export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS]

// Booking Data Interface
export interface Booking {
  id: string
  user_id: string
  turf_id: string
  booking_date: string
  start_time: string
  end_time: string
  total_amount: number
  status: BookingStatus
  payment_status: PaymentStatus
  payment_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
  turf?: {
    name: string
    location: string
    city: string
    images: string[]
    price_per_hour: number
  }
  user?: {
    full_name: string
    email: string
    phone: string
  }
}

// Booking Query Parameters
export interface BookingParams {
  user_id?: string
  turf_id?: string
  status?: string
  page?: number
  limit?: number
}

// Create Booking Data
export interface CreateBookingData {
  user_id: string
  turf_id: string
  booking_date: string
  start_time: string
  end_time: string
  total_amount: number
  notes?: string
}

// Booking Store State Interface
export interface BookingsState {
  // State
  bookings: Booking[]
  loading: boolean
  error: string | null
  pagination: Pagination
  lastFetched: number | null
  currentUserId: string | null
  
  // Actions
  setBookings: (bookings: Booking[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setPagination: (pagination: Pagination) => void
  fetchBookings: (params?: BookingParams, forceRefresh?: boolean) => Promise<void>
  fetchBookingById: (id: string) => Promise<Booking | null>
  createBooking: (bookingData: CreateBookingData) => Promise<Booking | null>
  updateBooking: (id: string, updates: Partial<Booking>) => Promise<Booking | null>
  cancelBooking: (id: string) => Promise<boolean>
  clearBookings: () => void
}

// Default Values
export const DEFAULT_BOOKING_PAGINATION: Pagination = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0
}

// Booking Store Configuration
export const BOOKING_STORE_CONFIG = {
  devtoolsName: 'bookings-store',
  cacheTime: 5 * 60 * 1000, // 5 minutes cache
} as const