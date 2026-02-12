'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/lib/supabase';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();
  const [role, setRole] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function checkAdminAccess() {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/login');
          return;
        }

        // Fetch user role
        const { data: userData, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (error || !userData) {
          router.push('/');
          return;
        }

        if ((userData as any).role !== 'admin') {
          router.push('/');
          return;
        }

        setRole((userData as any).role);
      } catch (error) {
        router.push('/');
      } finally {
        setChecking(false);
      }
    }

    checkAdminAccess();
  }, [router]);

  if (checking || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <span className="animate-spin text-6xl">⚡</span>
          <p className="text-white text-lg">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen flex overflow-hidden bg-black">
      <AdminSidebar 
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-black">
        {/* Mobile Header with Hamburger */}
        <div className="lg:hidden sticky top-0 z-30 bg-black/95 backdrop-blur-sm border-b border-primary/10 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-gray-400 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-3xl">menu</span>
          </button>
          <div className="flex items-center gap-2">
            <img 
              src="/Dark-Logo.svg" 
              alt="TurfKings" 
              className="h-8 w-auto"
            />
          </div>
          <div className="w-8"></div>
        </div>

        {children}
      </main>
    </div>
  );
}
