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

    // Verify turf_owner role
    const { data: userData } = await supabase
      .from('users').select('role').eq('id', user.id).single();
    if (!userData || !['turf_owner', 'admin'].includes(userData.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get owner's venues
    const { data: venues } = await supabase
      .from('venues')
      .select('id, approval_status, is_active')
      .eq('owner_id', user.id);

    const venueIds = (venues || []).map(v => v.id);
    const totalVenues = venues?.length || 0;
    const activeVenues = venues?.filter(v => v.is_active && v.approval_status === 'approved').length || 0;
    const pendingVenues = venues?.filter(v => v.approval_status === 'pending').length || 0;

    if (venueIds.length === 0) {
      return NextResponse.json({ totalVenues, activeVenues, pendingVenues, totalBookings: 0, totalRevenue: 0, totalTurfs: 0 });
    }

    // Get turfs count
    const { count: totalTurfs } = await supabase
      .from('turfs_new')
      .select('*', { count: 'exact', head: true })
      .in('venue_id', venueIds);

    // Get bookings for owner's venues
    const { data: bookings } = await supabase
      .from('bookings_new')
      .select('total_amount, status')
      .in('venue_id', venueIds);

    const totalBookings = bookings?.length || 0;
    const totalRevenue = bookings
      ?.filter(b => b.status !== 'cancelled')
      .reduce((sum, b) => sum + Number(b.total_amount), 0) || 0;

    return NextResponse.json({ totalVenues, activeVenues, pendingVenues, totalBookings, totalRevenue, totalTurfs: totalTurfs || 0 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
