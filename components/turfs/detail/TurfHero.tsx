import type { Turf } from '@/app/constants/turf-types';

interface TurfHeroProps {
  turf: Turf;
}

export default function TurfHero({ turf }: TurfHeroProps) {
  return (
    <section className="relative h-[60vh] min-h-[450px] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${turf.images[0] || '/placeholder-turf.jpg'}')` }}
      >
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent"></div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full p-8 lg:px-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 bg-primary/20 backdrop-blur-md border border-primary/30 text-primary px-3 py-1 rounded-full w-fit text-xs font-bold uppercase tracking-widest">
              <span className="material-symbols-outlined text-xs">verified</span>
              {turf.sport_type.toUpperCase()}
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-black uppercase italic tracking-tighter leading-none">
              {turf.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-gray-300">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-primary">location_on</span>
                <span className="text-sm font-medium">{turf.city}, {turf.state}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-yellow-400 fill-current">star</span>
                <span className="text-sm font-bold text-white">{turf.rating}</span>
                <span className="text-sm text-gray-400">({turf.total_reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-primary">schedule</span>
                <span className="text-sm font-medium">Open 24/7</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-xl transition-all">
              <span className="material-symbols-outlined">share</span>
            </button>
            <button className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-xl transition-all">
              <span className="material-symbols-outlined text-red-500">favorite</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
