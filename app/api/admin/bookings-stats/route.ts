import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const today = new Date().toISOString().split('T')[0];

    // Get today's bookings
    const { data: todayBookings, error: todayError } = await supabase
      .from('bookings')
      .select('id')
      .eq('booking_date', today);

    if (todayError) throw todayError;

    // Get pending payments
    const { data: pendingPayments, error: pendingError } = await supabase
      .from('bookings')
      .select('id')
      .eq('payment_status', 'pending');

    if (pendingError) throw pendingError;

    // Get today's revenue
    const { data: todayRevenue, error: revenueError } = await supabase
      .from('bookings')
      .select('total_amount')
      .eq('booking_date', today)
      .eq('payment_status', 'paid');

    if (revenueError) throw revenueError;

    const revenue = todayRevenue?.reduce((sum, booking) => sum + Number(booking.total_amount), 0) || 0;

    // Calculate occupancy rate (simplified - total bookings today / total available slots)
    // Assuming 10 slots per day as a baseline
    const occupancyRate = Math.min(Math.round((todayBookings?.length || 0) / 10 * 100), 100);

    return NextResponse.json({
      todayBookings: todayBookings?.length || 0,
      pendingPayments: pendingPayments?.length || 0,
      todayRevenue: revenue,
      occupancyRate,
    });
  } catch (error) {
    console.error('Error fetching booking stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking stats' },
      { status: 500 }
    );
  }
}
