'use client';

import Link from 'next/link';
import type { User } from '@supabase/supabase-js';

interface MobileMenuProps {
  isOpen: boolean;
  pathname: string;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  onClose: () => void;
  onSignOut: () => void;
  onProfileClick: () => void;
  onLoginClick: () => void;
}

export default function MobileMenu({
  isOpen,
  pathname,
  user,
  loading,
  isAdmin,
  onClose,
  onSignOut,
  onProfileClick,
  onLoginClick,
}: MobileMenuProps) {
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/turfs', label: 'Turfs' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <div
      className={`md:hidden bg-surface-dark border-t border-surface-highlight transition-all duration-300 ease-out overflow-hidden ${
        isOpen
          ? 'max-h-[500px] opacity-100 translate-y-0'
          : 'max-h-0 opacity-0 -translate-y-2'
      }`}
    >
      <div className="px-4 py-6 space-y-4">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className={`block text-base font-medium hover:text-primary transition-all duration-200 py-3 px-4 rounded-lg hover:bg-surface-highlight transform hover:translate-x-2 ${
              pathname === link.href ? 'text-primary bg-surface-highlight' : 'text-gray-300'
            }`}
          >
            {link.label}
          </Link>
        ))}

        {loading ? (
          <div className="w-full mt-6 bg-primary/50 text-black px-8 py-3 rounded-full text-base font-bold flex items-center justify-center gap-2 cursor-default">
            <span className="animate-spin text-xl">⚡</span>
            <span>Loading...</span>
          </div>
        ) : user ? (
          <div className="mt-6 space-y-3">
            {/* User Info Card */}
            <div className="bg-surface-highlight border border-primary/30 rounded-xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-black font-bold text-lg shrink-0">
                {(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm truncate">
                  {user.user_metadata?.full_name || 'User'}
                </p>
                <p className="text-gray-400 text-xs truncate">{user.email}</p>
              </div>
            </div>

            <button
              onClick={onProfileClick}
              className="w-full bg-primary hover:bg-primary-hover text-black px-8 py-3 rounded-full text-base font-bold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-xl">account_circle</span>
              <span>My Profile</span>
            </button>
            {isAdmin && (
              <Link
                href="/admin"
                onClick={onClose}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full text-base font-bold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
                <span>Admin Dashboard</span>
              </Link>
            )}
            <button
              onClick={onSignOut}
              className="w-full bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full text-base font-bold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-xl">logout</span>
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <button
            onClick={onLoginClick}
            className="w-full mt-6 bg-primary hover:bg-primary-hover text-black px-8 py-3 rounded-full text-base font-bold neon-glow transition-all duration-300 hover:scale-105"
          >
            Login / Sign Up
          </button>
        )}
      </div>
    </div>
  );
}
