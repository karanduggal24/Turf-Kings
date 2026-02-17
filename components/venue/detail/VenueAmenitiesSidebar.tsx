'use client';

interface VenueAmenitiesSidebarProps {
  amenities: string[];
}

const amenityIcons: Record<string, string> = {
  'parking': 'local_parking',
  'free parking': 'local_parking',
  'showers': 'shower',
  'modern showers': 'shower',
  'changing rooms': 'meeting_room',
  'luxury changing rooms': 'meeting_room',
  'cafe': 'restaurant',
  'sports cafe': 'restaurant',
  'floodlights': 'lightbulb',
  'led floodlights': 'lightbulb',
  'stadium floodlights': 'lightbulb',
  'wifi': 'wifi',
  'high-speed wifi': 'wifi',
  'equipment': 'sports_soccer',
  'kit & ball rental': 'sports_soccer',
  'lockers': 'lock',
  'first aid': 'medical_services',
  'seating': 'event_seat',
  'spectator seating': 'event_seat',
};

const getAmenityIcon = (amenity: string): string => {
  const lowerAmenity = amenity.toLowerCase();
  for (const [key, icon] of Object.entries(amenityIcons)) {
    if (lowerAmenity.includes(key)) {
      return icon;
    }
  }
  return 'check_circle';
};

export default function VenueAmenitiesSidebar({ amenities }: VenueAmenitiesSidebarProps) {
  return (
    <div className="bg-surface-dark border border-surface-highlight rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">stars</span>
        Venue Amenities
      </h3>
      <div className="space-y-3">
        {amenities.length > 0 ? (
          amenities.map((amenity, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-black/40 rounded-lg border border-surface-highlight"
            >
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-sm">
                  {getAmenityIcon(amenity)}
                </span>
              </div>
              <span className="text-gray-300 text-sm font-medium">{amenity}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm text-center py-4">No amenities listed</p>
        )}
      </div>

      {/* Member Special */}
      <div className="mt-6 p-4 bg-primary/5 border border-primary rounded-xl">
        <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wide">
          Member Special
        </h4>
        <p className="text-xs text-gray-300 mb-3">
          Get 30% off all bookings when you join our site membership club.
        </p>
        <button className="w-full py-2 bg-primary hover:bg-primary-hover text-black font-bold text-sm rounded-lg transition-all">
          CLAIM DISCOUNT
        </button>
      </div>
    </div>
  );
}
