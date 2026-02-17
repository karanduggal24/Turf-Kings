import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // First, try a simple query without joins
    const { data: allVenues, error: venuesError } = await supabase
      .from('venues')
      .select('id, is_active, approval_status, rating');

    if (venuesError) {
      console.error('Supabase error fetching venues:', venuesError);
      return NextResponse.json(
        { error: 'Database error', details: venuesError.message },
        { status: 500 }
      );
    }

    if (!allVenues) {
      return NextResponse.json({
        totalVenues: 0,
        totalTurfs: 0,
        activeVenues: 0,
        maintenanceVenues: 0,
        rejectedVenues: 0,
        avgRating: 0,
        activeTurfs: 0,
        maintenanceTurfs: 0,
        rejectedTurfs: 0,
      });
    }

    // Now get turfs count separately
    const { count: turfsCount } = await supabase
      .from('turfs_new')
      .select('*', { count: 'exact', head: true });

    const totalVenues = allVenues.length;
    const totalTurfs = turfsCount || 0;
    
    // Active venues: approved AND active
    const activeVenues = allVenues.filter(v => v.is_active === true && v.approval_status === 'approved').length;
    
    // Rejected venues: approval_status is 'rejected'
    const rejectedVenues = allVenues.filter(v => v.approval_status === 'rejected').length;
    
    // Maintenance mode venues: approved but NOT active (is_active = false)
    const maintenanceVenues = allVenues.filter(v => v.approval_status === 'approved' && v.is_active === false).length;
    
    // Calculate average rating (only for approved venues)
    const approvedVenues = allVenues.filter(v => v.approval_status === 'approved');
    const ratingsSum = approvedVenues.reduce((sum, venue) => sum + (Number(venue.rating) || 0), 0);
    const avgRating = approvedVenues.length > 0 ? (ratingsSum / approvedVenues.length).toFixed(1) : '0.0';

    const response = {
      totalVenues,
      totalTurfs,
      activeVenues,
      maintenanceVenues,
      rejectedVenues,
      avgRating: parseFloat(avgRating),
      // Use consistent naming - these are the fields the component expects
      activeTurfs: activeVenues,
      maintenanceTurfs: maintenanceVenues,
      rejectedTurfs: rejectedVenues,
    };

    console.log('Venues stats response:', response);
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error fetching venue stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch venue stats', details: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}
