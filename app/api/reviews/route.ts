import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient()
  const { searchParams } = new URL(request.url)
  
  const turfId = searchParams.get('turf_id')
  const userId = searchParams.get('user_id')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const offset = (page - 1) * limit

  try {
    let query = supabase
      .from('reviews')
      .select(`
        *,
        user:users(full_name),
        turf:turfs(name),
        booking:bookings(booking_date)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (turfId) {
      query = query.eq('turf_id', turfId)
    }

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data: reviews, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      reviews,
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
    const { user_id, turf_id, booking_id, rating, comment } = body

    // Verify the booking exists and belongs to the user
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('id, user_id, status')
      .eq('id', booking_id)
      .eq('user_id', user_id)
      .single()

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: 'Booking not found or unauthorized' },
        { status: 404 }
      )
    }

    if (booking.status !== 'completed') {
      return NextResponse.json(
        { error: 'Can only review completed bookings' },
        { status: 400 }
      )
    }

    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        user_id,
        turf_id,
        booking_id,
        rating,
        comment
      })
      .select(`
        *,
        user:users(full_name),
        turf:turfs(name)
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ review }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}