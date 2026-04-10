import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function verifyOwner(token: string) {
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  const { data } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (!data || !['turf_owner', 'admin'].includes((data as any).role)) return null;
  return user;
}

async function ownsVenue(userId: string, venueId: string) {
  const { data } = await supabase.from('venues').select('owner_id').eq('id', venueId).single();
  return data?.owner_id === userId;
}

// GET — fetch blocks + bookings for a turf on a date
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = await verifyOwner(authHeader.replace('Bearer ', ''));
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const turfId = searchParams.get('turf_id');
    const date = searchParams.get('date');
    if (!turfId || !date) return NextResponse.json({ error: 'turf_id and date required' }, { status: 400 });

    const [{ data: blocks }, { data: bookings }] = await Promise.all([
      supabase.from('turf_blocks').select('*').eq('turf_id', turfId).eq('block_date', date),
      supabase.from('bookings_new')
        .select('id, start_time, end_time, status, user:users(full_name, phone)')
        .eq('turf_id', turfId).eq('booking_date', date)
        .in('status', ['pending', 'confirmed']),
    ]);

    return NextResponse.json({ blocks: blocks || [], bookings: bookings || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST — create a block or manual booking
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = await verifyOwner(authHeader.replace('Bearer ', ''));
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request.json();
    const { turf_id, venue_id, block_date, start_time, end_time, block_type, customer_name, customer_phone, notes } = body;

    if (!turf_id || !venue_id || !block_date || !start_time || !end_time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!(await ownsVenue(user.id, venue_id))) {
      return NextResponse.json({ error: 'You do not own this venue' }, { status: 403 });
    }

    // Check for conflicts with existing bookings
    const { data: conflicts } = await supabase
      .from('bookings_new')
      .select('id')
      .eq('turf_id', turf_id)
      .eq('booking_date', block_date)
      .in('status', ['pending', 'confirmed'])
      .lt('start_time', end_time)
      .gt('end_time', start_time);

    if (conflicts && conflicts.length > 0) {
      return NextResponse.json({ error: 'This slot already has a confirmed booking' }, { status: 409 });
    }

    const { data, error } = await supabase
      .from('turf_blocks')
      .insert({
        turf_id, venue_id, block_date, start_time, end_time,
        block_type: block_type || 'blocked',
        customer_name: customer_name || null,
        customer_phone: customer_phone || null,
        notes: notes || null,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') return NextResponse.json({ error: 'This slot is already blocked' }, { status: 409 });
      throw error;
    }

    return NextResponse.json({ block: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE — remove a block
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = await verifyOwner(authHeader.replace('Bearer ', ''));
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id, venue_id } = await request.json();
    if (!id || !venue_id) return NextResponse.json({ error: 'id and venue_id required' }, { status: 400 });

    if (!(await ownsVenue(user.id, venue_id))) {
      return NextResponse.json({ error: 'You do not own this venue' }, { status: 403 });
    }

    const { error } = await supabase.from('turf_blocks').delete().eq('id', id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
