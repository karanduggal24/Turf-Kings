'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuthStore();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: 'dashboard', exact: true },
    { name: 'Bookings', href: '/admin/bookings', icon: 'calendar_today', exact: false },
    { name: 'Venues', href: '/admin/venues', icon: 'stadium', exact: false },
    { name: 'Users', href: '/admin/users', icon: 'group', exact: false },
    { name: 'Revenue', href: '/admin/revenue', icon: 'payments', exact: false },
  ];


  const handleLogout = async () => {
    await signOut();
    window.location.href = '/login';
  };

  const userInitials = (user?.user_metadata?.full_name || user?.email || 'A')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside className="w-64 bg-gradient-to-b from-[#132210] to-[#1a2e16] border-r border-primary/10 flex-shrink-0 flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <Link href="/" className="flex items-center justify-start cursor-pointer">
          <div className="w-40 h-16 flex items-center justify-center">
            <img 
              src="/Dark-Logo.svg" 
              alt="TurfKings Logo" 
              className="w-full h-full object-contain"
            />
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navigation.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-400 hover:text-primary hover:bg-primary/5'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}

        <div className="pt-8 pb-4 px-4 uppercase text-[10px] font-bold tracking-widest text-gray-500">
          System
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-400/5 rounded-xl font-medium transition-all"
        >
          <span className="material-symbols-outlined">logout</span>
          Logout
        </button>
      </nav>

      {/* User Profile */}
      <div className="p-4 mt-auto">
        <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
          <p className="text-xs text-gray-400 mb-2">Logged in as</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-primary/20 bg-primary flex items-center justify-center text-black font-bold">
              {userInitials}
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Admin'}
              </p>
              <p className="text-[10px] text-primary">Super Admin</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
