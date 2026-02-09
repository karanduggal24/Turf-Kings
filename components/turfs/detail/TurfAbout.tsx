import type { Turf } from '@/app/constants/turf-types';

interface TurfAboutProps {
  turf: Turf;
}

export default function TurfAbout({ turf }: TurfAboutProps) {
  const getAmenityIcon = (amenity: string): string => {
    const lower = amenity.toLowerCase();
    if (lower.includes('parking')) return 'local_parking';
    if (lower.includes('shower')) return 'shower';
    if (lower.includes('cafe')) return 'restaurant';
    if (lower.includes('ac')) return 'ac_unit';
    if (lower.includes('equipment')) return 'sports';
    return 'check_circle';
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold uppercase tracking-tight flex items-center gap-2">
        <span className="w-1.5 h-6 bg-primary rounded-full"></span>
        About the Venue
      </h3>
      <p className="text-gray-400 leading-relaxed text-lg">
        {turf.description || `${turf.name} features top-of-the-line synthetic grass specifically engineered for professional-grade impact absorption. Whether you're planning a competitive match or a casual game, our floodlit arena provides the ultimate atmosphere.`}
      </p>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6">
        {turf.amenities.map((amenity, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-surface-dark border border-white/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">
                {getAmenityIcon(amenity)}
              </span>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-300">
              {amenity}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
