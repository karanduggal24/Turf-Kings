'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VenueFormNew from '@/components/venue/VenueFormNew';
import { useAuthStore } from '@/stores/authStore';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function ListVenueClient() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    // Wait for auth to finish loading before checking
    if (authLoading) {
      return;
    }

    // Mark that we've checked auth
    if (!hasCheckedAuth) {
      setHasCheckedAuth(true);
    }

    // Redirect if not logged in (only after auth has loaded)
    if (!user && hasCheckedAuth) {
      router.push('/login');
      return;
    }

    if (user) {
      setIsLoading(false);
    }
  }, [user, authLoading, router, hasCheckedAuth]);

  // Show loading while auth is being checked
  if (authLoading || (isLoading && !hasCheckedAuth)) {
    return (
      <div className="min-h-screen flex flex-col bg-black">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="xl" text="Loading..." />
        </main>
        <Footer />
      </div>
    );
  }

  // Don't render anything if redirecting
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-black">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="xl" text="Redirecting..." />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">
                Register Your Venue
              </h1>
              <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">
                Step 1 of 1
              </span>
            </div>
            <div className="relative">
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-surface-dark">
                <div className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>

          <VenueFormNew userId={user.id} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
