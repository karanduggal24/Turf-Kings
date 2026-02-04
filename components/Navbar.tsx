'use client';

import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-surface-highlight">
      <div className="px-4 md:px-10 lg:px-20 py-4 flex items-center justify-between max-w-[1440px] mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center neon-glow">
            <span className="material-symbols-outlined text-primary text-xl">sports_soccer</span>
          </div>
          <h1 className="text-white text-xl font-bold tracking-tight uppercase">
            PLAYGROUND
          </h1>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a className="text-white text-sm font-medium hover:text-primary transition-colors" href="#">
            Home
          </a>
          <a className="text-gray-400 text-sm font-medium hover:text-primary transition-colors" href="#">
            Turfs
          </a>
          <a className="text-gray-400 text-sm font-medium hover:text-primary transition-colors" href="#">
            About
          </a>
          <a className="text-gray-400 text-sm font-medium hover:text-primary transition-colors" href="#">
            Contact
          </a>
        </div>

        <button className="hidden md:flex cursor-pointer items-center justify-center rounded-full bg-primary hover:bg-primary-hover transition-all duration-300 px-6 py-2.5 text-black text-sm font-bold neon-glow-hover">
          Login / Sign Up
        </button>

        <button 
          className="md:hidden text-white hover:text-primary transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-surface-dark border-t border-surface-highlight">
          <div className="px-4 py-4 space-y-4">
            <a className="block text-white text-sm font-medium hover:text-primary transition-colors" href="#">
              Home
            </a>
            <a className="block text-gray-400 text-sm font-medium hover:text-primary transition-colors" href="#">
              Turfs
            </a>
            <a className="block text-gray-400 text-sm font-medium hover:text-primary transition-colors" href="#">
              About
            </a>
            <a className="block text-gray-400 text-sm font-medium hover:text-primary transition-colors" href="#">
              Contact
            </a>
            <button className="w-full mt-4 bg-primary hover:bg-primary-hover text-black px-6 py-2.5 rounded-full text-sm font-bold neon-glow">
              Login / Sign Up
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}