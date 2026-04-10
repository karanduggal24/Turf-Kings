import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: userData } = await supabase
      .from('users').select('role').eq('id', user.id).single();
    if (!userData || !['turf_owner', 'admin'].includes(userData.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data: venues, error } = await supabase
      .from('venues')
      .select(`
        id, name, location, city, state, images, amenities,
        is_active, approval_status, created_at,
        turfs:turfs_new(id, name, sport_type, price_per_hour, is_active, open_time, close_time),
        reviews:reviews_new(rating)
      `)
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const enriched = (venues || []).map(venue => {
      const activeTurfs = (venue.turfs || []).filter((t: any) => t.is_active);
      const prices = activeTurfs.map((t: any) => t.price_per_hour);
      const reviews = venue.reviews || [];
      const avgRating = reviews.length > 0
        ? reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length : 0;

      return {
        ...venue,
        total_turfs: activeTurfs.length,
        available_sports: [...new Set(activeTurfs.map((t: any) => t.sport_type))],
        min_price: prices.length ? Math.min(...prices) : 0,
        max_price: prices.length ? Math.max(...prices) : 0,
        rating: Number(avgRating.toFixed(1)),
        total_reviews: reviews.length,
      };
    });

    return NextResponse.json({ venues: enriched });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
