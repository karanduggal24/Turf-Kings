import type { Turf } from '@/app/constants/turf-types';

interface TurfLocationProps {
  turf: Turf;
}

export default function TurfLocation({ turf }: TurfLocationProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold uppercase tracking-tight flex items-center gap-2">
        <span className="w-1.5 h-6 bg-primary rounded-full"></span>
        Location
      </h3>
      <div className="h-64 rounded-2xl bg-surface-dark overflow-hidden relative border border-white/5">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <span className="material-symbols-outlined text-primary text-5xl drop-shadow-2xl">
              location_on
            </span>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary/20 rounded-full animate-ping"></div>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md p-3 rounded-lg border border-white/10 max-w-xs">
          <p className="text-xs font-bold text-white mb-1">{turf.location}</p>
          <p className="text-[10px] text-gray-400">{turf.city}, {turf.state}</p>
        </div>
      </div>
    </div>
  );
}
