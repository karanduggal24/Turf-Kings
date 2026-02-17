import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { venue, turfs } = body;

    // Validate required fields
    if (!venue || !turfs || turfs.length === 0) {
      return NextResponse.json(
        { error: 'Venue information and at least one turf are required' },
        { status: 400 }
      );
    }

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

    // Step 1: Create the venue
    const { data: createdVenue, error: venueError } = await supabaseAdmin
      .from('venues')
      .insert({
        name: venue.name,
        description: venue.description,
        location: venue.location,
        city: venue.city,
        state: venue.state,
        phone: venue.phone,
        amenities: venue.amenities || [],
        images: venue.images || [],
        owner_id: venue.owner_id,
        is_active: false,
        approval_status: 'pending'
      })
      .select()
      .single();

    if (venueError) {
      console.error('Error creating venue:', venueError);
      return NextResponse.json({ error: venueError.message }, { status: 400 });
    }

    // Step 2: Create turfs for the venue
    const turfsToInsert = turfs.map((turf: any) => ({
      venue_id: createdVenue.id,
      name: turf.name,
      sport_type: turf.sport_type,
      price_per_hour: turf.price_per_hour,
      is_active: true
    }));

    const { data: createdTurfs, error: turfsError } = await supabaseAdmin
      .from('turfs_new')
      .insert(turfsToInsert)
      .select();

    if (turfsError) {
      console.error('Error creating turfs:', turfsError);
      // Rollback: delete the venue if turfs creation fails
      await supabaseAdmin.from('venues').delete().eq('id', createdVenue.id);
      return NextResponse.json({ error: turfsError.message }, { status: 400 });
    }

    console.log('Venue and turfs created successfully:', {
      venue_id: createdVenue.id,
      venue_name: createdVenue.name,
      turfs_count: createdTurfs.length
    });

    return NextResponse.json({ 
      venue: createdVenue,
      turfs: createdTurfs
    }, { status: 201 });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

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

    let query = supabaseAdmin
      .from('venues')
      .select(`
        *,
        owner:users(full_name, email)
      `, { count: 'exact' })
      .eq('is_active', true)
      .eq('approval_status', 'approved')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (city) {
      query = query.ilike('city', `%${city}%`);
    }

    const { data: venues, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Fetch turfs for each venue
    const venuesWithTurfs = await Promise.all(
      (venues || []).map(async (venue) => {
        const { data: turfs } = await supabaseAdmin
          .from('turfs_new')
          .select('*')
          .eq('venue_id', venue.id)
          .eq('is_active', true);

        return {
          ...venue,
          turfs: turfs || [],
          total_turfs: turfs?.length || 0,
          available_sports: [...new Set(turfs?.map(t => t.sport_type) || [])],
          min_price: Math.min(...(turfs?.map(t => t.price_per_hour) || [0])),
          max_price: Math.max(...(turfs?.map(t => t.price_per_hour) || [0]))
        };
      })
    );

    return NextResponse.json({
      venues: venuesWithTurfs,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
