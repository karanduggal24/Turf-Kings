import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (!date) {
    return NextResponse.json({ error: 'Date is required' }, { status: 400 });
  }

  try {
    // Use service role to bypass RLS for availability checking
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Fetch bookings for this turf on the specified date
    const { data: bookings, error } = await supabase
      .from('bookings_new')
      .select('start_time, end_time, status')
      .eq('turf_id', id)
      .eq('booking_date', date)
      .in('status', ['pending', 'confirmed']);

    if (error) {
      console.error('Availability fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Convert bookings to booked time slots
    const bookedSlots = (bookings || []).map(booking => ({
      start: booking.start_time,
      end: booking.end_time,
    }));

    return NextResponse.json({ bookedSlots });
  } catch (error) {
    console.error('Availability API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
