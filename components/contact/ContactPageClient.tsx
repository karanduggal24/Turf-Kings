'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ContactPageClient() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Booking Inquiry',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
          {/* Hero Section */}
          <div className="mb-16">
            <h2 className="text-5xl lg:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight">
              GET IN THE GAME – <br/>
              <span className="text-primary">REACH OUT TO US</span>
            </h2>
            <p className="max-w-2xl text-gray-400 text-lg lg:text-xl font-normal">
              Have questions about booking a turf or partnering with us? Our team is here to help you get back on the field and score your next big goal.
            </p>
          </div>

          {/* Contact Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
            {/* Left: Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-surface-dark p-8 lg:p-10 rounded-xl shadow-2xl border border-primary/10">
                <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">mail</span>
                  Send us a Message
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold uppercase tracking-widest text-primary/70">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-4 focus:ring-0 focus:border-primary transition-all text-white outline-none"
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-bold uppercase tracking-widest text-primary/70">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-4 focus:ring-0 focus:border-primary transition-all text-white outline-none"
                        placeholder="Email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-widest text-primary/70">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-4 focus:ring-0 focus:border-primary transition-all text-white outline-none appearance-none"
                    >
                      <option>Booking Inquiry</option>
                      <option>Partner With Us</option>
                      <option>Technical Support</option>
                      <option>Feedback</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-widest text-primary/70">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-4 focus:ring-0 focus:border-primary transition-all text-white outline-none resize-none"
                      placeholder="Tell us how we can help you..."
                      rows={5}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-black font-black py-5 rounded-lg hover:brightness-110 transition-all flex items-center justify-center gap-3 uppercase tracking-tighter text-xl"
                  >
                    Send Message
                    <span className="material-symbols-outlined font-bold">send</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Right: Info Details */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              <div className="bg-surface-dark/50 p-8 rounded-xl border border-white/5 flex items-start gap-6">
                <div className="bg-primary/10 p-4 rounded-lg text-primary">
                  <span className="material-symbols-outlined text-3xl">location_on</span>
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-2">
                    Headquarters
                  </h4>
                  <p className="text-xl font-bold text-white">123 Turf Arena Blvd,</p>
                  <p className="text-gray-400">Sports City, SC 45092</p>
                </div>
              </div>

              <div className="bg-surface-dark/50 p-8 rounded-xl border border-white/5 flex items-start gap-6">
                <div className="bg-primary/10 p-4 rounded-lg text-primary">
                  <span className="material-symbols-outlined text-3xl">call</span>
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-2">
                    Phone
                  </h4>
                  <p className="text-xl font-bold text-white">+1 (555) TURF-PRO</p>
                  <p className="text-gray-400">Mon - Fri, 9am - 6pm</p>
                </div>
              </div>

              <div className="bg-surface-dark/50 p-8 rounded-xl border border-white/5 flex items-start gap-6">
                <div className="bg-primary/10 p-4 rounded-lg text-primary">
                  <span className="material-symbols-outlined text-3xl">sports_score</span>
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-2">
                    Support Email
                  </h4>
                  <p className="text-xl font-bold text-white">support@turfbook.com</p>
                  <p className="text-gray-400">24/7 Response Guaranteed</p>
                </div>
              </div>

              {/* Social Stats Card */}
              <div className="mt-auto p-8 rounded-xl bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 overflow-hidden relative group">
                <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-9xl text-primary/5 group-hover:text-primary/10 transition-all duration-700">
                  stadium
                </span>
                <h4 className="text-xl font-black italic uppercase tracking-tighter mb-2">
                  Join the league
                </h4>
                <p className="text-sm text-gray-400 mb-4">
                  Follow us for tournament updates and exclusive booking discounts.
                </p>
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary text-black flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                    <span className="material-symbols-outlined">share</span>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-primary text-black flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                    <span className="material-symbols-outlined">public</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <section className="w-full h-[450px] relative overflow-hidden bg-slate-900">
          {/* Map Background */}
          <div 
            className="absolute inset-0 grayscale contrast-125 opacity-20"
            style={{
              backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCYwT3sjmhMefajxuhqVusKutQ00XcmQE8GGx7xva5TpgHSed7RhAZS4dz1XTD6LhmaR9Y3GQm0NT3tC8MTHHblkv0zlxbC4dVhut_NxkCJ0mwqwNqqIu8gG9tyXybxArXaF4MKnY6map3YssfJFDCCuVSrwcg5vmFobxt7to5W6H2U7Y7QOXyN2oWGwwLk7GjxA2Z7crLF6CaNXgx-U3YGjZIKG-8d4VEUk4p_HxDD8veErMc24RWuUMUakC1cRm4Pv9CkBwjJSe4')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />

          {/* Map Pin */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex flex-col items-center">
              {/* Glowing Pin */}
              <div className="relative">
                <div className="absolute inset-0 bg-primary/50 blur-xl animate-pulse rounded-full" />
                <div className="relative bg-primary text-black p-3 rounded-full shadow-[0_0_20px_rgba(51,242,13,0.5)] border-4 border-black">
                  <span className="material-symbols-outlined text-4xl">stadium</span>
                </div>
              </div>
              
              <div className="mt-4 bg-black/90 border border-primary/30 backdrop-blur-md p-4 rounded-xl shadow-2xl text-center">
                <p className="text-primary font-black uppercase text-xs tracking-widest mb-1">
                  Our Main Arena
                </p>
                <p className="font-bold text-white">TurfBook HQ Offices</p>
                <button className="mt-3 text-xs font-bold text-primary flex items-center gap-1 hover:underline mx-auto">
                  GET DIRECTIONS
                  <span className="material-symbols-outlined text-sm">directions</span>
                </button>
              </div>
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-2">
            <button className="w-10 h-10 bg-black/80 border border-white/10 text-white rounded-lg flex items-center justify-center hover:bg-primary hover:text-black transition-colors">
              <span className="material-symbols-outlined">add</span>
            </button>
            <button className="w-10 h-10 bg-black/80 border border-white/10 text-white rounded-lg flex items-center justify-center hover:bg-primary hover:text-black transition-colors">
              <span className="material-symbols-outlined">remove</span>
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
