import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all turfs with approval status
    const { data: allTurfs, error: turfsError } = await supabase
      .from('turfs')
      .select('id, is_active, approval_status, rating');

    if (turfsError) throw turfsError;

    const totalTurfs = allTurfs?.length || 0;
    const activeTurfs = allTurfs?.filter(t => t.is_active).length || 0;
    
    // Count rejected turfs
    const rejectedTurfs = allTurfs?.filter(t => t.approval_status === 'rejected').length || 0;
    
    // Count maintenance mode turfs (approved but inactive)
    const maintenanceTurfs = allTurfs?.filter(t => t.approval_status === 'approved' && !t.is_active).length || 0;
    
    // Calculate average rating
    const ratingsSum = allTurfs?.reduce((sum, turf) => sum + (Number(turf.rating) || 0), 0) || 0;
    const avgRating = totalTurfs > 0 ? (ratingsSum / totalTurfs).toFixed(1) : '0.0';

    return NextResponse.json({
      totalTurfs,
      activeTurfs,
      maintenanceTurfs,
      rejectedTurfs,
      avgRating: parseFloat(avgRating),
    });
  } catch (error) {
    console.error('Error fetching venue stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch venue stats' },
      { status: 500 }
    );
  }
}
