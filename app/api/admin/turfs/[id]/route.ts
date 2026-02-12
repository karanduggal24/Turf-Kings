import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const params = await context.params;
    const id = params.id;

    console.log('Fetching turf with ID:', id);

    const { data: turf, error } = await supabase
      .from('turfs')
      .select(`
        *,
        owner:users(full_name, email, phone)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching turf:', error);
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    console.log('Turf fetched successfully:', turf?.name);
    return NextResponse.json({ success: true, turf });
  } catch (error) {
    console.error('Error in GET /api/admin/turfs/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const params = await context.params;
    const id = params.id;
    const body = await request.json();

    console.log('Updating turf with ID:', id);

    const { data: turf, error } = await supabase
      .from('turfs')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating turf:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log('Turf updated successfully:', turf?.name);
    return NextResponse.json({ success: true, turf });
  } catch (error) {
    console.error('Error in PATCH /api/admin/turfs/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
