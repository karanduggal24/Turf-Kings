import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id,
        booking_date,
        start_time,
        end_time,
        total_amount,
        status,
        turfs (
          name
        )
      `)
      .eq('payment_status', 'paid')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    const transactions = data?.map((booking: any) => ({
      id: booking.id,
      turfName: booking.turfs?.name || 'Unknown Turf',
      date: booking.booking_date,
      startTime: booking.start_time,
      endTime: booking.end_time,
      amount: Number(booking.total_amount).toFixed(2),
      status: booking.status,
    }));

    return NextResponse.json({
      success: true,
      transactions: transactions || [],
    });
  } catch (error) {
    console.error('Error fetching recent transactions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recent transactions' },
      { status: 500 }
    );
  }
}
