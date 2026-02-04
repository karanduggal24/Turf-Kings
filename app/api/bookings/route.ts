import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient()
  const { searchParams } = new URL(request.url)
  
  const userId = searchParams.get('user_id')
  const turfId = searchParams.get('turf_id')
  const status = searchParams.get('status')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const offset = (page - 1) * limit

  try {
    let query = supabase
      .from('bookings')
      .select(`
        *,
        turf:turfs(name, location, city, images),
        user:users(full_name, email, phone)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (userId) {
      query = query.eq('user_id', userId)
    }

    if (turfId) {
      query = query.eq('turf_id', turfId)
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
  const supabase = createServerSupabaseClient()
  
  try {
    const body = await request.json()
    const {
      user_id,
      turf_id,
      booking_date,
      start_time,
      end_time,
      total_amount,
      notes
    } = body

    // Check for overlapping bookings
    const { data: existingBookings, error: checkError } = await supabase
      .from('bookings')
      .select('id')
      .eq('turf_id', turf_id)
      .eq('booking_date', booking_date)
      .or(`start_time.lte.${end_time},end_time.gte.${start_time}`)
      .neq('status', 'cancelled')

    if (checkError) {
      return NextResponse.json({ error: checkError.message }, { status: 400 })
    }

    if (existingBookings && existingBookings.length > 0) {
      return NextResponse.json(
        { error: 'Time slot is already booked' },
        { status: 409 }
      )
    }

    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        user_id,
        turf_id,
        booking_date,
        start_time,
        end_time,
        total_amount,
        notes
      })
      .select(`
        *,
        turf:turfs(name, location, city),
        user:users(full_name, email)
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