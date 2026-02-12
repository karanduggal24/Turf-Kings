/**
 * Helper function for making authenticated admin API calls
 */
export async function fetchAdminAPI(endpoint: string, options: RequestInit = {}) {
  try {
    // Get auth token from the singleton client
    const { supabase } = await import('@/lib/supabase');
    const { data: { session } } = await supabase.auth.getSession();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Merge existing headers
    if (options.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        if (typeof value === 'string') {
          headers[key] = value;
        }
      });
    }

    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }

    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    return response;
  } catch (error) {
    console.error('Admin API error:', error);
    throw error;
  }
}
