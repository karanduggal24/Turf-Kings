'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import AlertModal from '@/components/common/AlertModal';

interface BookingCreateClientProps {
  turf: any;
}

export default function BookingCreateClient({ turf }: BookingCreateClientProps) {
  const router = useRouter();
  const [bookingData, setBookingData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    // Get booking data from sessionStorage
    const data = sessionStorage.getItem('pendingBooking');
    if (data) {
      setBookingData(JSON.parse(data));
    } else {
      // Redirect back if no booking data
      router.push(`/turfs/${turf.venue.id}`);
    }
  }, []);

  const handleConfirmBooking = async () => {
    if (!bookingData) return;

    setLoading(true);
    try {
      // Get user from client-side Supabase
      const { supabase } = await import('@/lib/supabase');
      
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      
      if (authError || !session) {
        setAlertMessage('Please login to make a booking');
        setShowAlert(true);
        setLoading(false);
        // Redirect to login
        setTimeout(() => {
          router.push('/login');
        }, 2000);
        return;
      }

      // Calculate start and end times
      const startTime = bookingData.slots[0];
      const endTime = bookingData.slots[bookingData.slots.length - 1];
      
      // Add 1 hour to end time
      const [hours, minutes] = endTime.split(':');
      const endHour = (parseInt(hours) + 1).toString().padStart(2, '0');
      const finalEndTime = `${endHour}:${minutes}`;

      // Create booking with auth token
      const bookingResponse = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          turf_id: bookingData.turfId,
          venue_id: bookingData.venueId,
          booking_date: bookingData.date,
          start_time: startTime,
          end_time: finalEndTime,
          total_amount: bookingData.pricing.total,
        }),
      });

      if (!bookingResponse.ok) {
        const error = await bookingResponse.json();
        throw new Error(error.error || 'Failed to create booking');
      }

      const { booking } = await bookingResponse.json();

      // Clear session storage
      sessionStorage.removeItem('pendingBooking');

      // Redirect to confirmation page
      router.push(`/bookings/${booking.id}`);
    } catch (error: any) {
      setAlertMessage(error.message || 'Failed to create booking');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  if (!bookingData) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading booking details..." />
      </div>
    );
  }

  const { pricing, date, slots } = bookingData;

  return (
    <>
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 md:px-10 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Confirm Your Booking</h1>
          <p className="text-gray-400">Review your booking details before confirming</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Venue Info */}
            <div className="bg-surface-dark border border-surface-highlight rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">location_on</span>
                Venue Details
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400">Venue</p>
                  <p className="text-lg font-bold text-white">{turf.venue.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Turf</p>
                  <p className="text-white font-medium">{turf.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Location</p>
                  <p className="text-white">{turf.venue.location}, {turf.venue.city}, {turf.venue.state}</p>
                </div>
                {turf.venue.phone && (
                  <div>
                    <p className="text-sm text-gray-400">Contact</p>
                    <p className="text-white">{turf.venue.phone}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Booking Time */}
            <div className="bg-surface-dark border border-surface-highlight rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">schedule</span>
                Booking Schedule
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400">Date</p>
                  <p className="text-lg font-bold text-white">
                    {new Date(date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Time Slots</p>
                  <p className="text-white font-medium">
                    {slots[0]} - {(() => {
                      const lastSlot = slots[slots.length - 1];
                      const [hours, minutes] = lastSlot.split(':');
                      const endHour = (parseInt(hours) + 1).toString().padStart(2, '0');
                      return `${endHour}:${minutes}`;
                    })()} ({pricing.hoursBooked} {pricing.hoursBooked === 1 ? 'hour' : 'hours'})
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-1">
            <div className="bg-surface-dark border border-surface-highlight rounded-xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-4">Price Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">
                    Price ({pricing.hoursBooked} {pricing.hoursBooked === 1 ? 'Hour' : 'Hours'})
                  </span>
                  <span className="text-white font-medium">₹{pricing.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Service Fee (5%)</span>
                  <span className="text-white font-medium">₹{pricing.serviceFee.toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t border-surface-highlight flex justify-between items-center">
                  <span className="text-lg font-bold text-white">Total</span>
                  <span className="text-2xl font-black text-primary">₹{pricing.total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={handleConfirmBooking}
                fullWidth
                icon="check_circle"
                className="neon-glow-hover mb-3"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Confirm Booking'}
              </Button>

              <Button
                onClick={() => router.back()}
                fullWidth
                variant="secondary"
                disabled={loading}
              >
                Go Back
              </Button>

              <p className="text-xs text-center text-gray-500 mt-4">
                No cancellation fee up to 12h before booking
              </p>
            </div>
          </div>
        </div>
      </main>

      <AlertModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        title="Booking Error"
        message={alertMessage}
      />
    </>
  );
}
