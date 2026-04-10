import Link from 'next/link';

const stats = [
  { value: '5,000+', label: 'Active Players', icon: 'groups' },
  { value: '200+', label: 'Venues Listed', icon: 'stadium' },
  { value: '50+', label: 'Cities Covered', icon: 'location_on' },
  { value: '4.8★', label: 'Average Rating', icon: 'star' },
];

const features = [
  { icon: 'bolt', title: 'Instant Booking', desc: 'Confirm your slot in seconds. No calls, no waiting.' },
  { icon: 'event_available', title: 'Real-Time Availability', desc: 'See live slot availability before you book.' },
  { icon: 'qr_code_2', title: 'QR Entry Pass', desc: 'Walk in with your QR code. Zero paperwork.' },
];

export default function PromotionalBanner() {
  return (
    <section className="py-16 px-4 md:px-10 lg:px-20 max-w-[1440px] mx-auto w-full bg-black">

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center gap-2 bg-surface-dark border border-surface-highlight rounded-2xl py-6 px-4 hover:border-primary/40 transition-colors"
          >
            <span className="material-symbols-outlined text-primary text-3xl">{stat.icon}</span>
            <span className="text-3xl font-black text-white">{stat.value}</span>
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* CTA Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-primary/30 bg-gradient-to-br from-primary/10 via-black to-black p-8 md:p-12">
        {/* Background glow */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
          {/* Left: Headline + CTA */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            <p className="inline-block text-xs font-black uppercase tracking-widest text-primary border border-primary/30 bg-primary/10 px-4 py-1.5 rounded-full">
              Why TurfKings?
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              The Smarter Way <br />
              <span className="text-primary">To Play.</span>
            </h2>
            <p className="text-gray-400 max-w-md text-lg leading-relaxed">
              From discovery to check-in — we handle everything so you can focus on the game.
            </p>
            <Link
              href="/turfs"
              className="inline-flex items-center gap-3 bg-primary text-black font-black px-8 py-4 rounded-2xl text-lg hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(51,242,13,0.25)]"
            >
              Find a Turf
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>

          {/* Right: Feature Cards */}
          <div className="flex-1 w-full space-y-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="flex items-start gap-4 bg-white/5 border border-white/5 rounded-xl p-5 hover:border-primary/30 transition-colors"
              >
                <div className="w-10 h-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">{f.icon}</span>
                </div>
                <div>
                  <p className="font-bold text-white">{f.title}</p>
                  <p className="text-sm text-gray-400 mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
