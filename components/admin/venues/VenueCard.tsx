'use client';

import Image from 'next/image';

interface Venue {
  id: string;
  name: string;
  location: string;
  city: string;
  images: string[];
  rating: number;
  total_reviews: number;
  total_turfs?: number;
  is_active: boolean;
  owner: {
    full_name: string;
    email: string;
  };
}

interface VenueCardProps {
  venue: Venue;
  onToggleMaintenance: (id: string, currentStatus: boolean) => void;
}

export default function VenueCard({ venue, onToggleMaintenance }: VenueCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="group bg-white/5 border border-primary/5 rounded-xl overflow-hidden hover:border-primary/40 transition-all duration-300">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={venue.images[0] || '/placeholder-turf.jpg'}
          alt={venue.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span
            className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${
              venue.is_active
                ? 'bg-primary text-black'
                : 'bg-gray-500 text-white'
            }`}
          >
            {venue.is_active && (
              <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse"></span>
            )}
            {venue.is_active ? 'ACTIVE' : 'INACTIVE'}
          </span>
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <a
            href={`/admin/venues/edit/${venue.id}`}
            className="w-8 h-8 bg-black/50 backdrop-blur-md text-white rounded-lg flex items-center justify-center hover:bg-primary hover:text-black transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="material-symbols-outlined text-sm">edit</span>
          </a>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white font-bold text-lg">{venue.name}</h3>
          <div className="flex items-center justify-between">
            <p className="text-gray-300 text-xs flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">location_on</span>
              {venue.location}, {venue.city}
            </p>
            {venue.total_turfs && venue.total_turfs > 0 && (
              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">
                {venue.total_turfs} turf{venue.total_turfs !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-primary/10">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">
              Owner
            </p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                {getInitials(venue.owner?.full_name || 'U')}
              </div>
              <span className="text-sm font-medium text-white">
                {venue.owner?.full_name || 'Unknown'}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">
              Rating
            </p>
            <div className="flex items-center gap-1 text-yellow-500">
              <span className="material-symbols-outlined text-sm">star</span>
              <span className="text-sm font-bold text-white">{venue.rating || 0}</span>
              <span className="text-[10px] text-gray-500">({venue.total_reviews || 0})</span>
            </div>
          </div>
        </div>

        {/* Maintenance Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-400">Maintenance Mode</span>
            <span className="text-[10px] text-gray-500">Users cannot book while ON</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={!venue.is_active}
              onChange={() => onToggleMaintenance(venue.id, venue.is_active)}
            />
            <div className="w-11 h-6 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>
    </div>
  );
}
