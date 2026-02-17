import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get booking counts by sport type
    const { data: bookingData, error } = await supabase
      .from('bookings_new')
      .select(`
        id,
        turf_id,
        turf:turfs_new!inner(sport_type)
      `);

    if (error) throw error;

    // Count bookings by sport type
    const sportCounts: Record<string, number> = {
      cricket: 0,
      football: 0,
      badminton: 0,
      multi: 0,
    };

    bookingData?.forEach((booking: any) => {
      const sportType = booking.turf?.sport_type;
      if (sportType && sportType in sportCounts) {
        sportCounts[sportType]++;
      }
    });

    const totalBookings = Object.values(sportCounts).reduce((sum, count) => sum + count, 0);

    // Calculate percentages
    const bookingShare = Object.entries(sportCounts).map(([sport, count]) => ({
      sport,
      count,
      percentage: totalBookings > 0 ? Math.round((count / totalBookings) * 100) : 0,
    }));

    return NextResponse.json({
      bookingShare,
      totalBookings,
    });
  } catch (error) {
    console.error('Error fetching booking share:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking share data' },
      { status: 500 }
    );
  }
}
