import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { searchParams } = new URL(request.url)
  
  const city = searchParams.get('city')
  const sport = searchParams.get('sport')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const offset = (page - 1) * limit

  try {
    // Fetch venues with their turfs and reviews
    let venueQuery = supabase
      .from('venues')
      .select(`
        *,
        owner:users!venues_owner_id_fkey(full_name, email),
        turfs:turfs_new(id, name, sport_type, price_per_hour, is_active),
        reviews:reviews_new(rating)
      `, { count: 'exact' })
      .eq('is_active', true)
      .eq('approval_status', 'approved')

    if (city) {
      venueQuery = venueQuery.ilike('city', `%${city}%`)
    }

    const { data: venues, error: venuesError, count } = await venueQuery

    if (venuesError) {
      return NextResponse.json({ error: venuesError.message }, { status: 400 })
    }

    // Transform venues to include computed fields
    let transformedVenues = (venues || []).map(venue => {
      const venueTurfs = venue.turfs || []
      
      // Filter turfs by sport if specified and only active turfs
      const filteredTurfs = sport && sport !== 'all' 
        ? venueTurfs.filter((t: any) => t.sport_type === sport && t.is_active)
        : venueTurfs.filter((t: any) => t.is_active)

      // Get unique sports available
      const availableSports = [...new Set(filteredTurfs.map((t: any) => t.sport_type))]
      
      // Get price range
      const prices = filteredTurfs.map((t: any) => t.price_per_hour)
      const minPrice = prices.length > 0 ? Math.min(...prices) : 0
      const maxPrice = prices.length > 0 ? Math.max(...prices) : 0

      // Calculate average rating from reviews
      const reviews = venue.reviews || []
      const avgRating = reviews.length > 0 
        ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length 
        : 0

      return {
        id: venue.id,
        name: venue.name,
        description: venue.description,
        location: venue.location,
        city: venue.city,
        state: venue.state,
        phone: venue.phone,
        amenities: venue.amenities,
        images: venue.images,
        rating: Number(avgRating.toFixed(1)),
        total_reviews: reviews.length,
        is_active: venue.is_active,
        approval_status: venue.approval_status,
        owner: venue.owner,
        created_at: venue.created_at,
        // Computed fields
        total_turfs: filteredTurfs.length,
        available_sports: availableSports,
        price_per_hour: minPrice, // For backward compatibility
        min_price: minPrice,
        max_price: maxPrice,
        sport_type: availableSports[0] || 'multi', // Primary sport for backward compatibility
        turfs: filteredTurfs,
      }
    })

    // Filter out venues with no turfs (if sport filter applied)
    if (sport && sport !== 'all') {
      transformedVenues = transformedVenues.filter(v => v.total_turfs > 0)
    }

    // Sort by rating
    transformedVenues.sort((a, b) => b.rating - a.rating)

    // Apply pagination
    const paginatedVenues = transformedVenues.slice(offset, offset + limit)

    return NextResponse.json({
      turfs: paginatedVenues, // Keep as 'turfs' for backward compatibility
      venues: paginatedVenues,
      pagination: {
        page,
        limit,
        total: transformedVenues.length,
        totalPages: Math.ceil(transformedVenues.length / limit)
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
    const body = await request.json()
    
    const {
      name,
      description,
      location,
      city,
      state,
      phone,
      price_per_hour,
      sport_type,
      amenities,
      images,
      owner_id
    } = body

    if (!name || !location || !city || !state || !phone || !price_per_hour || !sport_type || !owner_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Use service role to bypass RLS for creating turfs
    const { createClient } = require('@supabase/supabase-js')
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { data: turf, error } = await supabaseAdmin
      .from('turfs')
      .insert({
        name,
        description,
        location,
        city,
        state,
        phone,
        price_per_hour,
        sport_type,
        amenities: amenities || [],
        images: images || [],
        owner_id,
        is_active: false,  // Inactive until approved by admin
        approval_status: 'pending'  // Default status for new submissions
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ turf }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
