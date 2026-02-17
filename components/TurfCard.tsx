import { TurfCardProps } from "@/app/constants/types";
import Link from "next/link";
import Button from '@/components/common/Button';
import Image from 'next/image';

export default function TurfCard({
  sport,
  sportIcon,
  name,
  location,
  distance,
  rating,
  amenities,
  price,
  imageUrl,
  turfId,
  totalTurfs,
  availableSports,
  minPrice,
  maxPrice
}: TurfCardProps & { 
  turfId?: string;
  totalTurfs?: number;
  availableSports?: string[];
  minPrice?: number;
  maxPrice?: number;
}) {
  const getSportIcon = (sportType: string) => {
    const icons: Record<string, string> = {
      football: 'sports_soccer',
      cricket: 'sports_cricket',
      badminton: 'sports_tennis',
      multi: 'sports_kabaddi',
    };
    return icons[sportType] || 'sports';
  };

  const displayPrice = minPrice && maxPrice && minPrice !== maxPrice 
    ? `₹${minPrice} - ₹${maxPrice}`
    : `₹${price || minPrice}`;

  const CardContent = (
    <div className="group bg-surface-dark rounded-2xl overflow-hidden hover:shadow-neon-lg transition-all duration-300 border border-surface-highlight hover:border-primary h-full flex flex-col">
      <div className="relative aspect-4/3 w-full overflow-hidden shrink-0">
        <div className="absolute top-4 left-4 z-10 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-surface-highlight">
          <span className="material-symbols-outlined text-primary text-sm">{sportIcon}</span>
          <span className="text-white text-xs font-bold uppercase tracking-wide">{sport}</span>
        </div>
        
        {/* Turf Count Badge */}
        {totalTurfs && totalTurfs > 0 && (
          <div className="absolute top-4 right-4 z-10 bg-primary/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-primary">
            <span className="text-black text-xs font-bold">{totalTurfs} Turf{totalTurfs !== 1 ? 's' : ''}</span>
          </div>
        )}
        
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1">
          <span className="material-symbols-outlined text-yellow-400 text-sm">star</span>
          <span className="text-white text-sm font-bold">{rating}</span>
        </div>
      </div>
      
      <div className="p-6 flex flex-col gap-4 h-full">
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors line-clamp-1">{name}</h3>
          <p className="text-gray-400 text-sm flex items-center gap-1 mt-1 line-clamp-1">
            <span className="material-symbols-outlined text-sm">near_me</span> 
            {location} • {distance}
          </p>
        </div>
        
        {/* Available Sports or Amenities - Fixed height container */}
        <div className="min-h-[32px] flex items-center gap-2 flex-wrap">
          {availableSports && availableSports.length > 0 ? (
            <>
              {availableSports.slice(0, 4).map((sportType, index) => (
                <span key={index} className="flex items-center gap-1 px-2 py-1 bg-surface-highlight rounded-lg text-xs text-gray-300 font-medium border border-surface-highlight">
                  <span className="material-symbols-outlined text-xs text-primary">{getSportIcon(sportType)}</span>
                  <span className="capitalize">{sportType}</span>
                </span>
              ))}
              {availableSports.length > 4 && (
                <span className="px-2 py-1 bg-surface-highlight rounded-lg text-xs text-gray-300 font-medium border border-surface-highlight">
                  +{availableSports.length - 4} more
                </span>
              )}
            </>
          ) : (
            <>
              {amenities.slice(0, 3).map((amenity, index) => (
                <span key={index} className="px-3 py-1 bg-surface-highlight rounded-lg text-xs text-gray-300 font-medium border border-surface-highlight">
                  {amenity}
                </span>
              ))}
            </>
          )}
        </div>
        
        <div className="pt-4 border-t border-surface-highlight flex items-center justify-between mt-auto">
          <div>
            <p className="text-gray-400 text-xs">Starting from</p>
            <p className="text-white font-bold text-lg">
              {displayPrice}<span className="text-sm font-normal text-gray-400">/hr</span>
            </p>
          </div>
          <Button size="sm" className="neon-glow-hover">
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );

  if (turfId) {
    return (
      <Link href={`/turfs/${turfId}`} className="block">
        {CardContent}
      </Link>
    );
  }

  return CardContent;
}