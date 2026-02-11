import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { 
  Booking, 
  BookingParams, 
  CreateBookingData, 
  BookingsState, 
  DEFAULT_BOOKING_PAGINATION, 
  BOOKING_STORE_CONFIG 
} from '@/app/constants/booking-types'
import { Pagination } from '@/app/constants/turf-types'

export const useBookingsStore = create<BookingsState>()(
  devtools(
    (set, get) => ({
      // Initial state
      bookings: [],
      loading: false,
      error: null,
      pagination: DEFAULT_BOOKING_PAGINATION,
      lastFetched: null,
      currentUserId: null,

      // Actions
      setBookings: (bookings) => set({ bookings }, false, 'setBookings'),
      
      setLoading: (loading) => set({ loading }, false, 'setLoading'),
      
      setError: (error) => set({ error }, false, 'setError'),
      
      setPagination: (pagination) => set({ pagination }, false, 'setPagination'),

      fetchBookings: async (params?: BookingParams, forceRefresh = false) => {
        const state = get();
        const now = Date.now();
        
        // Check if we have cached data for the same user
        const isSameUser = params?.user_id === state.currentUserId;
        const isCacheValid = state.lastFetched && (now - state.lastFetched) < BOOKING_STORE_CONFIG.cacheTime;
        
        // Return cached data if valid and not forcing refresh
        if (!forceRefresh && isSameUser && isCacheValid && state.bookings.length > 0) {
          return;
        }

        set({ loading: true, error: null }, false, 'fetchBookings/start')

        try {
          // Build query string
          const searchParams = new URLSearchParams()
          if (params) {
            Object.entries(params).forEach(([key, value]) => {
              if (value !== undefined && value !== null && value !== '') {
                searchParams.append(key, value.toString())
              }
            })
          }

          const response = await fetch(`/api/bookings?${searchParams.toString()}`)
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const data = await response.json()

          if (data.error) {
            throw new Error(data.error)
          }

          set({
            bookings: data.bookings || [],
            pagination: data.pagination || DEFAULT_BOOKING_PAGINATION,
            loading: false,
            error: null,
            lastFetched: Date.now(),
            currentUserId: params?.user_id || null
          }, false, 'fetchBookings/success')

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch bookings'
          set({
            error: errorMessage,
            loading: false,
            bookings: []
          }, false, 'fetchBookings/error')
        }
      },

      fetchBookingById: async (id: string) => {
        set({ loading: true, error: null }, false, 'fetchBookingById/start')

        try {
          const response = await fetch(`/api/bookings/${id}`)
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const data = await response.json()

          if (data.error) {
            throw new Error(data.error)
          }

          set({ loading: false, error: null }, false, 'fetchBookingById/success')
          return data.booking

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch booking'
          set({
            error: errorMessage,
            loading: false
          }, false, 'fetchBookingById/error')
          return null
        }
      },

      createBooking: async (bookingData: CreateBookingData) => {
        set({ loading: true, error: null }, false, 'createBooking/start')

        try {
          const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData),
          })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const data = await response.json()

          if (data.error) {
            throw new Error(data.error)
          }

          // Add the new booking to the current list
          const currentBookings = get().bookings
          set({
            bookings: [data.booking, ...currentBookings],
            loading: false,
            error: null
          }, false, 'createBooking/success')

          return data.booking

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create booking'
          set({
            error: errorMessage,
            loading: false
          }, false, 'createBooking/error')
          return null
        }
      },

      updateBooking: async (id: string, updates: Partial<Booking>) => {
        set({ loading: true, error: null }, false, 'updateBooking/start')

        try {
          const response = await fetch(`/api/bookings/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates),
          })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const data = await response.json()

          if (data.error) {
            throw new Error(data.error)
          }

          // Update the booking in the current list
          const currentBookings = get().bookings
          const updatedBookings = currentBookings.map(booking =>
            booking.id === id ? { ...booking, ...data.booking } : booking
          )

          set({
            bookings: updatedBookings,
            loading: false,
            error: null
          }, false, 'updateBooking/success')

          return data.booking

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update booking'
          set({
            error: errorMessage,
            loading: false
          }, false, 'updateBooking/error')
          return null
        }
      },

      cancelBooking: async (id: string) => {
        set({ loading: true, error: null }, false, 'cancelBooking/start')

        try {
          const response = await fetch(`/api/bookings/${id}`, {
            method: 'DELETE',
          })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const data = await response.json()

          if (data.error) {
            throw new Error(data.error)
          }

          // Update the booking status in the current list
          const currentBookings = get().bookings
          const updatedBookings = currentBookings.map(booking =>
            booking.id === id ? { ...booking, status: 'cancelled' as const } : booking
          )

          set({
            bookings: updatedBookings,
            loading: false,
            error: null
          }, false, 'cancelBooking/success')

          return true

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to cancel booking'
          set({
            error: errorMessage,
            loading: false
          }, false, 'cancelBooking/error')
          return false
        }
      },

      clearBookings: () => set({ 
        bookings: [], 
        pagination: DEFAULT_BOOKING_PAGINATION 
      }, false, 'clearBookings'),
    }),
    {
      name: BOOKING_STORE_CONFIG.devtoolsName,
    }
  )
)