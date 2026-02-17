import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // Default to 30 days

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - parseInt(period));

    const { data, error } = await supabase
      .from('bookings_new')
      .select('booking_date, total_amount')
      .gte('booking_date', startDate.toISOString().split('T')[0])
      .lte('booking_date', now.toISOString().split('T')[0])
      .eq('payment_status', 'paid')
      .order('booking_date', { ascending: true });

    if (error) throw error;

    // Group by date and sum amounts
    const revenueByDate: { [key: string]: number } = {};
    
    data?.forEach((booking) => {
      const date = booking.booking_date;
      if (!revenueByDate[date]) {
        revenueByDate[date] = 0;
      }
      revenueByDate[date] += Number(booking.total_amount);
    });

    // Convert to array format for chart
    const chartData = Object.entries(revenueByDate).map(([date, amount]) => ({
      date,
      amount: Number(amount.toFixed(2)),
    }));

    return NextResponse.json({
      success: true,
      data: chartData,
    });
  } catch (error) {
    console.error('Error fetching revenue chart data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch revenue chart data' },
      { status: 500 }
    );
  }
}
