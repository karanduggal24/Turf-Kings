import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all users
    const { data: allUsers, error: usersError } = await supabase
      .from('users')
      .select('id, role, created_at');

    if (usersError) throw usersError;

    const totalUsers = allUsers?.length || 0;
    
    // Count by role
    const players = allUsers?.filter(u => u.role === 'user').length || 0;
    const turfOwners = allUsers?.filter(u => u.role === 'turf_owner').length || 0;
    const admins = allUsers?.filter(u => u.role === 'admin').length || 0;

    // Count new users this month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newThisMonth = allUsers?.filter(u => {
      const createdAt = new Date(u.created_at);
      return createdAt >= firstDayOfMonth;
    }).length || 0;

    // Calculate growth percentage (mock for now)
    const playersGrowth = 12;
    const newUsersGrowth = 8;
    const ownersGrowth = 4;

    return NextResponse.json({
      totalUsers,
      players,
      turfOwners,
      admins,
      newThisMonth,
      playersGrowth,
      newUsersGrowth,
      ownersGrowth,
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user stats' },
      { status: 500 }
    );
  }
}
