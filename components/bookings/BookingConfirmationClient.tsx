'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import BookingHeader from './BookingHeader';
import BookingSummarySection from './BookingSummarySection';
import VenueDetailsSection from './VenueDetailsSection';
import UserDetailsSection from './UserDetailsSection';
import QRCodeSection from './QRCodeSection';
import PaymentBreakdownSection from './PaymentBreakdownSection';
import BookingActions from './BookingActions';
import { BookingDetails, BookingConfirmationClientProps, formatDate, formatTime } from './booking-types';

export default function BookingConfirmationClient({ bookingId }: BookingConfirmationClientProps) {
  const router = useRouter();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  async function fetchBookingDetails() {
    try {
      setLoading(true);
      const response = await fetch(`/api/bookings/${bookingId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch booking details');
      }

      const data = await response.json();
      setBooking(data.booking);
    } catch (err: any) {
      setError(err.message || 'Failed to load booking');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <LoadingSpinner size="md" />
        </div>
        <Footer />
      </>
    );
  }

  if (error || !booking) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-8 text-center max-w-md">
            <span className="material-symbols-outlined text-6xl text-red-500 mb-4">error</span>
            <p className="text-red-500 text-lg font-bold mb-4">{error || 'Booking not found'}</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-primary text-black font-bold rounded-lg hover:brightness-110 transition-all"
            >
              Back to Home
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="no-print">
        <Navbar />
      </div>
      
      <div className="min-h-screen bg-black py-12 px-4 print-container">
        <div className="max-w-5xl mx-auto">
          <BookingHeader turfName={booking.turf.name} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <BookingSummarySection
                bookingId={booking.id}
                bookingDate={booking.booking_date}
                startTime={booking.start_time}
                endTime={booking.end_time}
                status={booking.status}
                formatDate={formatDate}
                formatTime={formatTime}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <VenueDetailsSection
                  turfName={booking.turf.name}
                  location={booking.turf.location}
                  city={booking.turf.city}
                  state={booking.turf.state}
                  phone={booking.turf.phone}
                />

                <UserDetailsSection
                  fullName={booking.user.full_name}
                  email={booking.user.email}
                  phone={booking.user.phone}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <QRCodeSection bookingId={booking.id} />
              <PaymentBreakdownSection totalAmount={booking.total_amount} />
            </div>
          </div>

          <BookingActions />
        </div>
      </div>

      <div className="no-print">
        <Footer />
      </div>
    </>
  );
}
