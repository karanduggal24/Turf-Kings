'use client';

import { useRouter } from 'next/navigation';

interface ProfileSidebarProps {
  totalBookings: number;
  completedBookings: number;
  userLocation: string;
}

export default function ProfileSidebar({ 
  totalBookings, 
  completedBookings, 
  userLocation 
}: ProfileSidebarProps) {
  const router = useRouter();

  return (
    <aside className="lg:col-span-4 space-y-6">
      {/* Promo Card */}
      <div className="relative bg-black border-2 border-primary rounded-xl overflow-hidden p-6 group">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/40 transition-all"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary">storefront</span>
            <h2 className="text-xl font-bold uppercase italic tracking-wide text-white">
              Join the League
            </h2>
          </div>
          <p className="text-gray-300 text-sm mb-6 leading-relaxed">
            Own a space? Become a partner and monetize your turf. Reach thousands of local players and grow the sporting community.
          </p>
          <button
            onClick={() => router.push('/become-owner')}
            className="w-full cursor-pointer bg-primary text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(51,242,13,0.4)] transition-all"
          >
            BECOME A TURF OWNER
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
        <div className="absolute bottom-0 right-0 opacity-10 pointer-events-none">
          <span className="material-symbols-outlined text-9xl">stadium</span>
        </div>
      </div>

      {/* Achievements/Stats */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4 text-white">Player Achievements</h3>
        <div className="space-y-4">
          {completedBookings >= 10 && (
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">emoji_events</span>
              </div>
              <div>
                <p className="text-sm font-bold text-white">Goal Machine</p>
                <p className="text-xs text-gray-400">Completed {completedBookings} bookings</p>
              </div>
            </div>
          )}
          {totalBookings >= 5 && (
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">history</span>
              </div>
              <div>
                <p className="text-sm font-bold text-white">Regular Player</p>
                <p className="text-xs text-gray-400">Made {totalBookings} bookings</p>
              </div>
            </div>
          )}
          {totalBookings === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-400 text-sm">
                Complete bookings to earn achievements!
              </p>
            </div>
          )}
        </div>
        <button className="w-full mt-6 text-sm font-medium text-gray-400 hover:text-primary transition-colors py-2 border border-gray-700 rounded-lg">
          View All Badges
        </button>
      </div>

      {/* Venue Map Quick View */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden">
        <div className="h-32 bg-slate-800 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/80 px-4 py-2 rounded-full border border-primary/30 flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              <span className="text-xs font-medium text-white">Turfs nearby</span>
            </div>
          </div>
        </div>
        <div className="p-4">
          <p className="text-xs text-gray-400 mb-2">Your Location</p>
          <p className="text-sm font-bold text-white">{userLocation}</p>
          <button
            onClick={() => router.push('/turfs')}
            className="mt-3 text-xs font-bold text-primary hover:underline"
          >
            Explore Nearby Turfs →
          </button>
        </div>
      </div>
    </aside>
  );
}
