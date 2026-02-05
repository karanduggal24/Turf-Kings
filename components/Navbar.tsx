'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { user, loading, signOut } = useAuthStore();

  const toggleMenu = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setIsMenuOpen(!isMenuOpen);
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        toggleMenu();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

  return (
    <nav className="sticky top-0 z-70 bg-black/95 backdrop-blur-md border-b border-surface-highlight">
      <div className="px-4 md:px-10 lg:px-20 flex items-center justify-between max-w-[1440px] mx-auto w-full">
        {/* Logo Section - Properly Centered */}
        <div className="flex items-center justify-start">
  <div className="w-40 h-16 md:w-48 md:h-20 flex items-center justify-center">
    <img 
      src="/Dark-Logo.svg" 
      alt="TurfKings Logo" 
      className="w-full h-full object-contain"
    />
  </div>
</div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <a className="text-white text-base font-medium hover:text-primary transition-colors duration-200 hover:scale-105" href="#">
            Home
          </a>
          <a className="text-gray-300 text-base font-medium hover:text-primary transition-colors duration-200 hover:scale-105" href="#">
            Turfs
          </a>
          <a className="text-gray-300 text-base font-medium hover:text-primary transition-colors duration-200 hover:scale-105" href="#">
            About
          </a>
          <a className="text-gray-300 text-base font-medium hover:text-primary transition-colors duration-200 hover:scale-105" href="#">
            Contact
          </a>
        </div>

        {/* Desktop CTA Button */}
        {loading ? (
          <div className="hidden md:flex items-center justify-center w-32 h-12 bg-surface-highlight rounded-full animate-pulse">
            <div className="w-4 h-4 bg-gray-400 rounded-full animate-pulse"></div>
          </div>
        ) : user ? (
          <div className="hidden md:flex items-center gap-4">
            <span className="text-gray-300 text-sm">
              Welcome, {user.user_metadata?.full_name || user.email}
            </span>
            <button 
              onClick={handleSignOut}
              className="cursor-pointer items-center justify-center rounded-full bg-red-600 hover:bg-red-700 transition-all duration-300 hover:scale-105 px-6 py-2 text-white text-sm font-bold"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button className="hidden md:flex cursor-pointer items-center justify-center rounded-full bg-primary hover:bg-primary-hover transition-all duration-300 hover:scale-105 px-8 py-3 text-black text-base font-bold neon-glow-hover">
            Login / Sign Up
          </button>
        )}

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white hover:text-primary transition-all duration-200 p-3 rounded-lg hover:bg-surface-highlight"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <span 
            className={`material-symbols-outlined transition-transform duration-300 text-2xl ${
              isMenuOpen ? 'rotate-180' : 'rotate-0'
            }`}
          >
            {isMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden bg-surface-dark border-t border-surface-highlight transition-all duration-300 ease-out overflow-hidden ${
          isMenuOpen 
            ? 'max-h-96 opacity-100 translate-y-0' 
            : 'max-h-0 opacity-0 -translate-y-2'
        }`}
      >
        <div className="px-4 py-6 space-y-4">
          <a 
            className="block text-white text-base font-medium hover:text-primary transition-all duration-200 py-3 px-4 rounded-lg hover:bg-surface-highlight transform hover:translate-x-2" 
            href="#"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </a>
          <a 
            className="block text-gray-300 text-base font-medium hover:text-primary transition-all duration-200 py-3 px-4 rounded-lg hover:bg-surface-highlight transform hover:translate-x-2" 
            href="#"
            onClick={() => setIsMenuOpen(false)}
          >
            Turfs
          </a>
          <a 
            className="block text-gray-300 text-base font-medium hover:text-primary transition-all duration-200 py-3 px-4 rounded-lg hover:bg-surface-highlight transform hover:translate-x-2" 
            href="#"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </a>
          <a 
            className="block text-gray-300 text-base font-medium hover:text-primary transition-all duration-200 py-3 px-4 rounded-lg hover:bg-surface-highlight transform hover:translate-x-2" 
            href="#"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </a>
          <button 
            className="w-full mt-6 bg-primary hover:bg-primary-hover text-black px-8 py-3 rounded-full text-base font-bold neon-glow transition-all duration-300 hover:scale-105"
            onClick={() => setIsMenuOpen(false)}
          >
            Login / Sign Up
          </button>
          {user && (
            <button 
              onClick={handleSignOut}
              className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full text-base font-bold transition-all duration-300 hover:scale-105"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}