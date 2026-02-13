'use client';

const SPORTS = [
  { id: 'cricket', label: 'Cricket', icon: 'sports_cricket' },
  { id: 'football', label: 'Football', icon: 'sports_soccer' },
  { id: 'badminton', label: 'Badminton', icon: 'sports_tennis' },
  { id: 'multi', label: 'Multi-Sport', icon: 'sports_kabaddi' },
];

interface VenueSportSelectorProps {
  selectedSport: string;
  onSportChange: (sport: string) => void;
}

export default function VenueSportSelector({ selectedSport, onSportChange }: VenueSportSelectorProps) {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-bold text-gray-200">
        Sport Type <span className="text-primary">*</span>
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {SPORTS.map((sport) => (
          <button
            key={sport.id}
            type="button"
            onClick={() => onSportChange(sport.id)}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
              selectedSport === sport.id
                ? 'border-primary bg-primary/10'
                : 'border-surface-dark hover:border-primary/50'
            }`}
          >
            <span
              className={`material-symbols-outlined mb-2 text-2xl ${
                selectedSport === sport.id ? 'text-primary' : 'text-gray-400'
              }`}
            >
              {sport.icon}
            </span>
            <span className="text-xs font-bold uppercase tracking-wide text-white">
              {sport.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
