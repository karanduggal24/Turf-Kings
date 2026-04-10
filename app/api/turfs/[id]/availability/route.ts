import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (!date) return NextResponse.json({ error: 'Date is required' }, { status: 400 });

  try {
    // Fetch confirmed/pending bookings
    const { data: bookings } = await supabase
      .from('bookings_new')
      .select('start_time, end_time')
      .eq('turf_id', id)
      .eq('booking_date', date)
      .in('status', ['pending', 'confirmed']);

    // Fetch owner blocks (blocked slots + manual bookings)
    const { data: blocks } = await supabase
      .from('turf_blocks')
      .select('start_time, end_time, block_type, customer_name')
      .eq('turf_id', id)
      .eq('block_date', date);

    const bookedSlots = [
      ...(bookings || []).map(b => ({ start: b.start_time, end: b.end_time, type: 'booking' })),
      ...(blocks || []).map(b => ({ start: b.start_time, end: b.end_time, type: b.block_type, label: b.customer_name })),
    ];

    return NextResponse.json({ bookedSlots });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
