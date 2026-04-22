import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET — fetch reviews for a venue
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const venueId = searchParams.get('venue_id');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = (page - 1) * limit;

  try {
    let query = supabase
      .from('reviews_new')
      .select(`
        id, rating, comment, created_at,
        user:users(full_name)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (venueId) query = query.eq('venue_id', venueId);

    const { data: reviews, error, count } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({
      reviews: reviews || [],
      pagination: { page, limit, total: count || 0, totalPages: Math.ceil((count || 0) / limit) },
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST — submit a review (only for users who completed a booking at this venue)
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { booking_id, rating, comment } = await request.json();

    if (!booking_id || !rating) {
      return NextResponse.json({ error: 'booking_id and rating are required' }, { status: 400 });
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    // Verify booking belongs to this user and is confirmed/completed
    const { data: booking, error: bookingError } = await supabase
      .from('bookings_new')
      .select('id, user_id, venue_id, status')
      .eq('id', booking_id)
      .eq('user_id', user.id)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json({ error: 'Booking not found or unauthorized' }, { status: 404 });
    }

    if (!['confirmed', 'completed'].includes(booking.status)) {
      return NextResponse.json({ error: 'Can only review confirmed or completed bookings' }, { status: 400 });
    }

    // Check if already reviewed
    const { data: existing } = await supabase
      .from('reviews_new')
      .select('id')
      .eq('booking_id', booking_id)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'You have already reviewed this booking' }, { status: 409 });
    }

    const { data: review, error } = await supabase
      .from('reviews_new')
      .insert({
        user_id: user.id,
        venue_id: booking.venue_id,
        booking_id,
        rating,
        comment: comment || null,
      })
      .select('id, rating, comment, created_at')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ review }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
