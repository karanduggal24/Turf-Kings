'use client';

import Button from '@/components/common/Button';

interface VenueLocationMapProps {
  location: string;
  city: string;
  state: string;
  phone: string;
}

export default function VenueLocationMap({ location, city, state, phone }: VenueLocationMapProps) {
  const handleGetDirections = () => {
    const address = encodeURIComponent(`${location}, ${city}, ${state}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
  };

  return (
    <div className="bg-surface-dark border border-surface-highlight rounded-xl overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">location_on</span>
          Location
        </h3>
        
        {/* Map Placeholder */}
        <div className="relative w-full h-48 bg-surface-highlight rounded-lg mb-4 overflow-hidden">
          <iframe
            src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(`${location}, ${city}, ${state}`)}`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="grayscale"
          />
          <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
        </div>

        {/* Address */}
        <div className="space-y-3 mb-4">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary text-sm mt-0.5">home</span>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Address</p>
              <p className="text-sm text-gray-300">{location}</p>
              <p className="text-sm text-gray-300">{city}, {state}</p>
            </div>
          </div>
          
          {phone && (
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-sm mt-0.5">phone</span>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Contact</p>
                <p className="text-sm text-gray-300">{phone}</p>
              </div>
            </div>
          )}
        </div>

        <Button
          onClick={handleGetDirections}
          fullWidth
          variant="secondary"
          icon="directions"
          className="border-primary text-primary hover:bg-primary hover:text-black"
        >
          GET DIRECTIONS
        </Button>
      </div>
    </div>
  );
}
