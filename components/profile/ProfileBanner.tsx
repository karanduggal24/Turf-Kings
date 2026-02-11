'use client';

interface ProfileBannerProps {
  userName: string;
  userLocation: string;
  userInitials: string;
  totalBookings: number;
}

export default function ProfileBanner({ 
  userName, 
  userLocation, 
  userInitials, 
  totalBookings 
}: ProfileBannerProps) {
  return (
    <section className="relative rounded-xl overflow-hidden mb-8 border border-primary/10">
      <div className="h-48 bg-primary/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/40 via-transparent to-transparent"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
      </div>

      <div className="px-8 pb-8 -mt-12 relative flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="flex items-start md:items-end gap-4 md:gap-6">
          <div className="relative shrink-0">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl border-4 border-black shadow-2xl bg-primary flex items-center justify-center text-black text-3xl md:text-4xl font-bold">
              {userInitials}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-primary text-black px-2 py-1 rounded text-[10px] font-bold uppercase">
              Pro Player
            </div>
          </div>
          <div className="flex-1 md:mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-white">{userName}</h1>
            <p className="text-gray-400 flex items-center gap-1 text-sm md:text-base">
              <span className="material-symbols-outlined text-sm">location_on</span>
              {userLocation}
            </p>
          </div>
          <div className="md:hidden bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-lg text-center shrink-0">
            <p className="text-[9px] uppercase tracking-wider text-gray-400 mb-1">
              Total Bookings
            </p>
            <p className="text-xl font-bold text-primary">{totalBookings}</p>
          </div>
        </div>

        <div className="hidden md:flex gap-4">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-lg min-w-[120px] text-center">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">
              Total Bookings
            </p>
            <p className="text-2xl font-bold text-primary">{totalBookings}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
