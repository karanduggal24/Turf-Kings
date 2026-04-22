import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Returns live avg rating + review count for all approved venues
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('reviews_new')
      .select('venue_id, rating');

    if (error) throw error;

    // Group by venue_id
    const map: Record<string, { sum: number; count: number }> = {};
    (data || []).forEach(r => {
      if (!map[r.venue_id]) map[r.venue_id] = { sum: 0, count: 0 };
      map[r.venue_id].sum += r.rating;
      map[r.venue_id].count += 1;
    });

    const ratings: Record<string, { rating: number; total_reviews: number }> = {};
    Object.entries(map).forEach(([venueId, { sum, count }]) => {
      ratings[venueId] = { rating: Number((sum / count).toFixed(1)), total_reviews: count };
    });

    return NextResponse.json({ ratings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
