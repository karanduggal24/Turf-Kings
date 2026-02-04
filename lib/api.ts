// API utility functions for frontend

const API_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}/api${endpoint}`
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new ApiError(response.status, error.error || 'Request failed')
  }

  return response.json()
}

// Turfs API
export const turfsApi = {
  getAll: (params?: {
    city?: string
    sport?: string
    page?: number
    limit?: number
  }) => {
    const searchParams = new URLSearchParams()
    if (params?.city) searchParams.set('city', params.city)
    if (params?.sport) searchParams.set('sport', params.sport)
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    
    return apiRequest(`/turfs?${searchParams}`)
  },

  getById: (id: string) => apiRequest(`/turfs/${id}`),

  create: (data: any) => apiRequest('/turfs', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  update: (id: string, data: any) => apiRequest(`/turfs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  delete: (id: string) => apiRequest(`/turfs/${id}`, {
    method: 'DELETE',
  }),
}

// Bookings API
export const bookingsApi = {
  getAll: (params?: {
    user_id?: string
    turf_id?: string
    status?: string
    page?: number
    limit?: number
  }) => {
    const searchParams = new URLSearchParams()
    if (params?.user_id) searchParams.set('user_id', params.user_id)
    if (params?.turf_id) searchParams.set('turf_id', params.turf_id)
    if (params?.status) searchParams.set('status', params.status)
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    
    return apiRequest(`/bookings?${searchParams}`)
  },

  getById: (id: string) => apiRequest(`/bookings/${id}`),

  create: (data: any) => apiRequest('/bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  update: (id: string, data: any) => apiRequest(`/bookings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  cancel: (id: string) => apiRequest(`/bookings/${id}`, {
    method: 'DELETE',
  }),
}

// Reviews API
export const reviewsApi = {
  getAll: (params?: {
    turf_id?: string
    user_id?: string
    page?: number
    limit?: number
  }) => {
    const searchParams = new URLSearchParams()
    if (params?.turf_id) searchParams.set('turf_id', params.turf_id)
    if (params?.user_id) searchParams.set('user_id', params.user_id)
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    
    return apiRequest(`/reviews?${searchParams}`)
  },

  create: (data: any) => apiRequest('/reviews', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
}

// Auth API
export const authApi = {
  getProfile: (userId: string) => apiRequest(`/auth/profile?user_id=${userId}`),

  updateProfile: (userId: string, data: any) => apiRequest('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify({ user_id: userId, ...data }),
  }),
}

export { ApiError }