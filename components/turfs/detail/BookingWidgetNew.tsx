'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import type { Turf } from '@/app/constants/turf-types';
import DatePicker from './DatePicker';
import TimeSlotGrid from './TimeSlotGrid';
import PriceBreakdown from './PriceBreakdown';

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

  const timeSlots = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00', '23:00',
  ];

  // Set default date to today
  useEffect(() => {
    if (!selectedDate && dates.length > 0) {
      setSelectedDate(dates[0].fullDate);
    }
  }, []);

  // Fetch booked slots when date changes
  useEffect(() => {
    if (selectedDate) {
      fetchBookedSlots();
    }
  }, [selectedDate, turf.id]);

  async function fetchBookedSlots() {
    try {
      const response = await fetch(
        `/api/bookings?turf_id=${turf.id}&date=${selectedDate}`
      );
      if (response.ok) {
        const data = await response.json();
        
        const booked: string[] = [];
        
        if (data.bookings && Array.isArray(data.bookings)) {
          data.bookings
            .filter((b: any) => b.status !== 'cancelled')
            .forEach((b: any) => {
              const startTime = b.start_time.substring(0, 5);
              const endTime = b.end_time.substring(0, 5);
              
              const startIndex = timeSlots.findIndex(slot => slot === startTime);
              let endIndex = timeSlots.findIndex(slot => slot === endTime);
              
              if (endIndex === -1 && (endTime === '00:00' || endTime === '24:00')) {
                endIndex = timeSlots.length;
              }
              
              if (startIndex !== -1) {
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
      setBookedSlots([]);
    }
  }

  const isSlotInPast = (time: string): boolean => {
    if (!selectedDate) return false;
    
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const slotDate = new Date(selectedDate);
    slotDate.setHours(hours, minutes, 0, 0);
    
    return slotDate < now;
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

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedTimes([]);
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
      const { supabase } = await import('@/lib/supabase');
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session. Please login again.');
      }

      const sortedTimes = [...selectedTimes].sort();
      const startTime = sortedTimes[0];
      const endTimeIndex = timeSlots.indexOf(sortedTimes[sortedTimes.length - 1]) + 1;
      const endTime = timeSlots[endTimeIndex] || '23:59';

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

      const { useBookingsStore } = await import('@/stores/bookingsStore');
      useBookingsStore.getState().clearBookings();

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
        <DatePicker 
          dates={dates}
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
        />

        <TimeSlotGrid
          timeSlots={timeSlots}
          selectedTimes={selectedTimes}
          bookedSlots={bookedSlots}
          onToggleSlot={toggleTimeSlot}
          isSlotInPast={isSlotInPast}
          showWarning={showWarning}
        />

        <PriceBreakdown
          hoursBooked={hoursBooked}
          pricePerHour={turf.price_per_hour}
          subtotal={subtotal}
          serviceFee={serviceFee}
          bookingFee={bookingFee}
          total={total}
        />

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-500 text-xs">
            {error}
          </div>
        )}

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
