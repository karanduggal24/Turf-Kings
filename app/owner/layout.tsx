'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

const navItems = [
  { href: '/owner', label: 'Dashboard', icon: 'dashboard', exact: true },
  { href: '/owner/venues', label: 'My Venues', icon: 'stadium' },
  { href: '/owner/schedule', label: 'Schedule', icon: 'calendar_month' },
  { href: '/owner/bookings', label: 'Bookings', icon: 'event_available' },
  { href: '/owner/revenue', label: 'Revenue', icon: 'payments' },
];

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [ownerName, setOwnerName] = useState('');

  useEffect(() => {
    async function checkAccess() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { router.push('/login'); return; }

        const { data: userData } = await supabase
          .from('users').select('role, full_name').eq('id', session.user.id).single();

        if (!userData || !['turf_owner', 'admin'].includes((userData as any).role)) {
          router.push('/');
          return;
        }

        setOwnerName((userData as any).full_name || 'Owner');
      } catch {
        router.push('/');
      } finally {
        setChecking(false);
      }
    }
    checkAccess();
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <span className="animate-spin text-5xl">⚡</span>
      </div>
    );
  }

  const isActive = (item: typeof navItems[0]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <div className="min-h-screen flex bg-black">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 hidden lg:flex flex-col border-r border-primary/10 bg-surface-dark/50">
        {/* Logo */}
        <div className="p-6 border-b border-primary/10">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/Dark-Logo.svg" alt="TurfKings" width={32} height={32} />
            <div>
              <p className="font-black text-white text-sm">TurfKings</p>
              <p className="text-xs text-primary font-semibold">Owner Panel</p>
            </div>
          </Link>
        </div>

        {/* Owner info */}
        <div className="px-6 py-4 border-b border-primary/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-sm">
              {ownerName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">{ownerName}</p>
              <p className="text-xs text-gray-400">Venue Owner</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive(item)
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer links */}
        <div className="p-4 border-t border-primary/10 space-y-1">
          <Link href="/list-venue" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all">
            <span className="material-symbols-outlined text-xl">add_circle</span>
            Add New Venue
          </Link>
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all">
            <span className="material-symbols-outlined text-xl">home</span>
            Back to Site
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-30 bg-black/95 backdrop-blur-sm border-b border-primary/10 px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/Dark-Logo.svg" alt="TurfKings" width={28} height={28} />
            <span className="text-sm font-black text-white">Owner Panel</span>
          </Link>
          <div className="flex items-center gap-3">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`p-2 rounded-lg transition-colors ${isActive(item) ? 'text-primary' : 'text-gray-400'}`}
              >
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
              </Link>
            ))}
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}
