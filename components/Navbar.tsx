'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { user, loading, signOut } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

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

  const handleLoginClick = () => {
    // Only navigate if not already on login page
    if (pathname !== '/login') {
      router.push('/login');
    }
  };

  const handleMobileLoginClick = () => {
    // Only navigate if not already on login page
    if (pathname !== '/login') {
      router.push('/login');
    }
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
        <Link href="/" className="flex items-center justify-start cursor-pointer">
          <div className="w-30 h-16 md:w-48 md:h-20 flex items-center justify-center">
            <img 
              src="/Dark-Logo.svg" 
              alt="TurfKings Logo" 
              className="w-full h-full object-contain"
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link 
            href="/"
            className={`text-base font-medium hover:text-primary transition-colors duration-200 hover:scale-105 ${
              pathname === '/' ? 'text-primary' : 'text-gray-300'
            }`}
          >
            Home
          </Link>
          <Link 
            href="#"
            className="text-gray-300 text-base font-medium hover:text-primary transition-colors duration-200 hover:scale-105"
          >
            Turfs
          </Link>
          <Link 
            href="#"
            className="text-gray-300 text-base font-medium hover:text-primary transition-colors duration-200 hover:scale-105"
          >
            About
          </Link>
          <Link 
            href="#"
            className="text-gray-300 text-base font-medium hover:text-primary transition-colors duration-200 hover:scale-105"
          >
            Contact
          </Link>
        </div>

        {/* Desktop CTA Button */}
        {loading ? (
          <div className="hidden md:flex cursor-default items-center justify-center rounded-full bg-primary/50 px-6 py-3 text-black text-base font-bold min-w-[180px]">
            <span className="flex items-center gap-2">
              <span className="animate-spin text-xl">⚡</span>
              <span>Loading...</span>
            </span>
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
          <button 
            onClick={handleLoginClick}
            className="hidden md:flex cursor-pointer items-center justify-center rounded-full bg-primary hover:bg-primary-hover transition-all duration-300 hover:scale-105 px-6 py-3 text-black text-base font-bold neon-glow-hover min-w-[180px]"
          >
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
          <Link 
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className={`block text-base font-medium hover:text-primary transition-all duration-200 py-3 px-4 rounded-lg hover:bg-surface-highlight transform hover:translate-x-2 ${
              pathname === '/' ? 'text-primary bg-surface-highlight' : 'text-gray-300'
            }`}
          >
            Home
          </Link>
          <Link 
            href="#"
            onClick={() => setIsMenuOpen(false)}
            className="block text-gray-300 text-base font-medium hover:text-primary transition-all duration-200 py-3 px-4 rounded-lg hover:bg-surface-highlight transform hover:translate-x-2"
          >
            Turfs
          </Link>
          <Link 
            href="#"
            onClick={() => setIsMenuOpen(false)}
            className="block text-gray-300 text-base font-medium hover:text-primary transition-all duration-200 py-3 px-4 rounded-lg hover:bg-surface-highlight transform hover:translate-x-2"
          >
            About
          </Link>
          <Link 
            href="#"
            onClick={() => setIsMenuOpen(false)}
            className="block text-gray-300 text-base font-medium hover:text-primary transition-all duration-200 py-3 px-4 rounded-lg hover:bg-surface-highlight transform hover:translate-x-2"
          >
            Contact
          </Link>
          
          {loading ? (
            <div className="w-full mt-6 bg-primary/50 text-black px-8 py-3 rounded-full text-base font-bold flex items-center justify-center gap-2 cursor-default">
              <span className="animate-spin text-xl">⚡</span>
              <span>Loading...</span>
            </div>
          ) : user ? (
            <button 
              onClick={handleSignOut}
              className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full text-base font-bold transition-all duration-300 hover:scale-105"
            >
              Sign Out
            </button>
          ) : (
            <button 
              onClick={handleMobileLoginClick}
              className="w-full mt-6 bg-primary hover:bg-primary-hover text-black px-8 py-3 rounded-full text-base font-bold neon-glow transition-all duration-300 hover:scale-105"
            >
              Login / Sign Up
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}