import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const params = await context.params;
    const venueId = params.id;
    const body = await request.json();
    const { turfs } = body;

    if (!Array.isArray(turfs)) {
      return NextResponse.json(
        { error: 'Turfs must be an array' },
        { status: 400 }
      );
    }

    // Get existing turfs for this venue
    const { data: existingTurfs } = await supabase
      .from('turfs_new')
      .select('id')
      .eq('venue_id', venueId);

    const existingTurfIds = existingTurfs?.map(t => t.id) || [];
    const updatedTurfIds: string[] = [];

    // Update or insert turfs
    for (const turf of turfs) {
      if (turf.id && existingTurfIds.includes(turf.id)) {
        // Update existing turf
        const { error } = await supabase
          .from('turfs_new')
          .update({
            name: turf.name,
            sport_type: turf.sport_type,
            price_per_hour: turf.price_per_hour,
          })
          .eq('id', turf.id);

        if (error) {
          console.error('Error updating turf:', error);
          throw error;
        }
        updatedTurfIds.push(turf.id);
      } else {
        // Insert new turf
        const { data: newTurf, error } = await supabase
          .from('turfs_new')
          .insert({
            venue_id: venueId,
            name: turf.name,
            sport_type: turf.sport_type,
            price_per_hour: turf.price_per_hour,
            is_active: true,
          })
          .select()
          .single();

        if (error) {
          console.error('Error inserting turf:', error);
          throw error;
        }
        if (newTurf) {
          updatedTurfIds.push(newTurf.id);
        }
      }
    }

    // Delete turfs that were removed
    const turfsToDelete = existingTurfIds.filter(id => !updatedTurfIds.includes(id));
    if (turfsToDelete.length > 0) {
      // First delete related bookings
      const { error: bookingsError } = await supabase
        .from('bookings_new')
        .delete()
        .in('turf_id', turfsToDelete);

      if (bookingsError) {
        console.error('Error deleting bookings:', bookingsError);
      }

      // Then delete the turfs
      const { error: deleteError } = await supabase
        .from('turfs_new')
        .delete()
        .in('id', turfsToDelete);

      if (deleteError) {
        console.error('Error deleting turfs:', deleteError);
        throw deleteError;
      }
    }

    return NextResponse.json({ success: true, message: 'Turfs updated successfully' });
  } catch (error: any) {
    console.error('Error in PUT /api/admin/venues/[id]/turfs:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
