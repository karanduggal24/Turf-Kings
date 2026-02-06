'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
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
    setIsProfileOpen(false);
  };

  const handleProfileClick = () => {
    router.push('/profile');
    setIsProfileOpen(false);
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
      if (e.key === 'Escape') {
        if (isMenuOpen) toggleMenu();
        if (isProfileOpen) setIsProfileOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen, isProfileOpen]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isProfileOpen && !target.closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen]);

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
          <div className="hidden md:flex items-center gap-4 relative profile-dropdown">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 cursor-pointer rounded-full bg-surface-highlight hover:bg-surface-highlight/80 transition-all duration-300 hover:scale-105 px-5 py-2.5 border border-primary/30 hover:border-primary"
            >
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black font-bold text-sm">
                {(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}
              </div>
              <span className="text-white text-sm font-medium">
                {user.user_metadata?.full_name || user.email?.split('@')[0]}
              </span>
              <span className={`material-symbols-outlined text-primary text-xl transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-surface-dark border border-surface-highlight rounded-xl shadow-2xl overflow-hidden z-50 animate-fadeIn">
                <div className="p-4 border-b border-surface-highlight bg-black/40">
                  <p className="text-white font-bold text-sm truncate">
                    {user.user_metadata?.full_name || 'User'}
                  </p>
                  <p className="text-gray-400 text-xs truncate mt-1">
                    {user.email}
                  </p>
                </div>
                <div className="py-2">
                  <button
                    onClick={handleProfileClick}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-surface-highlight transition-all duration-200 text-sm"
                  >
                    <span className="material-symbols-outlined text-xl">
                      account_circle
                    </span>
                    <span className="font-medium">My Profile</span>
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 text-sm"
                  >
                    <span className="material-symbols-outlined text-xl">
                      logout
                    </span>
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              </div>
            )}
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
            ? 'max-h-[500px] opacity-100 translate-y-0' 
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
            <div className="mt-6 space-y-3">
              <button 
                onClick={handleProfileClick}
                className="w-full bg-primary hover:bg-primary-hover text-black px-8 py-3 rounded-full text-base font-bold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-xl">
                  account_circle
                </span>
                <span>My Profile</span>
              </button>
              <button 
                onClick={handleSignOut}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full text-base font-bold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-xl">
                  logout
                </span>
                <span>Sign Out</span>
              </button>
            </div>
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