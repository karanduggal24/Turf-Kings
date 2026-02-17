import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: Request) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '6');
    const search = searchParams.get('search') || '';
    
    const offset = (page - 1) * limit;

    // Build query - show approved venues that are in maintenance mode (inactive)
    let query = supabase
      .from('venues')
      .select(`
        *,
        owner:users!venues_owner_id_fkey(full_name, email),
        turfs:turfs_new(id, name, sport_type, price_per_hour, is_active)
      `, { count: 'exact' })
      .eq('approval_status', 'approved')
      .eq('is_active', false)
      .order('created_at', { ascending: false });

    // Search filter
    if (search) {
      query = query.or(`name.ilike.%${search}%,location.ilike.%${search}%,city.ilike.%${search}%`);
    }

    const { data: venues, error, count } = await query.range(offset, offset + limit - 1);

    if (error) throw error;

    // Transform data to include turf counts and sports
    const transformedVenues = (venues || []).map(venue => ({
      ...venue,
      total_turfs: venue.turfs?.length || 0,
      available_sports: [...new Set(venue.turfs?.map((t: any) => t.sport_type) || [])],
      min_price: venue.turfs?.length > 0 ? Math.min(...venue.turfs.map((t: any) => t.price_per_hour)) : 0,
      max_price: venue.turfs?.length > 0 ? Math.max(...venue.turfs.map((t: any) => t.price_per_hour)) : 0,
    }));

    return NextResponse.json({
      venues: transformedVenues,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch maintenance venues' },
      { status: 500 }
    );
  }
}
