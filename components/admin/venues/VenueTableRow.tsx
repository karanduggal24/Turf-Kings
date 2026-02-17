'use client';

interface Turf {
  id: string;
  name: string;
  sport_type: string;
  price_per_hour: number;
}

interface Venue {
  id: string;
  name: string;
  description?: string;
  location?: string;
  city: string;
  state: string;
  phone?: string;
  amenities?: string[];
  images: string[];
  total_turfs: number;
  available_sports: string[];
  min_price?: number;
  max_price?: number;
  owner: {
    full_name: string;
    email: string;
  };
  turfs?: any[];
  created_at: string;
}

interface VenueTableRowProps {
  venue: Venue;
  onViewDetails: (venue: Venue) => void;
  actionButtons: React.ReactNode;
  statusBadge: React.ReactNode;
  accentColor?: 'primary' | 'red';
}

export default function VenueTableRow({
  venue,
  onViewDetails,
  actionButtons,
  statusBadge,
  accentColor = 'primary'
}: VenueTableRowProps) {
  const getSportIcon = (sport: string) => {
    const icons: Record<string, string> = {
      football: 'sports_soccer',
      cricket: 'sports_cricket',
      badminton: 'sports_tennis',
      multi: 'sports_kabaddi',
    };
    return icons[sport] || 'sports';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const colorClass = accentColor === 'red' ? 'text-red-500' : 'text-primary';
  const bgColorClass = accentColor === 'red' ? 'bg-red-500/20' : 'bg-primary/20';

  return (
    <tr 
      className="group hover:bg-primary/5 transition-colors cursor-pointer"
      onClick={() => onViewDetails(venue)}
    >
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
            <img
              alt="Venue"
              className="w-full h-full object-cover"
              src={venue.images[0] || '/placeholder-turf.jpg'}
            />
          </div>
          <div>
            <div className="font-bold text-white">{venue.name}</div>
            <div className="text-xs text-gray-400 flex items-center gap-1">
              <span className="material-symbols-outlined text-[10px]">location_on</span>
              {venue.city}, {venue.state}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center gap-2">
          <span className={`text-2xl font-black ${colorClass}`}>{venue.total_turfs}</span>
          <div className="text-xs text-gray-400">
            <div>turfs</div>
            <div className="flex gap-1">
              {venue.available_sports.slice(0, 2).map((sport, i) => (
                <span key={i} className={`material-symbols-outlined text-xs ${colorClass}`}>
                  {getSportIcon(sport)}
                </span>
              ))}
              {venue.available_sports.length > 2 && (
                <span className={colorClass}>+{venue.available_sports.length - 2}</span>
              )}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-full ${bgColorClass} flex items-center justify-center ${colorClass} text-xs font-bold`}>
            {getInitials(venue.owner?.full_name || 'U')}
          </div>
          <span className="text-sm font-medium text-white">
            {venue.owner?.full_name || 'Unknown'}
          </span>
        </div>
      </td>
      <td className="px-6 py-5">
        <span className="text-sm text-gray-400">{formatDate(venue.created_at)}</span>
      </td>
      <td className="px-6 py-5">
        {statusBadge}
      </td>
      <td className="px-6 py-5 text-right">
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          {actionButtons}
        </div>
      </td>
    </tr>
  );
}
