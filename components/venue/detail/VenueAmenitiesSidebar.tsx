'use client';

interface VenueAmenitiesSidebarProps {
  amenities: string[];
  phone?: string;
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
  const lower = amenity.toLowerCase();
  for (const [key, icon] of Object.entries(amenityIcons)) {
    if (lower.includes(key)) return icon;
  }
  return 'check_circle';
};

export default function VenueAmenitiesSidebar({ amenities, phone }: VenueAmenitiesSidebarProps) {
  const cleanPhone = phone?.replace(/\D/g, '') || '';
  const waMessage = encodeURIComponent("Hi, I'm interested in booking your venue on TurfKings");

  return (
    <div className="bg-surface-dark border border-surface-highlight rounded-xl p-6 space-y-6">
      {/* Amenities */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">stars</span>
          Venue Amenities
        </h3>
        <div className="space-y-3">
          {amenities.length > 0 ? (
            amenities.map((amenity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-black/40 rounded-lg border border-surface-highlight">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-sm">{getAmenityIcon(amenity)}</span>
                </div>
                <span className="text-gray-300 text-sm font-medium">{amenity}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm text-center py-4">No amenities listed</p>
          )}
        </div>
      </div>

      {/* Quick Contact */}
      <div className="p-4 bg-black/30 border border-surface-highlight rounded-xl space-y-3">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-base">contact_phone</span>
          Contact Venue
        </h4>
        <p className="text-xs text-gray-400">Have a question? Reach out to the venue directly.</p>
        {cleanPhone ? (
          <div className="flex gap-2">
            <a
              href={`tel:${phone}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-primary/10 border border-primary/30 text-primary text-xs font-bold hover:bg-primary/20 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">call</span>
              Call
            </a>
            <a
              href={`https://wa.me/${cleanPhone}?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold hover:bg-green-500/20 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">chat</span>
              WhatsApp
            </a>
          </div>
        ) : (
          <p className="text-xs text-gray-500 italic">No contact number provided</p>
        )}
      </div>
    </div>
  );
}
