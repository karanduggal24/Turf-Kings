import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch all active approved venues with their amenities
    const { data: venues, error } = await supabase
      .from('venues')
      .select('amenities')
      .eq('is_active', true)
      .eq('approval_status', 'approved');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Extract and flatten all amenities
    const allAmenities = venues
      ?.flatMap(venue => venue.amenities || [])
      .filter(Boolean) || [];

    // Get unique amenities and sort alphabetically
    const uniqueAmenities = [...new Set(allAmenities)].sort();

    // Map amenities to include icons
    const amenitiesWithIcons = uniqueAmenities.map(amenity => {
      // Map common amenities to Material Icons
      const iconMap: Record<string, string> = {
        'parking': 'local_parking',
        'washroom': 'wc',
        'floodlights': 'lightbulb',
        'changing_room': 'checkroom',
        'drinking_water': 'water_drop',
        'cafe': 'restaurant',
        'ac': 'ac_unit',
        'ac rooms': 'ac_unit',
        'showers': 'shower',
        'equipment': 'sports',
        'first aid': 'medical_services',
        'wifi': 'wifi',
        'lockers': 'lock',
        'seating': 'event_seat',
      };

      // Try to find icon by matching amenity name (case-insensitive)
      const amenityLower = amenity.toLowerCase();
      const icon = Object.keys(iconMap).find(key => 
        amenityLower.includes(key)
      );

      return {
        value: amenity,
        label: amenity.charAt(0).toUpperCase() + amenity.slice(1),
        icon: icon ? iconMap[icon] : 'check_circle',
      };
    });

    return NextResponse.json({
      amenities: amenitiesWithIcons,
      count: uniqueAmenities.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch amenities' },
      { status: 500 }
    );
  }
}
