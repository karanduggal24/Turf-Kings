import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Verify role
    const { data: userData } = await supabase
      .from('users').select('role').eq('id', user.id).single();
    if (!userData || !['turf_owner', 'admin'].includes((userData as any).role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Verify this booking belongs to one of the owner's venues
    const { data: booking } = await supabase
      .from('bookings_new')
      .select('id, venue_id, status')
      .eq('id', id)
      .single();

    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

    const { data: venue } = await supabase
      .from('venues')
      .select('owner_id')
      .eq('id', booking.venue_id)
      .single();

    if (!venue || venue.owner_id !== user.id) {
      return NextResponse.json({ error: 'You do not own this venue' }, { status: 403 });
    }

    if (booking.status === 'cancelled') {
      return NextResponse.json({ error: 'Booking is already cancelled' }, { status: 400 });
    }

    const { data: updated, error } = await supabase
      .from('bookings_new')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ booking: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
