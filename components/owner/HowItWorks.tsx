'use client';

export default function HowItWorks() {
  return (
    <section className="py-24 bg-black" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4 uppercase italic tracking-tighter">
            How it <span className="text-primary">Works</span>
          </h2>
          <div className="h-1.5 w-24 bg-primary mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="relative group">
            <div className="bg-surface-dark/50 border border-primary/10 rounded-2xl p-8 h-full transition-all group-hover:border-primary/40 hover:shadow-[0_0_20px_rgba(51,242,13,0.3)]">
              <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary text-3xl">add_business</span>
              </div>
              <span className="text-primary/40 font-black text-5xl absolute top-6 right-8 italic">01</span>
              <h3 className="text-2xl font-bold mb-4 text-white">List Your Venue</h3>
              <p className="text-gray-400 font-light leading-relaxed">
                Upload stunning photos of your facility, define your sports (Cricket, Football, Padel), and set dynamic pricing schedules.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative group">
            <div className="bg-surface-dark/50 border border-primary/10 rounded-2xl p-8 h-full transition-all group-hover:border-primary/40 hover:shadow-[0_0_20px_rgba(51,242,13,0.3)]">
              <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary text-3xl">calendar_today</span>
              </div>
              <span className="text-primary/40 font-black text-5xl absolute top-6 right-8 italic">02</span>
              <h3 className="text-2xl font-bold mb-4 text-white">Manage Bookings</h3>
              <p className="text-gray-400 font-light leading-relaxed">
                Real-time calendar synchronization prevents double bookings. Track every session from our intuitive mobile-friendly owner app.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative group">
            <div className="bg-surface-dark/50 border border-primary/10 rounded-2xl p-8 h-full transition-all group-hover:border-primary/40 hover:shadow-[0_0_20px_rgba(51,242,13,0.3)]">
              <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary text-3xl">trending_up</span>
              </div>
              <span className="text-primary/40 font-black text-5xl absolute top-6 right-8 italic">03</span>
              <h3 className="text-2xl font-bold mb-4 text-white">Grow Your Revenue</h3>
              <p className="text-gray-400 font-light leading-relaxed">
                Get automated weekly payouts. Use our data analytics to identify peak hours and optimize your pricing strategy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
