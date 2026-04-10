import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getOwnerVenueIds(userId: string): Promise<string[]> {
  const { data } = await supabase
    .from('venues')
    .select('id')
    .eq('owner_id', userId);
  return (data || []).map(v => v.id);
}

async function verifyOwner(token: string) {
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  const { data: userData } = await supabase
    .from('users').select('role').eq('id', user.id).single();
  if (!userData || !['turf_owner', 'admin'].includes((userData as any).role)) return null;
  return user;
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await verifyOwner(authHeader.replace('Bearer ', ''));
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const venueIds = await getOwnerVenueIds(user.id);
    if (venueIds.length === 0) {
      return NextResponse.json({
        stats: { todayEarnings: '0', todayGrowth: '0', weekEarnings: '0', weekGrowth: '0', totalRevenue: '0', totalBookings: 0, confirmedBookings: 0, cancelledBookings: 0 },
        chart: [],
        byVenue: [],
        bookingsByStatus: [],
      });
    }

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const weekStart = new Date(now); weekStart.setDate(weekStart.getDate() - 7);
    const weekStartStr = weekStart.toISOString().split('T')[0];
    const prevWeekStart = new Date(weekStart); prevWeekStart.setDate(prevWeekStart.getDate() - 7);
    const thirtyDaysAgo = new Date(now); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // All bookings for owner's venues
    const { data: allBookings } = await supabase
      .from('bookings_new')
      .select('booking_date, total_amount, status, payment_status, venue_id, venue:venues(name)')
      .in('venue_id', venueIds)
      .order('booking_date', { ascending: true });

    const bookings = allBookings || [];

    // ── Stats ──────────────────────────────────────────────────────────────────
    const sum = (arr: any[], filter: (b: any) => boolean) =>
      arr.filter(filter).reduce((s, b) => s + Number(b.total_amount), 0);

    const todayEarnings = sum(bookings, b => b.booking_date === today && b.payment_status === 'paid');
    const yesterdayEarnings = sum(bookings, b => b.booking_date === yesterdayStr && b.payment_status === 'paid');
    const weekEarnings = sum(bookings, b => b.booking_date >= weekStartStr && b.payment_status === 'paid');
    const prevWeekEarnings = sum(bookings, b =>
      b.booking_date >= prevWeekStart.toISOString().split('T')[0] &&
      b.booking_date < weekStartStr && b.payment_status === 'paid'
    );
    const totalRevenue = sum(bookings, b => b.payment_status === 'paid');
    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
    const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;

    const todayGrowth = yesterdayEarnings > 0 ? ((todayEarnings - yesterdayEarnings) / yesterdayEarnings) * 100 : 0;
    const weekGrowth = prevWeekEarnings > 0 ? ((weekEarnings - prevWeekEarnings) / prevWeekEarnings) * 100 : 0;

    // ── Revenue chart (last 30 days) ───────────────────────────────────────────
    const recentBookings = bookings.filter(b =>
      b.booking_date >= thirtyDaysAgo.toISOString().split('T')[0] && b.payment_status === 'paid'
    );
    const byDate: Record<string, number> = {};
    recentBookings.forEach(b => {
      byDate[b.booking_date] = (byDate[b.booking_date] || 0) + Number(b.total_amount);
    });
    const chart = Object.entries(byDate).map(([date, amount]) => ({ date, amount: Number(amount.toFixed(2)) }));

    // ── Revenue by venue ───────────────────────────────────────────────────────
    const byVenueMap: Record<string, { name: string; revenue: number; bookings: number }> = {};
    bookings.filter(b => b.payment_status === 'paid').forEach(b => {
      if (!byVenueMap[b.venue_id]) {
        byVenueMap[b.venue_id] = { name: (b.venue as any)?.name || 'Unknown', revenue: 0, bookings: 0 };
      }
      byVenueMap[b.venue_id].revenue += Number(b.total_amount);
      byVenueMap[b.venue_id].bookings += 1;
    });
    const byVenue = Object.values(byVenueMap).sort((a, b) => b.revenue - a.revenue);

    // ── Bookings by status ─────────────────────────────────────────────────────
    const statusMap: Record<string, number> = {};
    bookings.forEach(b => { statusMap[b.status] = (statusMap[b.status] || 0) + 1; });
    const bookingsByStatus = Object.entries(statusMap).map(([status, count]) => ({ status, count }));

    return NextResponse.json({
      stats: {
        todayEarnings: todayEarnings.toFixed(2),
        todayGrowth: todayGrowth.toFixed(1),
        weekEarnings: weekEarnings.toFixed(2),
        weekGrowth: weekGrowth.toFixed(1),
        totalRevenue: totalRevenue.toFixed(2),
        totalBookings,
        confirmedBookings,
        cancelledBookings,
      },
      chart,
      byVenue,
      bookingsByStatus,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
