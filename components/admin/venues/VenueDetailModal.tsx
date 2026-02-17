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
  description: string;
  location: string;
  city: string;
  state: string;
  phone: string;
  amenities: string[];
  images: string[];
  created_at: string;
  owner: {
    full_name: string;
    email: string;
  };
  turfs: Turf[];
  total_turfs: number;
  available_sports: string[];
  min_price: number;
  max_price: number;
}

interface VenueDetailModalProps {
  venue: Venue | null;
  isOpen: boolean;
  onClose: () => void;
  actionButtons: React.ReactNode;
  accentColor?: 'primary' | 'red';
}

export default function VenueDetailModal({
  venue,
  isOpen,
  onClose,
  actionButtons,
  accentColor = 'primary'
}: VenueDetailModalProps) {
  if (!isOpen || !venue) return null;

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

  const borderColor = accentColor === 'red' ? 'border-red-500/20' : 'border-primary/20';
  const borderColorLight = accentColor === 'red' ? 'border-red-500/10' : 'border-primary/10';
  const bgColor = accentColor === 'red' ? 'bg-red-500/10' : 'bg-primary/10';
  const textColor = accentColor === 'red' ? 'text-red-500' : 'text-primary';
  const bgColorDark = accentColor === 'red' ? 'bg-red-500/20' : 'bg-primary/20';

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className={`bg-gray-900 border ${borderColor} rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className={`sticky top-0 bg-gray-900 border-b ${borderColorLight} px-6 py-4 flex items-center justify-between z-10`}>
          <div>
            <h2 className="text-2xl font-black text-white">{venue.name}</h2>
            <p className="text-sm text-gray-400 mt-1">
              {venue.total_turfs} turf{venue.total_turfs !== 1 ? 's' : ''} • {venue.city}, {venue.state}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Images Gallery */}
          {venue.images && venue.images.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Venue Images</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {venue.images.map((image, index) => (
                  <div key={index} className="aspect-video rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt={`${venue.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {venue.description && (
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Description</h3>
              <p className="text-gray-300 leading-relaxed">{venue.description}</p>
            </div>
          )}

          {/* Location & Contact */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Location</h3>
              <p className="text-white">{venue.location}</p>
              <p className="text-gray-400 text-sm mt-1">{venue.city}, {venue.state}</p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Contact</h3>
              <p className="text-white font-mono">{venue.phone}</p>
            </div>
          </div>

          {/* Amenities */}
          {venue.amenities && venue.amenities.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {venue.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 ${bgColor} ${textColor} text-sm rounded-full border ${borderColor}`}
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Turfs List */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
              Turfs ({venue.total_turfs})
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {venue.turfs.map((turf, index) => (
                <div 
                  key={turf.id}
                  className={`bg-surface-dark border ${borderColor} rounded-lg p-4`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-full ${bgColorDark} flex items-center justify-center ${textColor} font-bold text-sm`}>
                        {index + 1}
                      </span>
                      <div>
                        <h4 className="font-bold text-white">{turf.name}</h4>
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                          <span className={`material-symbols-outlined text-sm ${textColor}`}>
                            {getSportIcon(turf.sport_type)}
                          </span>
                          <span className="capitalize">{turf.sport_type}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-surface-highlight">
                    <span className="text-xs text-gray-400">Price per hour</span>
                    <span className={`text-lg font-black ${textColor}`}>₹{turf.price_per_hour}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Price Range Summary */}
            {venue.min_price && venue.max_price && (
              <div className={`mt-4 p-4 ${bgColor} border ${borderColor} rounded-lg`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Price Range:</span>
                  <span className={`text-lg font-bold ${textColor}`}>
                    ₹{venue.min_price} - ₹{venue.max_price}/hr
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Owner Info */}
          <div className={`bg-white/5 border ${borderColorLight} rounded-xl p-4`}>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Owner Information</h3>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full ${bgColorDark} flex items-center justify-center ${textColor} font-bold text-lg`}>
                {getInitials(venue.owner?.full_name || 'U')}
              </div>
              <div>
                <p className="text-white font-bold">{venue.owner?.full_name || 'Unknown'}</p>
                <p className="text-sm text-gray-400">{venue.owner?.email || 'No email'}</p>
              </div>
            </div>
          </div>

          {/* Submission Date */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
              {accentColor === 'red' ? 'Rejected On' : 'Submitted On'}
            </h3>
            <p className="text-white">{formatDate(venue.created_at)}</p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className={`sticky bottom-0 bg-gray-900 border-t ${borderColorLight} px-6 py-4 flex items-center justify-end gap-3`}>
          {actionButtons}
        </div>
      </div>
    </div>
  );
}
