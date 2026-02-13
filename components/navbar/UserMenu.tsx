'use client';

import Link from 'next/link';
import type { User } from '@supabase/supabase-js';

interface UserMenuProps {
  user: User;
  isAdmin: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onProfileClick: () => void;
  onSignOut: () => void;
  onClose: () => void;
}

export default function UserMenu({
  user,
  isAdmin,
  isOpen,
  onToggle,
  onProfileClick,
  onSignOut,
  onClose,
}: UserMenuProps) {
  return (
    <div className="hidden md:flex items-center gap-4 relative profile-dropdown">
      <button
        onClick={onToggle}
        className="flex items-center gap-3 cursor-pointer rounded-full bg-surface-highlight hover:bg-surface-highlight/80 transition-all duration-300 hover:scale-105 px-5 py-2.5 border border-primary/30 hover:border-primary"
      >
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black font-bold text-sm">
          {(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}
        </div>
        <span className="hidden lg:block text-white text-sm font-medium">
          {user.user_metadata?.full_name || user.email?.split('@')[0]}
        </span>
        <span
          className={`material-symbols-outlined text-primary text-xl transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          expand_more
        </span>
      </button>

      {/* Profile Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-surface-dark border border-surface-highlight rounded-xl shadow-2xl overflow-hidden z-50 animate-fadeIn">
          <div className="p-4 border-b border-surface-highlight bg-black/40">
            <p className="text-white font-bold text-sm truncate">
              {user.user_metadata?.full_name || 'User'}
            </p>
            <p className="text-gray-400 text-xs truncate mt-1">{user.email}</p>
          </div>
          <div className="py-2">
            <button
              onClick={onProfileClick}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-surface-highlight transition-all duration-200 text-sm"
            >
              <span className="material-symbols-outlined text-xl">account_circle</span>
              <span className="font-medium">My Profile</span>
            </button>
            {isAdmin && (
              <Link
                href="/admin"
                onClick={onClose}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-surface-highlight transition-all duration-200 text-sm"
              >
                <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
                <span className="font-medium">Admin Dashboard</span>
              </Link>
            )}
            <button
              onClick={onSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 text-sm"
            >
              <span className="material-symbols-outlined text-xl">logout</span>
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
