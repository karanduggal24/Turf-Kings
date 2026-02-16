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

    // Build query - show approved turfs
    let query = supabase
      .from('turfs')
      .select(`
        *,
        owner:users!turfs_owner_id_fkey(full_name, email)
      `, { count: 'exact' })
      .eq('approval_status', 'approved')  // Only show approved turfs
      .order('created_at', { ascending: false });

    // Search filter
    if (search) {
      query = query.or(`name.ilike.%${search}%,location.ilike.%${search}%`);
    }

    const { data: turfs, error, count } = await query.range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({
      turfs: turfs || [],
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

    const updateData: any = {};
    if (typeof is_active !== 'undefined') {
      updateData.is_active = is_active;
    }
    if (approval_status) {
      updateData.approval_status = approval_status;
    }

    const { data, error } = await supabase
      .from('turfs')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ turf: data });
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

    // First, delete related bookings
    const { error: bookingsError } = await supabase
      .from('bookings')
      .delete()
      .eq('turf_id', id);

    if (bookingsError) {
      console.error('Error deleting bookings:', bookingsError);
      // Continue anyway - bookings might not exist
    }

    // Delete related reviews
    const { error: reviewsError } = await supabase
      .from('reviews')
      .delete()
      .eq('turf_id', id);

    if (reviewsError) {
      console.error('Error deleting reviews:', reviewsError);
      // Continue anyway - reviews might not exist
    }

    // Finally, delete the turf
    const { error } = await supabase
      .from('turfs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting turf:', error);
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
