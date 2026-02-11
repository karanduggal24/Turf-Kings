import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: Request) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '6');
    const search = searchParams.get('search') || '';
    
    const offset = (page - 1) * limit;

    // Build query - show approved turfs that are in maintenance mode (inactive)
    let query = supabase
      .from('turfs')
      .select(`
        *,
        owner:users!turfs_owner_id_fkey(full_name, email)
      `, { count: 'exact' })
      .eq('approval_status', 'approved')  // Only approved turfs
      .eq('is_active', false)  // But currently inactive (maintenance mode)
      .order('created_at', { ascending: false });

    // Search filter
    if (search) {
      query = query.or(`name.ilike.%${search}%,location.ilike.%${search}%`);
    }

    const { data: turfs, error, count } = await query.range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({
      turfs: turfs || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching maintenance turfs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch maintenance turfs' },
      { status: 500 }
    );
  }
}
