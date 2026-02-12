import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  const userId = searchParams.get('user_id')
  const turfId = searchParams.get('turf_id')
  const date = searchParams.get('date')
  const status = searchParams.get('status')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const offset = (page - 1) * limit

  try {
    const { createClient } = await import('@supabase/supabase-js');
    
    // Use service role for all queries to bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // If userId is provided, verify the auth token matches
    if (userId) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.replace('Bearer ', '');
        const authSupabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { data: { user }, error: authError } = await authSupabase.auth.getUser(token);
        
        if (authError || !user || user.id !== userId) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
      }
    }

    let query = supabase
      .from('bookings')
      .select(`
        *,
        turf:turfs(name, location, city, images),
        user:users(full_name, email, phone)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (userId) {
      query = query.eq('user_id', userId)
    }

    if (turfId) {
      query = query.eq('turf_id', turfId)
    }

    if (date) {
      query = query.eq('booking_date', date)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data: bookings, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      bookings,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized - No token provided' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Create Supabase client with the token
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    // Verify the user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      return NextResponse.json({ error: 'Unauthorized - Invalid token' }, { status: 401 });
    }

    const body = await request.json()
    const {
      turf_id,
      booking_date,
      start_time,
      end_time,
      base_amount,
      service_fee,
      booking_fee,
      total_amount,
      notes
    } = body

    // Check for overlapping bookings using service role to bypass RLS
    const serviceSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: existingBookings, error: checkError } = await serviceSupabase
      .from('bookings')
      .select('id, start_time, end_time, status')
      .eq('turf_id', turf_id)
      .eq('booking_date', booking_date)
      .neq('status', 'cancelled');

    if (checkError) {
      return NextResponse.json({ error: checkError.message }, { status: 400 })
    }

    // Check for actual overlaps
    if (existingBookings && existingBookings.length > 0) {
      const hasOverlap = existingBookings.some((booking: any) => {
        // Normalize times to HH:MM format for comparison
        const existingStart = booking.start_time.substring(0, 5);
        const existingEnd = booking.end_time.substring(0, 5);
        const newStart = start_time.substring(0, 5);
        const newEnd = end_time.substring(0, 5);
        
        // Overlap occurs if:
        // - New booking starts before existing ends AND
        // - New booking ends after existing starts
        const overlaps = newStart < existingEnd && newEnd > existingStart;
        
        return overlaps;
      });

      if (hasOverlap) {
        return NextResponse.json(
          { error: 'Time slot is already booked' },
          { status: 409 }
        );
      }
    }

    const { data: booking, error } = await serviceSupabase
      .from('bookings')
      .insert({
        user_id: user.id,
        turf_id,
        booking_date,
        start_time,
        end_time,
        base_amount,
        service_fee,
        booking_fee,
        total_amount,
        status: 'confirmed',
        payment_status: 'paid',
        notes
      })
      .select(`
        *,
        turf:turfs(name, location, city, state, phone),
        user:users(full_name, email, phone)
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ booking }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}