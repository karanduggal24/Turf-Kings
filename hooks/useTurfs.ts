import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Turf {
  id: string
  name: string
  description: string | null
  location: string
  city: string
  state: string
  price_per_hour: number
  sport_type: 'cricket' | 'football' | 'badminton' | 'multi'
  amenities: string[]
  images: string[]
  rating: number
  total_reviews: number
  is_active: boolean
  owner_id: string | null
  created_at: string
  updated_at: string
}

interface UseTurfsParams {
  city?: string
  sport?: string
  page?: number
  limit?: number
}

export function useTurfs(params?: UseTurfsParams) {
  const [turfs, setTurfs] = useState<Turf[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: params?.page || 1,
    limit: params?.limit || 10,
    total: 0,
    totalPages: 0,
  })

  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        setLoading(true)
        setError(null)

        let query = supabase
          .from('turfs')
          .select('*', { count: 'exact' })
          .eq('is_active', true)
          .order('rating', { ascending: false })

        // Apply filters
        if (params?.city) {
          query = query.ilike('city', `%${params.city}%`)
        }

        if (params?.sport && params.sport !== 'all') {
          query = query.eq('sport_type', params.sport)
        }

        // Apply pagination
        const from = ((params?.page || 1) - 1) * (params?.limit || 10)
        const to = from + (params?.limit || 10) - 1
        query = query.range(from, to)

        const { data, error: fetchError, count } = await query

        if (fetchError) {
          throw fetchError
        }

        setTurfs(data || [])
        setPagination({
          page: params?.page || 1,
          limit: params?.limit || 10,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / (params?.limit || 10))
        })

      } catch (err: any) {
        console.error('Error fetching turfs:', err)
        setError(err.message || 'Failed to fetch turfs')
      } finally {
        setLoading(false)
      }
    }

    fetchTurfs()
  }, [params?.city, params?.sport, params?.page, params?.limit])

  const refetch = async () => {
    const fetchTurfs = async () => {
      try {
        setLoading(true)
        setError(null)

        let query = supabase
          .from('turfs')
          .select('*', { count: 'exact' })
          .eq('is_active', true)
          .order('rating', { ascending: false })

        if (params?.city) {
          query = query.ilike('city', `%${params.city}%`)
        }

        if (params?.sport && params.sport !== 'all') {
          query = query.eq('sport_type', params.sport)
        }

        const from = ((params?.page || 1) - 1) * (params?.limit || 10)
        const to = from + (params?.limit || 10) - 1
        query = query.range(from, to)

        const { data, error: fetchError, count } = await query

        if (fetchError) {
          throw fetchError
        }

        setTurfs(data || [])
        setPagination({
          page: params?.page || 1,
          limit: params?.limit || 10,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / (params?.limit || 10))
        })

      } catch (err: any) {
        console.error('Error fetching turfs:', err)
        setError(err.message || 'Failed to fetch turfs')
      } finally {
        setLoading(false)
      }
    }
    
    await fetchTurfs()
  }

  return {
    turfs,
    loading,
    error,
    pagination,
    refetch,
  }
}

export function useTurf(id: string) {
  const [turf, setTurf] = useState<Turf | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTurf = async () => {
      if (!id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const { data, error: fetchError } = await supabase
          .from('turfs')
          .select(`
            *,
            reviews(
              id,
              rating,
              comment,
              created_at,
              user:users(full_name)
            )
          `)
          .eq('id', id)
          .eq('is_active', true)
          .single()

        if (fetchError) {
          throw fetchError
        }

        setTurf(data)

      } catch (err: any) {
        console.error('Error fetching turf:', err)
        setError(err.message || 'Failed to fetch turf')
      } finally {
        setLoading(false)
      }
    }

    fetchTurf()
  }, [id])

  return { turf, loading, error }
}