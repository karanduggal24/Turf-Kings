'use client';

import { useState } from 'react';
import type { Turf } from '@/app/constants/turf-types';

interface BookingWidgetProps {
  turf: Turf;
}

export default function BookingWidget({ turf }: BookingWidgetProps) {
  const [selectedDate, setSelectedDate] = useState(14);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [showWarning, setShowWarning] = useState(false);

  const dates = [
    { day: 'Mon', date: 14 },
    { day: 'Tue', date: 15 },
    { day: 'Wed', date: 16 },
    { day: 'Thu', date: 17 },
    { day: 'Fri', date: 18 },
  ];

  const timeSlots = [
    { time: '06:00 PM' },
    { time: '07:00 PM' },
    { time: '08:00 PM' },
    { time: '09:00 PM' },
    { time: '10:00 PM' },
    { time: '11:00 PM' },
  ];

  // Check if selected slots are consecutive
  const areSlotsConsecutive = (slots: string[]): boolean => {
    if (slots.length <= 1) return true;
    
    const indices = slots
      .map(slot => timeSlots.findIndex(ts => ts.time === slot))
      .sort((a, b) => a - b);
    
    for (let i = 1; i < indices.length; i++) {
      if (indices[i] !== indices[i - 1] + 1) {
        return false;
      }
    }
    return true;
  };

  const toggleTimeSlot = (time: string) => {
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
        setTimeout(() => setShowWarning(false), 3000);
        return prev;
      }
      
      setShowWarning(false);
      return newSelection;
    });
  };

  const hoursBooked = selectedTimes.length;
  const subtotal = turf.price_per_hour * hoursBooked;
  const serviceFee = subtotal * 0.05;
  const total = subtotal + serviceFee;

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
            <span className="text-xs font-bold text-primary">February 2026</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {dates.map((date) => (
              <button
                key={date.date}
                onClick={() => setSelectedDate(date.date)}
                className={`shrink-0 w-14 py-3 rounded-xl border flex flex-col items-center transition-all ${
                  selectedDate === date.date
                    ? 'bg-primary text-black border-primary'
                    : 'bg-white/5 border-white/10 hover:border-primary/50'
                }`}
              >
                <span className={`text-[10px] font-bold uppercase ${selectedDate === date.date ? '' : 'opacity-60'}`}>
                  {date.day}
                </span>
                <span className="text-lg font-black tracking-tighter">{date.date}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Time Slots */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">
              Available Slots
            </h4>
            {selectedTimes.length > 0 && (
              <span className="text-xs text-primary font-bold">
                {selectedTimes.length} selected
              </span>
            )}
          </div>
          
          {/* Warning Message */}
          {showWarning && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 flex items-start gap-2 animate-fadeIn">
              <span className="material-symbols-outlined text-red-400 text-lg shrink-0">error</span>
              <div>
                <p className="text-xs font-bold text-red-400">Non-consecutive slots not allowed</p>
                <p className="text-[10px] text-red-300 mt-1">Please select time slots that are next to each other</p>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-3">
            {timeSlots.map((slot) => (
              <button
                key={slot.time}
                onClick={() => toggleTimeSlot(slot.time)}
                className={`p-3 rounded-lg text-sm font-bold transition-all ${
                  selectedTimes.includes(slot.time)
                    ? 'bg-primary text-black ring-4 ring-primary/20'
                    : 'bg-white/5 border border-white/10 hover:border-primary'
                }`}
              >
                {slot.time}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-gray-500 text-center">
            Select consecutive time slots for your booking
          </p>
        </div>

        {/* Summary */}
        <div className="pt-6 border-t border-white/5 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Price ({hoursBooked} {hoursBooked === 1 ? 'Hour' : 'Hours'})</span>
            <span className="font-bold">₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Service Fee (5%)</span>
            <span className="font-bold">₹{serviceFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-lg font-black uppercase tracking-tighter italic">Total</span>
            <span className="text-2xl font-black tracking-tighter text-primary">
              ₹{total.toFixed(2)}
            </span>
          </div>
        </div>

        <button 
          disabled={selectedTimes.length === 0}
          className="w-full bg-primary text-black py-4 rounded-xl font-black uppercase tracking-tighter text-lg neon-glow-hover transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          Reserve Now
        </button>

        <p className="text-[10px] text-center text-gray-500 font-bold uppercase tracking-widest">
          No cancellation fee up to 12h before match
        </p>
      </div>
    </div>
  );
}
