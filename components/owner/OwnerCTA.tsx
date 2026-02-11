'use client';

export default function OwnerCTA() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary opacity-5"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <h2 className="text-5xl lg:text-7xl font-black uppercase italic tracking-tighter mb-8 leading-[0.9] text-white">
          Ready to <span className="text-primary underline decoration-4 underline-offset-8">Dominate</span> Your Local Market?
        </h2>
        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-light">
          Join the most advanced turf management ecosystem and start seeing ROI from Day 1.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/list-venue"
            className="bg-primary hover:bg-primary/90 text-black px-12 py-6 rounded-2xl font-black text-xl transition-all shadow-2xl shadow-primary/40"
          >
            Get Started Free
          </a>
        </div>
      </div>
    </section>
  );
}
