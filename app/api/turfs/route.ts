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
    let query = supabase
      .from('turfs')
      .select(`
        *,
        owner:users(full_name, email)
      `)
      .eq('is_active', true)
      .order('rating', { ascending: false })
      .range(offset, offset + limit - 1)

    if (city) {
      query = query.ilike('city', `%${city}%`)
    }

    if (sport && sport !== 'all') {
      query = query.eq('sport_type', sport)
    }

    const { data: turfs, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      turfs,
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
  const supabase = await createServerSupabaseClient()
  
  try {
    const body = await request.json()
    
    const {
      name,
      description,
      location,
      city,
      state,
      price_per_hour,
      sport_type,
      amenities,
      images,
      owner_id
    } = body

    if (!name || !location || !city || !state || !price_per_hour || !sport_type || !owner_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data: turf, error } = await supabase
      .from('turfs')
      .insert({
        name,
        description,
        location,
        city,
        state,
        price_per_hour,
        sport_type,
        amenities: amenities || [],
        images: images || [],
        owner_id
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