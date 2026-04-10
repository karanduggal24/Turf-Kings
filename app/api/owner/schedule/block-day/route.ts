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

// POST — block all slots for a day
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = await verifyOwner(authHeader.replace('Bearer ', ''));
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { turf_id, venue_id, block_date, notes } = await request.json();
    if (!turf_id || !venue_id || !block_date) {
      return NextResponse.json({ error: 'turf_id, venue_id and block_date required' }, { status: 400 });
    }
    if (!(await ownsVenue(user.id, venue_id))) {
      return NextResponse.json({ error: 'You do not own this venue' }, { status: 403 });
    }

    // Get turf operating hours
    const { data: turf } = await supabase
      .from('turfs_new')
      .select('open_time, close_time')
      .eq('id', turf_id)
      .single();

    const openHour = parseInt(((turf as any)?.open_time || '06:00').slice(0, 5).split(':')[0]);
    const closeHour = parseInt(((turf as any)?.close_time || '22:00').slice(0, 5).split(':')[0]);

    // Build all hourly slots within operating hours
    const slots = [];
    for (let h = openHour; h <= closeHour; h++) {
      const start = `${String(h).padStart(2, '0')}:00`;
      const end = `${String(h + 1).padStart(2, '0')}:00`;
      slots.push({ turf_id, venue_id, block_date, start_time: start, end_time: end, block_type: 'blocked', notes: notes || 'Day blocked', created_by: user.id });
    }

    // Upsert all slots — skip conflicts (already blocked or booked)
    const { error } = await supabase
      .from('turf_blocks')
      .upsert(slots, { onConflict: 'turf_id,block_date,start_time,end_time', ignoreDuplicates: true });

    if (error) throw error;

    return NextResponse.json({ success: true, blocked: slots.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE — unblock all owner-created blocks for a day
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = await verifyOwner(authHeader.replace('Bearer ', ''));
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { turf_id, venue_id, block_date } = await request.json();
    if (!turf_id || !venue_id || !block_date) {
      return NextResponse.json({ error: 'turf_id, venue_id and block_date required' }, { status: 400 });
    }
    if (!(await ownsVenue(user.id, venue_id))) {
      return NextResponse.json({ error: 'You do not own this venue' }, { status: 403 });
    }

    const { error } = await supabase
      .from('turf_blocks')
      .delete()
      .eq('turf_id', turf_id)
      .eq('block_date', block_date)
      .eq('created_by', user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
