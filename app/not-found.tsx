import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Navbar */}
      <Navbar />

      {/* Stadium Background Effect */}
      <div 
        className="absolute inset-0 opacity-20 bg-cover bg-center -z-10"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1521733089267-33230e70471b?q=80&w=2070&auto=format&fit=crop')",
        }}
      />
      
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background-dark/85 to-background-dark/98 -z-10" />

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 py-12 relative">
        <div className="max-w-4xl w-full flex flex-col items-center text-center">
          {/* 404 Animation */}
          <div className="relative mb-12 group">
            <div className="absolute -inset-1 bg-primary/20 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition duration-1000" />
            
            <div className="relative flex flex-col items-center">
              <div className="flex items-end justify-center gap-4 md:gap-8 select-none">
                <span className="text-[120px] md:text-[200px] font-black leading-none text-white/10 italic tracking-tighter">
                  4
                </span>
                
                <div className="relative mb-6 md:mb-12">
                  <div className="w-24 h-24 md:w-40 md:h-40 bg-primary/10 rounded-full border-4 border-dashed border-primary/30 flex items-center justify-center animate-pulse">
                    <span className="material-symbols-outlined text-primary text-6xl md:text-8xl">
                      sports_soccer
                    </span>
                  </div>
                  <div className="absolute -top-4 -right-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded rotate-12 shadow-lg">
                    VAR: NO GOAL
                  </div>
                </div>
                
                <span className="text-[120px] md:text-[200px] font-black leading-none text-white/10 italic tracking-tighter">
                  4
                </span>
              </div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full pointer-events-none">
                <div className="flex justify-center items-center h-full">
                  <div className="bg-primary/90 text-background-dark font-black px-6 py-2 text-3xl md:text-5xl rounded-lg shadow-[0_0_40px_rgba(51,242,13,0.4)] rotate-[-2deg]">
                    MISSED!
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-4 max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
              OUT! You&apos;ve missed <br className="hidden md:block" /> the pitch.
            </h1>
            <p className="text-lg md:text-xl text-white/60 font-medium">
              The page you are looking for has been subbed off or never existed in this league.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 items-center">
            <Link
              href="/"
              className="bg-primary hover:bg-primary/90 text-background-dark font-display font-bold text-lg px-10 py-4 rounded-xl transition-all shadow-[0_10px_30px_-10px_rgba(51,242,13,0.5)] flex items-center gap-3"
            >
              <span className="material-symbols-outlined">stadium</span>
              Back to Home Page
            </Link>
            <Link
              href="/turfs"
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-display font-semibold text-lg px-10 py-4 rounded-xl transition-all"
            >
              Find Turfs
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
