'use client';

export default function OwnerHero() {
  return (
    <header className="relative overflow-hidden py-24 lg:py-40 flex items-center min-h-[80vh]">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1529900748604-07564a03e7a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Join 500+ Turf Owners
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tight">
            Turn Your <span className="text-primary">Turf</span> <br/>
            Into a Business.
          </h1>
          
          <p className="text-xl text-gray-300 mb-10 max-w-2xl font-light leading-relaxed">
            The all-in-one platform to manage bookings, automate payments, and maximize growth for your football and cricket facilities.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/list-venue"
              className="bg-primary hover:bg-primary/90 text-black px-10 py-5 rounded-xl font-black text-lg transition-all transform hover:scale-105 shadow-2xl shadow-primary/40 flex items-center justify-center gap-2"
            >
              List Your Venue Now
              <span className="material-symbols-outlined">arrow_forward</span>
            </a>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="absolute bottom-0 right-0 w-full lg:w-1/2 h-1/2 lg:h-full opacity-40 lg:opacity-100 pointer-events-none">
        <img
          alt="Professional football pitch"
          className="w-full h-full object-cover lg:object-contain object-right-bottom"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCed48DBL1Nc8JTTg3owC4saVF8EB_3m16IeltT48NulUVoIpV8C8wLREcZIPya8mlYOhLVb6uIsPYVW9JpvzASdTKyY_B9C_ycKFa062QNPCxeU_aDgvjBEuIj-uGiEn7RLArLWNQZJQ3fSFOw6xSZ-wNg3R6pMOWlEaOa8oe7dTZqKLtwoAq7J_JUrDH7jUj-iOQ_Os31ecJ96XdU3fhhTPHh0lBJv3zr_EDc7OQ2EoqW6d9m6WaoryZLnuIFhe6835qWWAgVmFQ"
        />
      </div>
    </header>
  );
}
