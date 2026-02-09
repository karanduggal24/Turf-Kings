'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function AboutPageClient() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=2070&auto=format&fit=crop')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-background-dark/60 via-background-dark/80 to-background-dark" />
          </div>

          <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-6 text-center py-20">
            <span className="mb-4 inline-block rounded-full bg-primary/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary border border-primary/30">
              Our Mission
            </span>
            <h1 className="mb-6 text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[1.1] tracking-tighter text-white">
              Elevating <br />
              <span className="text-primary">The Game</span>
            </h1>
            <p className="max-w-2xl text-base sm:text-lg md:text-xl font-light leading-relaxed text-slate-300">
              Revolutionizing the way you book, play, and experience sports. We bring the stadium atmosphere to your fingertips, connecting athletes with premium facilities.
            </p>
            <div className="mt-10">
              <Link
                href="/turfs"
                className="inline-block rounded-lg bg-primary px-8 py-4 text-sm font-black uppercase tracking-widest text-background-dark shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
              >
                Book a Turf Now
              </Link>
            </div>
          </div>
        </section>

        {/* Core Pillars Section */}
        <section className="relative z-20 -mt-20 px-6 pb-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 md:grid-cols-3">
              {/* Our Story */}
              <div className="group relative overflow-hidden rounded-xl border border-white/5 bg-white/5 p-8 backdrop-blur-xl transition-all hover:border-primary/50 dark:bg-zinc-900/50">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-4xl">history_edu</span>
                </div>
                <h3 className="mb-4 text-2xl font-bold text-white">Our Story</h3>
                <p className="text-slate-400 leading-relaxed">
                  Born from a love for the game, we started in a local park with a simple goal: making turf booking effortless for every player who dreams of the big stage.
                </p>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all duration-500 group-hover:w-full" />
              </div>

              {/* Our Vision */}
              <div className="group relative overflow-hidden rounded-xl border border-white/5 bg-white/5 p-8 backdrop-blur-xl transition-all hover:border-primary/50 dark:bg-zinc-900/50">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-4xl">visibility</span>
                </div>
                <h3 className="mb-4 text-2xl font-bold text-white">Our Vision</h3>
                <p className="text-slate-400 leading-relaxed">
                  To create a global network of professional-grade pitches where every athlete feels like a pro, regardless of skill level, fostering talent and community.
                </p>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all duration-500 group-hover:w-full" />
              </div>

              {/* Why Choose Us */}
              <div className="group relative overflow-hidden rounded-xl border border-white/5 bg-white/5 p-8 backdrop-blur-xl transition-all hover:border-primary/50 dark:bg-zinc-900/50">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-4xl">verified</span>
                </div>
                <h3 className="mb-4 text-2xl font-bold text-white">Why Choose Us</h3>
                <p className="text-slate-400 leading-relaxed">
                  Seamless real-time booking, premium vetted pitches, and a dedicated community. We handle the logistics so you can focus on your performance.
                </p>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all duration-500 group-hover:w-full" />
              </div>
            </div>
          </div>
        </section>

        {/* Core Team Section */}
        <section className="bg-background-light dark:bg-background-dark py-24 px-6">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 flex flex-col items-center text-center">
              <h2 className="mb-4 text-4xl font-black uppercase tracking-tight md:text-5xl">
                The <span className="text-primary">Core Team</span>
              </h2>
              <div className="h-1.5 w-24 rounded-full bg-primary" />
              <p className="mt-6 max-w-2xl text-slate-500 dark:text-slate-400">
                Meet the dedicated strategist behind the platform, committed to bringing you the best sporting experience.
              </p>
            </div>

            <div className="flex justify-center">
              {/* Team Member */}
              <div className="flex flex-col items-center group">
                <div className="relative mb-6">
                  <div className="absolute -inset-2 rounded-full bg-primary/20 opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="h-48 w-48 overflow-hidden rounded-full border-4 border-transparent group-hover:border-primary transition-all duration-300">
                    <img
                      className="h-full w-full object-cover"
                      src="/MyImage.jpg"
                      alt="Karan Duggal"
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-background-dark shadow-lg">
                    <span className="material-symbols-outlined text-sm font-bold">star</span>
                  </div>
                </div>
                <h4 className="text-2xl font-bold">Karan Duggal</h4>
                <p className="text-sm font-bold uppercase tracking-widest text-primary">
                  Captain &amp; CEO
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative bg-background-dark py-24 px-6">
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, #33f20d 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-transparent to-background-dark" />

          <div className="relative z-10 mx-auto max-w-5xl rounded-3xl border border-primary/20 bg-zinc-900/80 p-12 md:p-20 text-center shadow-2xl backdrop-blur-sm overflow-hidden">
            {/* Decor */}
            <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

            <h2 className="mb-6 text-4xl font-black uppercase tracking-tighter text-white md:text-6xl">
              Ready to enter <br />
              The <span className="text-primary italic">Arena?</span>
            </h2>
            <p className="mx-auto mb-10 max-w-xl text-slate-400 text-lg">
              Join thousands of athletes who have already upgraded their game. Experience seamless booking and premium turfs today.
            </p>

            <div className="flex justify-center">
              <Link
                href="/turfs"
                className="inline-block rounded-lg bg-primary px-10 py-5 text-base font-black uppercase tracking-widest text-background-dark shadow-lg shadow-primary/30 transition-all hover:scale-105 hover:shadow-primary/50"
              >
                Book Your Turf
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
