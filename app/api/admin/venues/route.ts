import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: Request) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '6');
    const search = searchParams.get('search') || '';
    
    const offset = (page - 1) * limit;

    // Build query - show approved venues
    let query = supabase
      .from('venues')
      .select(`
        *,
        owner:users!venues_owner_id_fkey(full_name, email)
      `, { count: 'exact' })
      .eq('approval_status', 'approved')
      .order('created_at', { ascending: false });

    // Search filter
    if (search) {
      query = query.or(`name.ilike.%${search}%,location.ilike.%${search}%,city.ilike.%${search}%`);
    }

    const { data: venues, error, count } = await query.range(offset, offset + limit - 1);

    if (error) throw error;

    // Fetch turfs for each venue
    const venuesWithTurfs = await Promise.all(
      (venues || []).map(async (venue) => {
        const { data: turfs } = await supabase
          .from('turfs_new')
          .select('*')
          .eq('venue_id', venue.id);

        return {
          ...venue,
          turfs: turfs || [],
          total_turfs: turfs?.length || 0,
          available_sports: [...new Set(turfs?.map(t => t.sport_type) || [])],
          min_price: turfs && turfs.length > 0 ? Math.min(...turfs.map(t => t.price_per_hour)) : 0,
          max_price: turfs && turfs.length > 0 ? Math.max(...turfs.map(t => t.price_per_hour)) : 0,
        };
      })
    );

    return NextResponse.json({
      turfs: venuesWithTurfs, // Keep as 'turfs' for backward compatibility
      venues: venuesWithTurfs,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching venues:', error);
    return NextResponse.json(
      { error: 'Failed to fetch venues' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body = await request.json();
    const { id, is_active, approval_status } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Venue ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (typeof is_active !== 'undefined') {
      updateData.is_active = is_active;
    }
    if (approval_status) {
      updateData.approval_status = approval_status;
    }

    // Update the venue in the venues table
    const { data, error } = await supabase
      .from('venues')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating venue:', error);
      throw error;
    }

    return NextResponse.json({ venue: data });
  } catch (error) {
    console.error('Error updating venue:', error);
    return NextResponse.json(
      { error: 'Failed to update venue' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Venue ID is required' },
        { status: 400 }
      );
    }

    // First, get all turfs for this venue
    const { data: turfs, error: turfsError } = await supabase
      .from('turfs_new')
      .select('id')
      .eq('venue_id', id);

    if (turfsError) {
      console.error('Error fetching turfs:', turfsError);
    }

    const turfIds = turfs?.map(t => t.id) || [];

    // Delete related bookings for all turfs in this venue
    if (turfIds.length > 0) {
      const { error: bookingsError } = await supabase
        .from('bookings_new')
        .delete()
        .in('turf_id', turfIds);

      if (bookingsError) {
        console.error('Error deleting bookings:', bookingsError);
      }
    }

    // Delete related reviews for this venue
    const { error: reviewsError } = await supabase
      .from('reviews')
      .delete()
      .eq('venue_id', id);

    if (reviewsError) {
      console.error('Error deleting reviews:', reviewsError);
    }

    // Delete all turfs for this venue
    const { error: deleteTurfsError } = await supabase
      .from('turfs_new')
      .delete()
      .eq('venue_id', id);

    if (deleteTurfsError) {
      console.error('Error deleting turfs:', deleteTurfsError);
      throw deleteTurfsError;
    }

    // Finally, delete the venue
    const { error } = await supabase
      .from('venues')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting venue:', error);
      throw error;
    }

    return NextResponse.json({ success: true, message: 'Venue deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting venue:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete venue' },
      { status: 500 }
    );
  }
}
