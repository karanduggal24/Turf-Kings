import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Get current user and check if admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userData?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch stats
    const { count: turfsCount } = await supabase
      .from('turfs')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    const { count: bookingsCount } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true });

    const { count: usersCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Calculate revenue (sum of all bookings)
    const { data: bookings } = await supabase
      .from('bookings')
      .select('total_amount');

    const totalRevenue = bookings?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0;

    return NextResponse.json({
      stats: {
        monthlyRevenue: totalRevenue,
        revenueChange: 12.5,
        activeTurfs: turfsCount || 0,
        turfsChange: 4,
        dailyBookings: bookingsCount || 0,
        bookingsChange: 18,
        newRegistrations: usersCount || 0,
        registrationsChange: 2400,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
