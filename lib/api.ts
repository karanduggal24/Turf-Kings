/**
 * Centralized API client for all frontend fetch calls.
 * All components, stores, and hooks should use these functions
 * instead of calling fetch() directly.
 */

// ─── Core Request Helper ──────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  try {
    const { supabase } = await import('@/lib/supabase');
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      return { Authorization: `Bearer ${session.access_token}` };
    }
  } catch {}
  return {};
}

async function request<T>(
  endpoint: string,
  options: RequestInit & { auth?: boolean } = {}
): Promise<T> {
  const { auth = false, headers: extraHeaders, ...rest } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(extraHeaders as Record<string, string>),
    ...(auth ? await getAuthHeaders() : {}),
  };

  const response = await fetch(`/api${endpoint}`, { ...rest, headers });

  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new ApiError(response.status, body.error || 'Request failed');
  }

  return response.json();
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  signUp: (data: { email: string; password: string; fullName?: string; phone?: string; location?: string }) =>
    request('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),

  signIn: (data: { identifier: string; password: string }) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  getProfile: (userId: string) =>
    request(`/auth/profile?user_id=${userId}`, { auth: true }),

  updateProfile: (userId: string, data: Record<string, any>) =>
    request('/auth/profile', { method: 'PUT', auth: true, body: JSON.stringify({ user_id: userId, ...data }) }),
};

// ─── Venues (Public) ──────────────────────────────────────────────────────────

export const venuesApi = {
  create: (data: { venue: Record<string, any>; turfs: any[] }) =>
    request('/venues', { method: 'POST', body: JSON.stringify(data) }),
};

// ─── Turfs (Public) ───────────────────────────────────────────────────────────

export const turfsApi = {
  getAll: (params?: Record<string, any>) => {
    const qs = new URLSearchParams();
    Object.entries(params || {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') qs.append(k, String(v));
    });
    return request(`/turfs?${qs}`);
  },

  getById: (id: string) =>
    request(`/turfs/${id}`),

  getAvailability: (turfId: string, date: string) =>
    request(`/turfs/${turfId}/availability?date=${date}`),
};

// ─── Bookings ─────────────────────────────────────────────────────────────────

export const bookingsApi = {
  getAll: (params?: Record<string, any>) => {
    const qs = new URLSearchParams();
    Object.entries(params || {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') qs.append(k, String(v));
    });
    return request(`/bookings?${qs}`, { auth: true });
  },

  getById: (id: string) =>
    request(`/bookings/${id}`, { auth: true }),

  create: (data: Record<string, any>) =>
    request('/bookings', { method: 'POST', auth: true, body: JSON.stringify(data) }),

  update: (id: string, data: Record<string, any>) =>
    request(`/bookings/${id}`, { method: 'PUT', auth: true, body: JSON.stringify(data) }),

  cancel: (id: string) =>
    request(`/bookings/${id}`, { method: 'DELETE', auth: true }),
};

// ─── Sports & Amenities ───────────────────────────────────────────────────────

export const filtersApi = {
  getSportsTypes: () => request('/sports-types'),
  getAmenities: () => request('/amenities'),
};

// ─── Upload ───────────────────────────────────────────────────────────────────

export const uploadApi = {
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/api/upload', { method: 'POST', body: formData });
    if (!response.ok) {
      const body = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new ApiError(response.status, body.error || 'Upload failed');
    }
    return response.json();
  },
};

// ─── Owner ────────────────────────────────────────────────────────────────────

export const ownerApi = {
  getStats: () => request('/owner/stats', { auth: true }),
  getVenues: () => request('/owner/venues', { auth: true }),
  getBookings: (page = 1) => request(`/owner/bookings?page=${page}`, { auth: true }),
  getRevenue: () => request('/owner/revenue', { auth: true }),
  cancelBooking: (id: string) =>
    request(`/owner/bookings/${id}`, { method: 'PATCH', auth: true }),
  toggleVenueMaintenance: (id: string, is_active: boolean) =>
    request(`/owner/venues/${id}`, { method: 'PATCH', auth: true, body: JSON.stringify({ is_active }) }),
  getSchedule: (turfId: string, date: string) =>
    request(`/owner/schedule?turf_id=${turfId}&date=${date}`, { auth: true }),
  createBlock: (data: Record<string, any>) =>
    request('/owner/schedule', { method: 'POST', auth: true, body: JSON.stringify(data) }),
  deleteBlock: (id: string, venueId: string) =>
    request('/owner/schedule', { method: 'DELETE', auth: true, body: JSON.stringify({ id, venue_id: venueId }) }),
  blockDay: (turfId: string, venueId: string, date: string, notes?: string) =>
    request('/owner/schedule/block-day', { method: 'POST', auth: true, body: JSON.stringify({ turf_id: turfId, venue_id: venueId, block_date: date, notes }) }),
  unblockDay: (turfId: string, venueId: string, date: string) =>
    request('/owner/schedule/block-day', { method: 'DELETE', auth: true, body: JSON.stringify({ turf_id: turfId, venue_id: venueId, block_date: date }) }),
};

// ─── Admin ────────────────────────────────────────────────────────────────────

export const adminApi = {
  // Stats
  getStats: () => request('/admin/stats', { auth: true }),
  getVenuesStats: () => request('/admin/venues-stats', { auth: true }),
  getUsersStats: () => request('/admin/users-stats', { auth: true }),
  getBookingsStats: () => request('/admin/bookings-stats', { auth: true }),
  getRevenueStats: () => request('/admin/revenue-stats', { auth: true }),
  getRevenueChart: (period: string) => request(`/admin/revenue-chart?period=${period}`, { auth: true }),
  getRevenueByTurf: () => request('/admin/revenue-by-turf', { auth: true }),
  getBookingShare: () => request('/admin/booking-share', { auth: true }),
  getRecentTransactions: () => request('/admin/recent-transactions', { auth: true }),

  // Venues
  getVenues: (params?: Record<string, any>) => {
    const qs = new URLSearchParams(params as any);
    return request(`/admin/venues?${qs}`, { auth: true });
  },
  updateVenue: (id: string, data: Record<string, any>) =>
    request('/admin/venues', { method: 'PATCH', auth: true, body: JSON.stringify({ id, ...data }) }),
  deleteVenue: (id: string) =>
    request('/admin/venues', { method: 'DELETE', auth: true, body: JSON.stringify({ id }) }),
  updateVenueById: (id: string, data: Record<string, any>) =>
    request(`/admin/venues/${id}`, { method: 'PATCH', auth: true, body: JSON.stringify(data) }),
  updateVenueTurfs: (venueId: string, turfs: any[]) =>
    request(`/admin/venues/${venueId}/turfs`, { method: 'PUT', auth: true, body: JSON.stringify({ turfs }) }),

  // Pending / Rejected
  getPendingVenues: () => request('/admin/pending-venues', { auth: true }),
  getRejectedVenues: () => request('/admin/rejected-venues', { auth: true }),
  getMaintenanceTurfs: (params?: Record<string, any>) => {
    const qs = new URLSearchParams(params as any);
    return request(`/admin/maintenance-turfs?${qs}`, { auth: true });
  },

  // Bookings
  getBookings: (page: number) => request(`/admin/bookings?page=${page}&limit=10`, { auth: true }),
  updateBooking: (id: string, data: Record<string, any>) =>
    request(`/admin/bookings/${id}`, { method: 'PATCH', auth: true, body: JSON.stringify(data) }),

  // Users
  getUsers: (params?: Record<string, any>) => {
    const qs = new URLSearchParams(params as any);
    return request(`/admin/users?${qs}`, { auth: true });
  },
  updateUserRole: (id: string, role: string) =>
    request('/admin/users', { method: 'PATCH', auth: true, body: JSON.stringify({ id, role }) }),

  // Turfs
  getTurf: (id: string) => request(`/admin/turfs/${id}`, { auth: true }),
  updateTurf: (id: string, data: Record<string, any>) =>
    request(`/admin/turfs/${id}`, { method: 'PATCH', auth: true, body: JSON.stringify(data) }),
};
