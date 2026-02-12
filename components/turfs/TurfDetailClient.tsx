'use client';

import type { Turf } from '@/app/constants/turf-types';
import TurfHero from './detail/TurfHero';
import TurfAbout from './detail/TurfAbout';
import TurfLocation from './detail/TurfLocation';
import BookingWidget from './detail/BookingWidgetNew';

interface TurfDetailClientProps {
  turf: Turf;
}

export default function TurfDetailClient({ turf }: TurfDetailClientProps) {
  return (
    <>
      <TurfHero turf={turf} />

      <main className="max-w-7xl mx-auto px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-12">
            <TurfAbout turf={turf} />
            <TurfLocation turf={turf} />
          </div>

          {/* Right Column: Booking Widget */}
          <div className="lg:col-span-4">
            <BookingWidget turf={turf} />
          </div>
        </div>
      </main>
    </>
  );
}
