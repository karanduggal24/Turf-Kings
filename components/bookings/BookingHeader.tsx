import Image from 'next/image';
import { BookingHeaderProps } from './booking-types';

export default function BookingHeader({ turfName, venueName, venueImage }: BookingHeaderProps & { venueName?: string; venueImage?: string }) {
  const displayName = venueName && turfName 
    ? `${venueName} (${turfName})`
    : turfName || venueName || 'Venue';

  return (
    <header className="text-center mb-12">
      {/* Venue Image */}
      {venueImage && (
        <div className="relative w-full h-48 md:h-64 rounded-2xl overflow-hidden mb-6 border border-surface-highlight">
          <Image
            src={venueImage}
            alt={displayName}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/90 text-black shadow-lg">
              <span className="material-symbols-outlined text-4xl">check_circle</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Success Icon (if no image) */}
      {!venueImage && (
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 text-primary mb-6 shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-5xl print-primary">check_circle</span>
        </div>
      )}
      
      <h1 className="text-4xl font-black tracking-tight mb-2 text-white print-text">Game On!</h1>
      <p className="text-gray-400 text-lg print-text-gray">
        Your booking at <span className="text-white font-bold">{displayName}</span> is confirmed.
      </p>
    </header>
  );
}
