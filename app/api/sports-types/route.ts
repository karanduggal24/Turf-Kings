import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

// Map of all possible sport types with their display info
const sportTypeMap: Record<string, { label: string; icon: string }> = {
  football: { label: 'Football', icon: 'sports_soccer' },
  cricket: { label: 'Cricket', icon: 'sports_cricket' },
  badminton: { label: 'Badminton', icon: 'sports_tennis' },
  multi: { label: 'Multi-Sport', icon: 'sports_kabaddi' },
};

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    // Query to get distinct sport types from turfs_new table (only active turfs in approved venues)
    const { data, error } = await supabase
      .from('turfs_new')
      .select(`
        sport_type,
        venue:venues!inner(is_active, approval_status)
      `)
      .eq('is_active', true)
      .eq('venue.is_active', true)
      .eq('venue.approval_status', 'approved');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Get unique sport types that are actually in use
    const uniqueSports = [...new Set(data.map(item => item.sport_type))];

    const sportsOptions = uniqueSports
      .filter(sport => sportTypeMap[sport])
      .map(sport => ({
        value: sport,
        label: sportTypeMap[sport].label,
        icon: sportTypeMap[sport].icon,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    // Return all available sport types for venue creation (from enum)
    const allSportsOptions = Object.entries(sportTypeMap).map(([value, { label, icon }]) => ({
      value,
      label,
      icon,
    }));

    return NextResponse.json({ 
      sports: sportsOptions, // Sports currently in use (for filtering)
      allSports: allSportsOptions // All possible sports (for venue creation)
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
