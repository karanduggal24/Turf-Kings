import { TurfCardProps } from "@/app/constants/types";
export default function TurfCard({
  sport,
  sportIcon,
  name,
  location,
  distance,
  rating,
  amenities,
  price,
  imageUrl
}: TurfCardProps) {
  return (
    <div className="group bg-surface-dark rounded-2xl overflow-hidden hover:shadow-neon-lg transition-all duration-300 border border-surface-highlight hover:border-primary">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <div className="absolute top-4 left-4 z-10 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-surface-highlight">
          <span className="material-symbols-outlined text-primary text-sm">{sportIcon}</span>
          <span className="text-white text-xs font-bold uppercase tracking-wide">{sport}</span>
        </div>
        <div 
          className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110" 
          style={{ backgroundImage: `url('${imageUrl}')` }}
        ></div>
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
            {location} • {distance} away
          </p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          {amenities.map((amenity, index) => (
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
          <button className="bg-primary hover:bg-primary-hover text-black px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 neon-glow-hover">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}