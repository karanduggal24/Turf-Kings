import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET() {
  try {
    // Use service role to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Fetching pending turfs with approval_status = pending');

    // Fetch pending turfs (not approved yet)
    const { data: turfs, error } = await supabase
      .from('turfs')
      .select(`
        *,
        owner:users!owner_id(full_name, email)
      `)
      .eq('approval_status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching pending turfs:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log('Pending turfs found:', turfs?.length || 0);
    return NextResponse.json({ turfs: turfs || [] });
  } catch (error: any) {
    console.error('Internal error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
