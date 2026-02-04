import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient()
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('user_id')

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 })
  }

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  const supabase = createServerSupabaseClient()
  
  try {
    const body = await request.json()
    const { user_id, ...updateData } = body

    if (!user_id) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Create a clean update object with only allowed fields
    const userUpdateData = {
      ...(updateData.full_name !== undefined && { full_name: updateData.full_name }),
      ...(updateData.phone !== undefined && { phone: updateData.phone }),
      ...(updateData.avatar_url !== undefined && { avatar_url: updateData.avatar_url }),
      updated_at: new Date().toISOString()
    }

    const { data: user, error } = await supabase
      .from('users')
      .update(userUpdateData as any) // Type assertion to bypass strict typing
      .eq('id', user_id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}