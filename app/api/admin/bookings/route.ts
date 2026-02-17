import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: Request) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const sportFilter = searchParams.get('sport') || '';
    const statusFilter = searchParams.get('status') || '';
    
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('bookings_new')
      .select(`
        *,
        user:users(full_name, email, phone),
        turf:turfs_new(name, sport_type),
        venue:venues(name, location, city)
      `, { count: 'exact' })
      .order('created_at', { ascending: false });

    // Apply filters
    if (statusFilter) {
      query = query.eq('status', statusFilter);
    }

    const { data: bookings, error, count } = await query.range(offset, offset + limit - 1);

    if (error) throw error;

    // Filter by sport type if needed (client-side filter since it's in related table)
    let filteredBookings = bookings || [];
    if (sportFilter) {
      filteredBookings = filteredBookings.filter(
        (booking: any) => booking.turf?.sport_type === sportFilter
      );
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredBookings = filteredBookings.filter((booking: any) => 
        booking.id.toLowerCase().includes(searchLower) ||
        booking.user?.full_name?.toLowerCase().includes(searchLower) ||
        booking.user?.phone?.includes(search)
      );
    }

    return NextResponse.json({
      bookings: filteredBookings,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
