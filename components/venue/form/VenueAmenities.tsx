'use client';

const AMENITIES = [
  { id: 'washroom', label: 'Washroom', icon: 'wc' },
  { id: 'parking', label: 'Parking', icon: 'local_parking' },
  { id: 'floodlights', label: 'Floodlights', icon: 'lightbulb' },
  { id: 'changing_room', label: 'Changing Room', icon: 'checkroom' },
  { id: 'drinking_water', label: 'Drinking Water', icon: 'water_drop' },
];

interface VenueAmenitiesProps {
  selectedAmenities: string[];
  onAmenityToggle: (amenity: string) => void;
}

export default function VenueAmenities({ selectedAmenities, onAmenityToggle }: VenueAmenitiesProps) {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-bold text-gray-200">Amenities Available</label>
      <div className="flex flex-wrap gap-3">
        {AMENITIES.map((amenity) => (
          <button
            key={amenity.id}
            type="button"
            onClick={() => onAmenityToggle(amenity.id)}
            className={`px-4 py-2 rounded-full border text-sm font-medium flex items-center gap-2 transition-all ${
              selectedAmenities.includes(amenity.id)
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-primary/20 text-gray-300 hover:border-primary hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-base">{amenity.icon}</span>
            {amenity.label}
          </button>
        ))}
      </div>
    </div>
  );
}
