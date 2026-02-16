'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail('');
  };

  return (
    <footer className="bg-surface-dark border-t border-surface-highlight mt-auto">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <Image 
                src="/Dark-Logo.svg" 
                alt="TurfKings Logo" 
                width={100}
                height={100}
                className="object-contain"
                priority
              />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              The ultimate platform for sports enthusiasts to discover and book premium turfs instantly.
            </p>
          </div>
          
          <div>
            <h5 className="text-white font-bold mb-6">Explore</h5>
            <ul className="space-y-4">
              <li>
                <a className="text-gray-400 hover:text-neon-green text-sm transition-colors" href="#">
                  Book a Turf
                </a>
              </li>
              <li>
                <a className="text-gray-400 hover:text-neon-green text-sm transition-colors" href="#">
                  Tournaments
                </a>
              </li>
              <li>
                <a className="text-gray-400 hover:text-neon-green text-sm transition-colors" href="#">
                  Partner with us
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h5 className="text-white font-bold mb-6">Company</h5>
            <ul className="space-y-4">
              <li>
                <a className="text-gray-400 hover:text-neon-green text-sm transition-colors" href="#">
                  About Us
                </a>
              </li>
              <li>
                <a className="text-gray-400 hover:text-neon-green text-sm transition-colors" href="#">
                  Contact
                </a>
              </li>
              <li>
                <a className="text-gray-400 hover:text-neon-green text-sm transition-colors" href="#">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h5 className="text-white font-bold mb-6">Newsletter</h5>
            <p className="text-gray-400 text-sm mb-4">Subscribe for offers and updates.</p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input 
                className="bg-black border border-surface-highlight rounded-xl px-4 py-3 text-sm text-white focus:border-neon-green focus:ring-0 w-full" 
                placeholder="Email address" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button 
                type="submit"
                className="bg-neon-green text-black rounded-xl p-3 hover:bg-primary-hover transition-all duration-300 neon-glow-hover"
              >
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-surface-highlight mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-xs">© 2026 Turf-Kings. All rights reserved.</p>
          <div className="flex gap-6">
            <a className="text-gray-400 hover:text-neon-green transition-colors" href="#">
              <span className="material-symbols-outlined text-lg">public</span>
            </a>
            <a className="text-gray-400 hover:text-neon-green transition-colors" href="#">
              <span className="material-symbols-outlined text-lg">chat_bubble</span>
            </a>
            <a className="text-gray-400 hover:text-neon-green transition-colors" href="#">
              <span className="material-symbols-outlined text-lg">mail</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}