import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { 
  Turf, 
  TurfParams, 
  Pagination, 
  TurfsState, 
  DEFAULT_PAGINATION, 
  DEFAULT_TURF_FILTERS, 
  TURF_STORE_CONFIG 
} from '@/app/constants/turf-types'

export const useTurfsStore = create<TurfsState>()(
  devtools(
    (set, get) => ({
      // Initial state
      turfs: [],
      loading: false,
      error: null,
      pagination: DEFAULT_PAGINATION,
      filters: DEFAULT_TURF_FILTERS,

      // Actions
      setTurfs: (turfs) => set({ turfs }, false, 'setTurfs'),
      
      setLoading: (loading) => set({ loading }, false, 'setLoading'),
      
      setError: (error) => set({ error }, false, 'setError'),
      
      setPagination: (pagination) => set({ pagination }, false, 'setPagination'),
      
      setFilters: (filters) => {
        const newFilters = { ...get().filters, ...filters }
        set({ filters: newFilters }, false, 'setFilters')
      },

      fetchTurfs: async (params?: TurfParams) => {
        const state = get()
        const queryParams = { ...state.filters, ...params }
        
        set({ loading: true, error: null }, false, 'fetchTurfs/start')

        try {
          // Build query string
          const searchParams = new URLSearchParams()
          Object.entries(queryParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              searchParams.append(key, value.toString())
            }
          })

          const response = await fetch(`/api/turfs?${searchParams.toString()}`)
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const data = await response.json()

          if (data.error) {
            throw new Error(data.error)
          }

          set({
            turfs: data.turfs || [],
            pagination: data.pagination || DEFAULT_PAGINATION,
            filters: queryParams,
            loading: false,
            error: null
          }, false, 'fetchTurfs/success')

          // Return data for component use
          return data.turfs || []

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch turfs'
          set({
            error: errorMessage,
            loading: false,
            turfs: []
          }, false, 'fetchTurfs/error')
          
          return []
        }
      },

      fetchTurfById: async (id: string) => {
        set({ loading: true, error: null }, false, 'fetchTurfById/start')

        try {
          const response = await fetch(`/api/turfs/${id}`)
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const data = await response.json()

          if (data.error) {
            throw new Error(data.error)
          }

          set({ loading: false, error: null }, false, 'fetchTurfById/success')
          return data.turf

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch turf'
          set({
            error: errorMessage,
            loading: false
          }, false, 'fetchTurfById/error')
          return null
        }
      },

      clearTurfs: () => set({ 
        turfs: [], 
        pagination: DEFAULT_PAGINATION 
      }, false, 'clearTurfs'),

      resetFilters: () => {
        set({ filters: DEFAULT_TURF_FILTERS }, false, 'resetFilters')
        get().fetchTurfs(DEFAULT_TURF_FILTERS)
      },
    }),
    {
      name: TURF_STORE_CONFIG.devtoolsName,
    }
  )
)