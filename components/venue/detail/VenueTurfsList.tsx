'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TurfCardHeader from './booking/TurfCardHeader';
import DateSelector from './booking/DateSelector';
import TimeSlotGrid from './booking/TimeSlotGrid';
import BookingSummary from './booking/BookingSummary';

interface VenueTurfsListProps {
  turfs: any[];
  venueId: string;
}

const TIME_SLOTS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
];

export default function VenueTurfsList({ turfs, venueId }: VenueTurfsListProps) {
  const router = useRouter();
  const [selectedTurf, setSelectedTurf] = useState<string | null>(null);
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<{ start: string; end: string }[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [showConsecutiveWarning, setShowConsecutiveWarning] = useState(false);

  useEffect(() => {
    if (selectedTurf && selectedDate) {
      fetchAvailability(selectedTurf, selectedDate);
    }
  }, [selectedTurf, selectedDate]);

  const fetchAvailability = async (turfId: string, date: string) => {
    setLoadingAvailability(true);
    try {
      const response = await fetch(`/api/turfs/${turfId}/availability?date=${date}`);
      const data = await response.json();
      setBookedSlots(data.bookedSlots || []);
    } catch (error) {
      setBookedSlots([]);
    } finally {
      setLoadingAvailability(false);
    }
  };

  const areSlotsConsecutive = (slots: string[]): boolean => {
    if (slots.length <= 1) return true;
    const indices = slots
      .map(slot => TIME_SLOTS.findIndex(ts => ts === slot))
      .sort((a, b) => a - b);
    for (let i = 1; i < indices.length; i++) {
      if (indices[i] !== indices[i - 1] + 1) return false;
    }
    return true;
  };

  const toggleTimeSlot = (time: string) => {
    setSelectedTimeSlots(prev => {
      const newSelection = prev.includes(time)
        ? prev.filter(t => t !== time)
        : [...prev, time];

      if (newSelection.length > 1 && !areSlotsConsecutive(newSelection)) {
        setShowConsecutiveWarning(true);
        setTimeout(() => setShowConsecutiveWarning(false), 3000);
        return prev;
      }

      setShowConsecutiveWarning(false);
      return newSelection.sort();
    });
  };

  const calculatePricing = (turf: any) => {
    const hoursBooked = selectedTimeSlots.length;
    const subtotal = turf.price_per_hour * hoursBooked;
    const serviceFee = subtotal * 0.05;
    const total = subtotal + serviceFee;
    return { hoursBooked, subtotal, serviceFee, total };
  };

  const handleBookNow = (turf: any) => {
    if (!selectedDate || selectedTimeSlots.length === 0) return;

    const bookingData = {
      turfId: turf.id,
      turfName: turf.name,
      venueId: venueId,
      date: selectedDate,
      slots: selectedTimeSlots,
      pricing: calculatePricing(turf),
    };

    sessionStorage.setItem('pendingBooking', JSON.stringify(bookingData));
    router.push(`/bookings/create/${turf.id}`);
  };

  const handleTurfExpand = (turfId: string) => {
    const isExpanding = selectedTurf !== turfId;
    setSelectedTurf(isExpanding ? turfId : null);

    if (!isExpanding || selectedTurf !== turfId) {
      setSelectedTimeSlots([]);
      setBookedSlots([]);
      setShowConsecutiveWarning(false);
    }

    if (isExpanding && selectedDate) {
      fetchAvailability(turfId, selectedDate);
    }
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedTimeSlots([]);
    setShowConsecutiveWarning(false);
  };

  if (turfs.length === 0) {
    return (
      <div className="text-center py-12 bg-surface-dark border border-surface-highlight rounded-xl">
        <span className="material-symbols-outlined text-gray-600 text-5xl mb-4">sports_soccer</span>
        <p className="text-gray-400">No turfs available for the selected sport</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {turfs.map((turf) => {
        const isExpanded = selectedTurf === turf.id;

        return (
          <div
            key={turf.id}
            className="bg-surface-dark border border-surface-highlight rounded-xl overflow-hidden transition-all"
          >
            <TurfCardHeader
              turf={turf}
              isExpanded={isExpanded}
              onToggle={() => handleTurfExpand(turf.id)}
            />

            {isExpanded && (
              <div className="border-t border-surface-highlight p-6 bg-black/20">
                <DateSelector
                  selectedDate={selectedDate}
                  onDateChange={handleDateChange}
                />

                <TimeSlotGrid
                  timeSlots={TIME_SLOTS}
                  selectedSlots={selectedTimeSlots}
                  bookedSlots={bookedSlots}
                  selectedDate={selectedDate}
                  loading={loadingAvailability}
                  showWarning={showConsecutiveWarning}
                  onSlotToggle={toggleTimeSlot}
                />

                <BookingSummary
                  selectedSlots={selectedTimeSlots}
                  pricing={calculatePricing(turf)}
                  onBookNow={() => handleBookNow(turf)}
                  disabled={!selectedDate || selectedTimeSlots.length === 0 || loadingAvailability}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
