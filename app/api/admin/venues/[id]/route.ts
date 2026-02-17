import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const params = await context.params;
    const id = params.id;
    const body = await request.json();

    const { data: venue, error } = await supabase
      .from('venues')
      .update({
        name: body.name,
        description: body.description,
        location: body.location,
        city: body.city,
        state: body.state,
        phone: body.phone,
        amenities: body.amenities,
        images: body.images,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating venue:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, venue });
  } catch (error) {
    console.error('Error in PATCH /api/admin/venues/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
