'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUserRole } from '@/hooks/useUserRole';
import DesktopNav from './navbar/DesktopNav';
import MobileMenu from './navbar/MobileMenu';
import UserMenu from './navbar/UserMenu';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, loading, signOut } = useAuthStore();
  const { isAdmin } = useUserRole();
  const pathname = usePathname();
  const router = useRouter();

  const toggleMenu = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsMenuOpen(!isMenuOpen);
    setTimeout(() => setIsAnimating(false), 300);
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
    if (pathname !== '/login') {
      router.push('/login');
    }
  };

  const handleMobileLoginClick = () => {
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
        {/* Logo */}
        <Link href="/" className="flex items-center justify-start cursor-pointer">
          <div className="w-30 h-16 md:w-48 md:h-20 flex items-center justify-center">
            <img src="/Dark-Logo.svg" alt="TurfKings Logo" className="w-full h-full object-contain" />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <DesktopNav pathname={pathname} />

        {/* Desktop CTA/User Menu */}
        {loading ? (
          <div className="hidden md:flex cursor-default items-center justify-center rounded-full bg-primary/50 px-6 py-3 text-black text-base font-bold min-w-[180px]">
            <span className="flex items-center gap-2">
              <span className="animate-spin text-xl">⚡</span>
              <span>Loading...</span>
            </span>
          </div>
        ) : user ? (
          <UserMenu
            user={user}
            isAdmin={isAdmin}
            isOpen={isProfileOpen}
            onToggle={() => setIsProfileOpen(!isProfileOpen)}
            onProfileClick={handleProfileClick}
            onSignOut={handleSignOut}
            onClose={() => setIsProfileOpen(false)}
          />
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
      <MobileMenu
        isOpen={isMenuOpen}
        pathname={pathname}
        user={user}
        loading={loading}
        isAdmin={isAdmin}
        onClose={() => setIsMenuOpen(false)}
        onSignOut={handleSignOut}
        onProfileClick={handleProfileClick}
        onLoginClick={handleMobileLoginClick}
      />
    </nav>
  );
}
