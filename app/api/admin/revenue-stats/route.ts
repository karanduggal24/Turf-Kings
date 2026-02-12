import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    // Calculate week start (last 7 days)
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - 7);
    const weekStartStr = weekStart.toISOString().split('T')[0];

    // Calculate month start (last 30 days)
    const monthStart = new Date(now);
    monthStart.setDate(monthStart.getDate() - 30);
    const monthStartStr = monthStart.toISOString().split('T')[0];

    // Today's earnings
    const { data: todayData, error: todayError } = await supabase
      .from('bookings')
      .select('total_amount')
      .eq('booking_date', today)
      .in('payment_status', ['paid']);

    if (todayError) throw todayError;

    const todayEarnings = todayData?.reduce((sum, booking) => sum + Number(booking.total_amount), 0) || 0;

    // Yesterday's earnings for comparison
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const { data: yesterdayData } = await supabase
      .from('bookings')
      .select('total_amount')
      .eq('booking_date', yesterdayStr)
      .in('payment_status', ['paid']);

    const yesterdayEarnings = yesterdayData?.reduce((sum, booking) => sum + Number(booking.total_amount), 0) || 0;
    const todayGrowth = yesterdayEarnings > 0 ? ((todayEarnings - yesterdayEarnings) / yesterdayEarnings) * 100 : 0;

    // This week's earnings
    const { data: weekData, error: weekError } = await supabase
      .from('bookings')
      .select('total_amount')
      .gte('booking_date', weekStartStr)
      .lte('booking_date', today)
      .in('payment_status', ['paid']);

    if (weekError) throw weekError;

    const weekEarnings = weekData?.reduce((sum, booking) => sum + Number(booking.total_amount), 0) || 0;

    // Previous week for comparison
    const prevWeekStart = new Date(weekStart);
    prevWeekStart.setDate(prevWeekStart.getDate() - 7);
    const prevWeekStartStr = prevWeekStart.toISOString().split('T')[0];
    const prevWeekEndStr = weekStartStr;

    const { data: prevWeekData } = await supabase
      .from('bookings')
      .select('total_amount')
      .gte('booking_date', prevWeekStartStr)
      .lt('booking_date', prevWeekEndStr)
      .in('payment_status', ['paid']);

    const prevWeekEarnings = prevWeekData?.reduce((sum, booking) => sum + Number(booking.total_amount), 0) || 0;
    const weekGrowth = prevWeekEarnings > 0 ? ((weekEarnings - prevWeekEarnings) / prevWeekEarnings) * 100 : 0;

    // Pending payouts (completed bookings with paid status)
    const { data: pendingData, error: pendingError } = await supabase
      .from('bookings')
      .select('total_amount')
      .eq('status', 'completed')
      .eq('payment_status', 'paid');

    if (pendingError) throw pendingError;

    const pendingPayouts = pendingData?.reduce((sum, booking) => sum + Number(booking.total_amount), 0) || 0;

    // Total profit (all paid bookings)
    const { data: totalData, error: totalError } = await supabase
      .from('bookings')
      .select('total_amount, base_amount, service_fee, booking_fee')
      .eq('payment_status', 'paid');

    if (totalError) throw totalError;

    const totalRevenue = totalData?.reduce((sum, booking) => sum + Number(booking.total_amount), 0) || 0;
    const totalBaseCost = totalData?.reduce((sum, booking) => sum + Number(booking.base_amount || 0), 0) || 0;
    const totalServiceFee = totalData?.reduce((sum, booking) => sum + Number(booking.service_fee || 0), 0) || 0;
    const totalBookingFee = totalData?.reduce((sum, booking) => sum + Number(booking.booking_fee || 0), 0) || 0;

    return NextResponse.json({
      success: true,
      stats: {
        todayEarnings: todayEarnings.toFixed(2),
        todayGrowth: todayGrowth.toFixed(1),
        weekEarnings: weekEarnings.toFixed(2),
        weekGrowth: weekGrowth.toFixed(1),
        pendingPayouts: pendingPayouts.toFixed(2),
        totalProfit: totalRevenue.toFixed(2),
        totalRevenue: totalRevenue.toFixed(2),
        baseCost: totalBaseCost.toFixed(2),
        serviceFee: totalServiceFee.toFixed(2),
        bookingFee: totalBookingFee.toFixed(2),
      },
    });
  } catch (error) {
    console.error('Error fetching revenue stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch revenue stats' },
      { status: 500 }
    );
  }
}
