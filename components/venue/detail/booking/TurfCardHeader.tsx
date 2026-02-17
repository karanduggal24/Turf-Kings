'use client';

interface TurfCardHeaderProps {
  turf: any;
  isExpanded: boolean;
  onToggle: () => void;
}

const getSportIcon = (sportType: string) => {
  const icons: Record<string, string> = {
    football: 'sports_soccer',
    cricket: 'sports_cricket',
    badminton: 'sports_tennis',
    multi: 'sports_kabaddi',
  };
  return icons[sportType] || 'sports';
};

export default function TurfCardHeader({ turf, isExpanded, onToggle }: TurfCardHeaderProps) {
  return (
    <div className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary text-2xl">
              {getSportIcon(turf.sport_type)}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-1">{turf.name}</h3>
            <p className="text-sm text-gray-400 capitalize mb-2">
              {turf.sport_type} • 5-a-side
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">straighten</span>
                Size: 40m x 20m
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">grass</span>
                Surface: 3G Rubber Infill
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Hourly Rate</p>
          <p className="text-2xl font-bold text-white">
            ₹{turf.price_per_hour}
            <span className="text-sm font-normal text-gray-400">/hr</span>
          </p>
          <span className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary">
            AVAILABLE
          </span>
        </div>
      </div>

      <button
        onClick={onToggle}
        className="w-full mt-4 py-3 bg-surface-highlight hover:bg-primary/10 border border-surface-highlight hover:border-primary rounded-lg text-white font-medium transition-all flex items-center justify-center gap-2"
      >
        {isExpanded ? 'Hide Booking' : 'Book Now'}
        <span className={`material-symbols-outlined transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>
    </div>
  );
}
