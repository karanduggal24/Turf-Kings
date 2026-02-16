'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProfileBanner from '@/components/profile/ProfileBanner';
import BookingsList from '@/components/profile/BookingsList';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import { useAuthStore } from '@/stores/authStore';
import { useBookingsStore } from '@/stores/bookingsStore';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function ProfilePageClient() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();
  const { bookings, loading: bookingsLoading, fetchBookings } = useBookingsStore();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [isLoading, setIsLoading] = useState(true);
  const [hasFetchedBookings, setHasFetchedBookings] = useState(false);
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

    // Fetch user bookings - force refresh to bypass cache
    if (user && !hasFetchedBookings) {
      fetchBookings({ user_id: user.id }, true); // Force refresh
      setHasFetchedBookings(true);
    }
    
    if (user) {
      setIsLoading(false);
    }
  }, [user, authLoading, router, fetchBookings, hasFetchedBookings, hasCheckedAuth]);

  // Show loading while auth is being checked
  if (authLoading || (isLoading && !hasCheckedAuth)) {
    return (
      <div className="min-h-screen flex flex-col bg-black">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="xl" text="Loading profile..." />
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

  // Calculate stats
  const totalBookings = bookings.length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;

  // Filter bookings
  const now = new Date();
  const upcomingBookings = bookings.filter(b => {
    // Combine date and time for accurate comparison
    const bookingDateTime = new Date(`${b.booking_date}T${b.start_time}`);
    return bookingDateTime >= now && b.status !== 'cancelled' && b.status !== 'completed';
  });

  const pastBookings = bookings.filter(b => {
    // Combine date and time for accurate comparison
    const bookingDateTime = new Date(`${b.booking_date}T${b.start_time}`);
    return bookingDateTime < now || b.status === 'completed' || b.status === 'cancelled';
  });

  const displayedBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  // Get user data
  const userInitials = (user.user_metadata?.full_name || user.email || 'U')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const userLocation = user.user_metadata?.location || 'Location not set';

  // Manual refresh function
  const handleRefreshBookings = () => {
    if (user) {
      setHasFetchedBookings(false); // Reset the flag
      fetchBookings({ user_id: user.id }, true); // Force refresh
      setHasFetchedBookings(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <ProfileBanner
            userName={userName}
            userLocation={userLocation}
            userInitials={userInitials}
            totalBookings={totalBookings}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content Area: Bookings */}
            <div className="lg:col-span-8 space-y-8">
              <BookingsList
                bookings={displayedBookings}
                loading={bookingsLoading}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onRefresh={handleRefreshBookings}
              />
            </div>

            {/* Right Sidebar */}
            <ProfileSidebar
              totalBookings={totalBookings}
              completedBookings={completedBookings}
              userLocation={userLocation}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
