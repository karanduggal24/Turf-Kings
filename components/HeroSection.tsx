'use client';

import { useState } from 'react';

export default function HeroSection() {
  const [dateInputType, setDateInputType] = useState('text');

  return (
    <section className="relative w-full min-h-[80vh] flex items-center justify-center px-4 py-20 bg-black">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat opacity-30" 
          style={{
            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDfTh2XPAhAuHJ6ZnNq9JZGHsjgUmGORyCf_4z5Xb4EGeXSkJx8beMWkK6g6BMomb9M3UyU5W5OJS4QJfCYT2k4UmsgkAnAz4tf8DO1Y_QxMNiPkwucXLYECcmSkiCHtg-BYAfsUsMvVpzujMZgPt8eQwemYeeqFOzZjsjXIuZhSScDmNJ1yT_YZ5nnRR7tA--VxbGQi6O3OvsS2B6N5fk2o0nr7e2UhUb6MjxhrhE945De1TMaqmnrfKGD8cFJ-OTEIoNrfKi-miI')"
          }}
        ></div>
      </div>

      <div className="relative z-20 flex flex-col items-center max-w-4xl w-full gap-8 text-center">
        <div className="space-y-6">
          <h1 className="text-white text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
            Own the Game.
            <br />
            <span className="text-primary drop-shadow-lg" style={{textShadow: '0 0 20px rgba(0, 255, 65, 0.5)'}}>Book Your Turf.</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl font-normal max-w-2xl mx-auto">
            Premium cricket and football grounds available near you. Experience the thrill under the lights.
          </p>
        </div>

        {/* Search Module */}
        <div className="w-full max-w-[600px] bg-surface-dark/90 backdrop-blur-sm p-3 rounded-2xl border border-surface-highlight shadow-2xl flex flex-col md:flex-row gap-3 md:gap-0 md:items-center neon-glow">
          <div className="flex-1 flex items-center h-12 md:h-14 px-4">
            <span className="material-symbols-outlined text-primary mr-3">location_on</span>
            <input 
              className="w-full bg-transparent border-none text-white placeholder-gray-400 focus:ring-0 text-sm md:text-base p-0 outline-none" 
              placeholder="Where are you playing?" 
              type="text"
            />
          </div>
          <div className="hidden md:block w-px h-8 bg-surface-highlight"></div>
          <div className="flex-1 flex items-center h-12 md:h-14 px-4">
            <span className="material-symbols-outlined text-primary mr-3">calendar_today</span>
            <input 
              className="w-full bg-transparent border-none text-white placeholder-gray-400 focus:ring-0 text-sm md:text-base p-0 outline-none" 
              onFocus={() => setDateInputType('date')}
              onBlur={() => setDateInputType('text')}
              placeholder="Select Date" 
              type={dateInputType}
            />
          </div>
          <div className="p-1">
            <button className="w-full md:w-auto h-12 md:h-14 px-8 rounded-xl bg-primary hover:bg-primary-hover text-black font-bold text-base flex items-center justify-center gap-2 transition-all hover:scale-105 neon-glow-hover">
              <span className="material-symbols-outlined">search</span>
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* Sport Chips */}
        <div className="flex gap-4 flex-wrap justify-center">
          <button className="group flex items-center gap-2 px-4 py-3 rounded-xl bg-surface-dark/80 hover:bg-primary hover:text-black border border-surface-highlight hover:border-primary transition-all duration-300 backdrop-blur-sm neon-glow-hover">
            <span className="material-symbols-outlined text-primary group-hover:text-black">sports_cricket</span>
            <span className="text-white group-hover:text-black font-medium text-sm">Cricket</span>
          </button>
          <button className="group flex items-center gap-2 px-4 py-3 rounded-xl bg-surface-dark/80 hover:bg-primary hover:text-black border border-surface-highlight hover:border-primary transition-all duration-300 backdrop-blur-sm neon-glow-hover">
            <span className="material-symbols-outlined text-primary group-hover:text-black">sports_soccer</span>
            <span className="text-white group-hover:text-black font-medium text-sm">Football</span>
          </button>
          <button className="group flex items-center gap-2 px-4 py-3 rounded-xl bg-surface-dark/80 hover:bg-primary hover:text-black border border-surface-highlight hover:border-primary transition-all duration-300 backdrop-blur-sm neon-glow-hover">
            <span className="material-symbols-outlined text-primary group-hover:text-black">sports_basketball</span>
            <span className="text-white group-hover:text-black font-medium text-sm">Basketball</span>
          </button>
        </div>
      </div>
    </section>
  );
}