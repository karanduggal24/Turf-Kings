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
        turf_id,
        total_amount,
        turfs (
          name
        )
      `)
      .eq('payment_status', 'paid');

    if (error) throw error;

    // Group by turf and sum amounts
    const revenueByTurf: { [key: string]: { name: string; amount: number } } = {};
    
    data?.forEach((booking: any) => {
      const turfId = booking.turf_id;
      const turfName = booking.turfs?.name || 'Unknown Turf';
      
      if (!revenueByTurf[turfId]) {
        revenueByTurf[turfId] = { name: turfName, amount: 0 };
      }
      revenueByTurf[turfId].amount += Number(booking.total_amount);
    });

    // Convert to array and sort by amount
    const turfRevenue = Object.values(revenueByTurf)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5) // Top 5 turfs
      .map((turf) => ({
        name: turf.name,
        amount: turf.amount.toFixed(2),
      }));

    // Calculate max for percentage
    const maxAmount = turfRevenue.length > 0 ? Number(turfRevenue[0].amount) : 0;

    const turfRevenueWithPercentage = turfRevenue.map((turf) => ({
      ...turf,
      percentage: maxAmount > 0 ? ((Number(turf.amount) / maxAmount) * 100).toFixed(0) : 0,
    }));

    return NextResponse.json({
      success: true,
      turfs: turfRevenueWithPercentage,
    });
  } catch (error) {
    console.error('Error fetching revenue by turf:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch revenue by turf' },
      { status: 500 }
    );
  }
}
