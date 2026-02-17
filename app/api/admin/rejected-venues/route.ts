import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    // Use service role to bypass RLS
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Fetch rejected venues
    const { data: venues, error: venuesError } = await supabaseAdmin
      .from('venues')
      .select(`
        *,
        owner:users(full_name, email)
      `)
      .eq('approval_status', 'rejected')
      .order('created_at', { ascending: false });

    if (venuesError) {
      console.error('Error fetching rejected venues:', venuesError);
      return NextResponse.json({ error: venuesError.message }, { status: 400 });
    }

    // Fetch turfs for each venue
    const venuesWithTurfs = await Promise.all(
      (venues || []).map(async (venue) => {
        const { data: turfs, error: turfsError } = await supabaseAdmin
          .from('turfs_new')
          .select('*')
          .eq('venue_id', venue.id)
          .order('created_at', { ascending: true });

        if (turfsError) {
          console.error(`Error fetching turfs for venue ${venue.id}:`, turfsError);
        }

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

    return NextResponse.json({ venues: venuesWithTurfs });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
