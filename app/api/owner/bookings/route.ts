import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: userData } = await supabase
      .from('users').select('role').eq('id', user.id).single();
    if (!userData || !['turf_owner', 'admin'].includes(userData.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 10;
    const offset = (page - 1) * limit;

    // Get owner's venue IDs first
    const { data: venues } = await supabase
      .from('venues').select('id').eq('owner_id', user.id);
    const venueIds = (venues || []).map(v => v.id);

    if (venueIds.length === 0) {
      return NextResponse.json({ bookings: [], pagination: { page, totalPages: 0, total: 0 } });
    }

    const { data: bookings, count, error } = await supabase
      .from('bookings_new')
      .select(`
        id, booking_date, start_time, end_time, total_amount, status, payment_status, created_at,
        user:users(full_name, email, phone),
        venue:venues(name, city),
        turf:turfs_new(name, sport_type)
      `, { count: 'exact' })
      .in('venue_id', venueIds)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({
      bookings: bookings || [],
      pagination: { page, totalPages: Math.ceil((count || 0) / limit), total: count || 0 },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
