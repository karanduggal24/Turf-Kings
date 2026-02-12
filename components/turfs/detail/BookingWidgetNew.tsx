'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import type { Turf } from '@/app/constants/turf-types';

interface BookingWidgetProps {
  turf: Turf;
}

export default function BookingWidget({ turf }: BookingWidgetProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [showWarning, setShowWarning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [error, setError] = useState('');

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.getDate(),
      fullDate: date.toISOString().split('T')[0],
    };
  });

  // Set default date to today
  useEffect(() => {
    if (!selectedDate && dates.length > 0) {
      setSelectedDate(dates[0].fullDate);
    }
  }, []);

  const timeSlots = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00', '23:00',
  ];

  // Fetch booked slots when date changes
  useEffect(() => {
    if (selectedDate) {
      fetchBookedSlots();
    }
  }, [selectedDate, turf.id]); // Add turf.id as dependency

  async function fetchBookedSlots() {
    try {
      const response = await fetch(
        `/api/bookings?turf_id=${turf.id}&date=${selectedDate}`
      );
      if (response.ok) {
        const data = await response.json();
        
        // Extract ALL time slots within each booking's range
        const booked: string[] = [];
        
        if (data.bookings && Array.isArray(data.bookings)) {
          data.bookings
            .filter((b: any) => b.status !== 'cancelled')
            .forEach((b: any) => {
              // Handle both HH:MM:SS and HH:MM formats
              const startTime = b.start_time.substring(0, 5); // Get HH:MM format
              const endTime = b.end_time.substring(0, 5);
              
              // Find all slots between start and end time
              const startIndex = timeSlots.findIndex(slot => slot === startTime);
              let endIndex = timeSlots.findIndex(slot => slot === endTime);
              
              // Handle midnight/end of day bookings (00:00 or 24:00)
              if (endIndex === -1 && (endTime === '00:00' || endTime === '24:00')) {
                endIndex = timeSlots.length; // Mark until end of available slots
              }
              
              if (startIndex !== -1) {
                // Mark all slots from start to end (excluding end) as booked
                const lastIndex = endIndex !== -1 ? endIndex : timeSlots.length;
                for (let i = startIndex; i < lastIndex && i < timeSlots.length; i++) {
                  if (!booked.includes(timeSlots[i])) {
                    booked.push(timeSlots[i]);
                  }
                }
              }
            });
        }
        
        setBookedSlots(booked);
      }
    } catch (error) {
      // Silent fail but reset booked slots
      setBookedSlots([]);
    }
  }

  // Check if a time slot is in the past
  const isSlotInPast = (time: string): boolean => {
    if (!selectedDate) return false;
    
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const slotDate = new Date(selectedDate);
    slotDate.setHours(hours, minutes, 0, 0);
    
    return slotDate < now;
  };

  const formatTime = (time: string) => {
    const [hours] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:00 ${ampm}`;
  };

  const areSlotsConsecutive = (slots: string[]): boolean => {
    if (slots.length <= 1) return true;
    
    const indices = slots
      .map(slot => timeSlots.findIndex(ts => ts === slot))
      .sort((a, b) => a - b);
    
    for (let i = 1; i < indices.length; i++) {
      if (indices[i] !== indices[i - 1] + 1) {
        return false;
      }
    }
    return true;
  };

  const toggleTimeSlot = (time: string) => {
    // Don't allow selection of booked or past slots
    if (bookedSlots.includes(time) || isSlotInPast(time)) return;

    setSelectedTimes(prev => {
      let newSelection: string[];
      
      if (prev.includes(time)) {
        newSelection = prev.filter(t => t !== time);
        setShowWarning(false);
      } else {
        newSelection = [...prev, time];
      }
      
      if (newSelection.length > 1 && !areSlotsConsecutive(newSelection)) {
        setShowWarning(true);
        return prev;
      }
      
      setShowWarning(false);
      return newSelection;
    });
  };

  const handleBooking = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (selectedTimes.length === 0) {
      setError('Please select at least one time slot');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Get the Supabase client from the browser
      const { supabase } = await import('@/lib/supabase');
      
      // Get the session to get the access token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session. Please login again.');
      }

      // Sort times to get start and end
      const sortedTimes = [...selectedTimes].sort();
      const startTime = sortedTimes[0];
      const endTimeIndex = timeSlots.indexOf(sortedTimes[sortedTimes.length - 1]) + 1;
      const endTime = timeSlots[endTimeIndex] || '23:59';

      // Calculate breakdown
      const baseAmount = subtotal;
      const serviceFeeAmount = serviceFee;
      const bookingFeeAmount = bookingFee;

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          turf_id: turf.id,
          booking_date: selectedDate,
          start_time: startTime,
          end_time: endTime,
          base_amount: baseAmount,
          service_fee: serviceFeeAmount,
          booking_fee: bookingFeeAmount,
          total_amount: total,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create booking');
      }

      // Clear the bookings cache to force refresh
      const { useBookingsStore } = await import('@/stores/bookingsStore');
      useBookingsStore.getState().clearBookings();

      // Redirect to confirmation page
      router.push(`/bookings/${data.booking.id}`);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const hoursBooked = selectedTimes.length;
  const subtotal = turf.price_per_hour * hoursBooked;
  const serviceFee = subtotal * 0.05;
  const bookingFee = 50;
  const total = subtotal + serviceFee + bookingFee;

  return (
    <div className="sticky top-24 bg-surface-dark rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
      <div className="bg-primary p-6">
        <div className="flex justify-between items-center">
          <span className="text-black font-black uppercase tracking-tighter text-lg italic">
            Instant Booking
          </span>
          <div className="flex items-baseline gap-1 text-black">
            <span className="text-2xl font-black tracking-tighter">₹{turf.price_per_hour}</span>
            <span className="text-xs font-bold uppercase">/ Hr</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Date Picker */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">
              Select Date
            </h4>
            <span className="text-xs font-bold text-primary">
              {new Date(selectedDate || dates[0]?.fullDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {dates.map((d) => (
              <button
                key={d.fullDate}
                onClick={() => {
                  setSelectedDate(d.fullDate);
                  setSelectedTimes([]);
                }}
                className={`flex-shrink-0 flex flex-col items-center justify-center w-16 h-20 rounded-xl border-2 transition-all ${
                  selectedDate === d.fullDate
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-white/10 hover:border-primary/50 text-gray-400'
                }`}
              >
                <span className="text-xs font-bold uppercase">{d.day}</span>
                <span className="text-2xl font-black">{d.date}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Time Slots */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">
            Available Slots
          </h4>
          {showWarning && (
            <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-3 text-yellow-500 text-xs">
              Please select consecutive time slots only
            </div>
          )}
          <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
            {timeSlots.map((time) => {
              const isBooked = bookedSlots.includes(time);
              const isPast = isSlotInPast(time);
              const isSelected = selectedTimes.includes(time);
              const isDisabled = isBooked || isPast;
              
              return (
                <button
                  key={time}
                  onClick={() => toggleTimeSlot(time)}
                  disabled={isDisabled}
                  className={`py-3 px-2 rounded-lg text-xs font-bold transition-all ${
                    isBooked
                      ? 'bg-red-500/10 text-red-500 border border-red-500/20 cursor-not-allowed'
                      : isPast
                      ? 'bg-gray-500/10 text-gray-500 border border-gray-500/20 cursor-not-allowed opacity-50'
                      : isSelected
                      ? 'bg-primary text-black border-2 border-primary'
                      : 'bg-white/5 text-gray-300 border border-white/10 hover:border-primary/50'
                  }`}
                >
                  {formatTime(time)}
                  {isBooked && <div className="text-[8px] mt-1">BOOKED</div>}
                  {isPast && !isBooked && <div className="text-[8px] mt-1">PAST</div>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Price Breakdown */}
        {hoursBooked > 0 && (
          <div className="space-y-3 pt-4 border-t border-white/10">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">
                {hoursBooked} hour{hoursBooked > 1 ? 's' : ''} × ₹{turf.price_per_hour}
              </span>
              <span className="font-bold">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Service Fee (5%)</span>
              <span className="font-bold">₹{serviceFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Booking Fee</span>
              <span className="font-bold">₹{bookingFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-white/10">
              <span className="text-sm font-bold uppercase tracking-wider">Total</span>
              <span className="text-2xl font-black text-primary">₹{total.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-500 text-xs">
            {error}
          </div>
        )}

        {/* Book Button */}
        <button
          onClick={handleBooking}
          disabled={loading || selectedTimes.length === 0}
          className="w-full py-4 bg-primary text-black font-black uppercase tracking-wider rounded-xl hover:shadow-[0_0_30px_rgba(51,242,13,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : user ? 'Book Now' : 'Login to Book'}
        </button>

        <p className="text-[10px] text-gray-500 text-center">
          You won't be charged yet. Review your booking details on the next page.
        </p>
      </div>
    </div>
  );
}
