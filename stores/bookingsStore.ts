import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { 
  Booking, BookingParams, CreateBookingData, BookingsState, 
  DEFAULT_BOOKING_PAGINATION, BOOKING_STORE_CONFIG 
} from '@/app/constants/booking-types'
import { Pagination } from '@/app/constants/turf-types'
import { bookingsApi } from '@/lib/api'

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
        const isSameUser = params?.user_id === state.currentUserId;
        const isCacheValid = state.lastFetched && (now - state.lastFetched) < BOOKING_STORE_CONFIG.cacheTime;
        if (!forceRefresh && isSameUser && isCacheValid && state.bookings.length > 0) return;

        set({ loading: true, error: null }, false, 'fetchBookings/start')
        try {
          const data: any = await bookingsApi.getAll(params as any);
          if (data.error) throw new Error(data.error)
          set({
            bookings: data.bookings || [],
            pagination: data.pagination || DEFAULT_BOOKING_PAGINATION,
            loading: false, error: null,
            lastFetched: Date.now(),
            currentUserId: params?.user_id || null
          }, false, 'fetchBookings/success')
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch bookings'
          set({ error: errorMessage, loading: false, bookings: [] }, false, 'fetchBookings/error')
        }
      },

      fetchBookingById: async (id: string) => {
        set({ loading: true, error: null }, false, 'fetchBookingById/start')
        try {
          const data: any = await bookingsApi.getById(id);
          if (data.error) throw new Error(data.error)
          set({ loading: false, error: null }, false, 'fetchBookingById/success')
          return data.booking
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch booking'
          set({ error: errorMessage, loading: false }, false, 'fetchBookingById/error')
          return null
        }
      },

      createBooking: async (bookingData: CreateBookingData) => {
        set({ loading: true, error: null }, false, 'createBooking/start')
        try {
          const data: any = await bookingsApi.create(bookingData as any);
          if (data.error) throw new Error(data.error)
          set({
            bookings: [data.booking, ...get().bookings],
            loading: false, error: null
          }, false, 'createBooking/success')
          return data.booking
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create booking'
          set({ error: errorMessage, loading: false }, false, 'createBooking/error')
          return null
        }
      },

      updateBooking: async (id: string, updates: Partial<Booking>) => {
        set({ loading: true, error: null }, false, 'updateBooking/start')
        try {
          const data: any = await bookingsApi.update(id, updates as any);
          if (data.error) throw new Error(data.error)
          set({
            bookings: get().bookings.map(b => b.id === id ? { ...b, ...data.booking } : b),
            loading: false, error: null
          }, false, 'updateBooking/success')
          return data.booking
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update booking'
          set({ error: errorMessage, loading: false }, false, 'updateBooking/error')
          return null
        }
      },

      cancelBooking: async (id: string) => {
        set({ loading: true, error: null }, false, 'cancelBooking/start')
        try {
          const data: any = await bookingsApi.cancel(id);
          if (data.error) throw new Error(data.error)
          set({
            bookings: get().bookings.map(b => b.id === id ? { ...b, status: 'cancelled' as const } : b),
            loading: false, error: null
          }, false, 'cancelBooking/success')
          return true
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to cancel booking'
          set({ error: errorMessage, loading: false }, false, 'cancelBooking/error')
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