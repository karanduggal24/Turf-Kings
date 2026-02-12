import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const turfId = searchParams.get('turf_id')
  const date = searchParams.get('date')

  if (!turfId || !date) {
    return NextResponse.json({ error: 'turf_id and date required' }, { status: 400 })
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('turf_id', turfId)
      .eq('booking_date', date)
      .order('start_time')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ 
      bookings,
      count: bookings?.length || 0,
      turf_id: turfId,
      date
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
