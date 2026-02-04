import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Booking {
  id: string
  user_id: string
  turf_id: string
  booking_date: string
  start_time: string
  end_time: string
  total_amount: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  payment_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
  turf?: {
    name: string
    location: string
    city: string
    images: string[]
  }
  user?: {
    full_name: string
    email: string
    phone: string
  }
}

interface UseBookingsParams {
  user_id?: string
  turf_id?: string
  status?: string
  page?: number
  limit?: number
}

interface CreateBookingData {
  user_id: string
  turf_id: string
  booking_date: string
  start_time: string
  end_time: string
  total_amount: number
  notes?: string
}

export function useBookings(params?: UseBookingsParams) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: params?.page || 1,
    limit: params?.limit || 10,
    total: 0,
    totalPages: 0,
  })

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true)
        setError(null)

        let query = supabase
          .from('bookings')
          .select(`
            *,
            turf:turfs(name, location, city, images),
            user:users(full_name, email, phone)
          `, { count: 'exact' })
          .order('created_at', { ascending: false })

        // Apply filters
        if (params?.user_id) {
          query = query.eq('user_id', params.user_id)
        }

        if (params?.turf_id) {
          query = query.eq('turf_id', params.turf_id)
        }

        if (params?.status) {
          query = query.eq('status', params.status)
        }

        // Apply pagination
        const from = ((params?.page || 1) - 1) * (params?.limit || 10)
        const to = from + (params?.limit || 10) - 1
        query = query.range(from, to)

        const { data, error: fetchError, count } = await query

        if (fetchError) {
          throw fetchError
        }

        setBookings(data || [])
        setPagination({
          page: params?.page || 1,
          limit: params?.limit || 10,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / (params?.limit || 10))
        })

      } catch (err: any) {
        console.error('Error fetching bookings:', err)
        setError(err.message || 'Failed to fetch bookings')
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [params?.user_id, params?.turf_id, params?.status, params?.page, params?.limit])

  const createBooking = async (bookingData: CreateBookingData): Promise<Booking> => {
    try {
      setError(null)

      // Check for overlapping bookings
      const { data: existingBookings, error: checkError } = await supabase
        .from('bookings')
        .select('id')
        .eq('turf_id', bookingData.turf_id)
        .eq('booking_date', bookingData.booking_date)
        .or(`start_time.lte.${bookingData.end_time},end_time.gte.${bookingData.start_time}`)
        .neq('status', 'cancelled')

      if (checkError) {
        throw checkError
      }

      if (existingBookings && existingBookings.length > 0) {
        throw new Error('Time slot is already booked')
      }

      const { data: booking, error } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select(`
          *,
          turf:turfs(name, location, city, images),
          user:users(full_name, email, phone)
        `)
        .single()

      if (error) {
        throw error
      }

      // Add to local state
      setBookings(prev => [booking, ...prev])
      return booking

    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create booking'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const cancelBooking = async (id: string): Promise<void> => {
    try {
      setError(null)

      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', id)

      if (error) {
        throw error
      }

      // Update local state
      setBookings(prev => 
        prev.map((booking) => 
          booking.id === id 
            ? { ...booking, status: 'cancelled' as const }
            : booking
        )
      )

    } catch (err: any) {
      const errorMessage = err.message || 'Failed to cancel booking'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  return {
    bookings,
    loading,
    error,
    pagination,
    createBooking,
    cancelBooking,
  }
}

export function useBooking(id: string) {
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBooking = async () => {
      if (!id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const { data, error: fetchError } = await supabase
          .from('bookings')
          .select(`
            *,
            turf:turfs(name, location, city, images, price_per_hour),
            user:users(full_name, email, phone)
          `)
          .eq('id', id)
          .single()

        if (fetchError) {
          throw fetchError
        }

        setBooking(data)

      } catch (err: any) {
        console.error('Error fetching booking:', err)
        setError(err.message || 'Failed to fetch booking')
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
  }, [id])

  return { booking, loading, error }
}