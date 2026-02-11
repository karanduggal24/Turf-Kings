import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Test 1: Get all turfs with their approval status
    const { data: allTurfs, error: allError } = await supabase
      .from('turfs')
      .select('id, name, is_active, approval_status, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    // Test 2: Get only pending turfs
    const { data: pendingTurfs, error: pendingError } = await supabase
      .from('turfs')
      .select('id, name, is_active, approval_status, created_at')
      .eq('approval_status', 'pending')
      .order('created_at', { ascending: false });

    // Test 3: Get only rejected turfs
    const { data: rejectedTurfs, error: rejectedError } = await supabase
      .from('turfs')
      .select('id, name, is_active, approval_status, created_at')
      .eq('approval_status', 'rejected')
      .order('created_at', { ascending: false });

    return NextResponse.json({
      success: true,
      allTurfs: {
        count: allTurfs?.length || 0,
        data: allTurfs,
        error: allError?.message || null
      },
      pendingTurfs: {
        count: pendingTurfs?.length || 0,
        data: pendingTurfs,
        error: pendingError?.message || null
      },
      rejectedTurfs: {
        count: rejectedTurfs?.length || 0,
        data: rejectedTurfs,
        error: rejectedError?.message || null
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      details: error.message
    }, { status: 500 });
  }
}
