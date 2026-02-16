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
  turfId
}: TurfCardProps & { turfId?: string }) {
  const CardContent = (
    <div className="group bg-surface-dark rounded-2xl overflow-hidden hover:shadow-neon-lg transition-all duration-300 border border-surface-highlight hover:border-primary">
      <div className="relative aspect-4/3 w-full overflow-hidden">
        <div className="absolute top-4 left-4 z-10 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-surface-highlight">
          <span className="material-symbols-outlined text-primary text-sm">{sportIcon}</span>
          <span className="text-white text-xs font-bold uppercase tracking-wide">{sport}</span>
        </div>
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
      
      <div className="p-6 flex flex-col gap-4">
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{name}</h3>
          <p className="text-gray-400 text-sm flex items-center gap-1 mt-1">
            <span className="material-symbols-outlined text-sm">near_me</span> 
            {location} • {distance}
          </p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          {amenities.slice(0, 3).map((amenity, index) => (
            <span key={index} className="px-3 py-1 bg-surface-highlight rounded-lg text-xs text-gray-300 font-medium border border-surface-highlight">
              {amenity}
            </span>
          ))}
        </div>
        
        <div className="pt-4 border-t border-surface-highlight flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs">Starting from</p>
            <p className="text-white font-bold text-lg">
              ₹{price}<span className="text-sm font-normal text-gray-400">/hr</span>
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