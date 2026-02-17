'use client';

import LoadingSpinner from '@/components/common/LoadingSpinner';

interface TimeSlotGridProps {
  timeSlots: string[];
  selectedSlots: string[];
  bookedSlots: { start: string; end: string }[];
  selectedDate: string;
  loading: boolean;
  showWarning: boolean;
  onSlotToggle: (time: string) => void;
}

export default function TimeSlotGrid({
  timeSlots,
  selectedSlots,
  bookedSlots,
  selectedDate,
  loading,
  showWarning,
  onSlotToggle,
}: TimeSlotGridProps) {
  const isSlotBooked = (time: string): boolean => {
    return bookedSlots.some(booking => {
      const slotTime = time.substring(0, 5);
      const bookingStart = booking.start.substring(0, 5);
      const bookingEnd = booking.end.substring(0, 5);
      return slotTime >= bookingStart && slotTime < bookingEnd;
    });
  };

  const isSlotPast = (time: string): boolean => {
    if (!selectedDate) return false;
    const now = new Date();
    const slotDateTime = new Date(`${selectedDate}T${time}`);
    return slotDateTime < now;
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-primary">
          Select Time Slots
        </h4>
        {selectedSlots.length > 0 && (
          <span className="text-xs text-gray-400">
            {selectedSlots.length} slot{selectedSlots.length !== 1 ? 's' : ''} selected
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="sm" text="Checking availability..." />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mb-3">
            {timeSlots.map((time) => {
              const isBooked = isSlotBooked(time);
              const isPast = isSlotPast(time);
              const isDisabled = isBooked || isPast;
              const isSelected = selectedSlots.includes(time);

              return (
                <button
                  key={time}
                  onClick={() => onSlotToggle(time)}
                  disabled={isDisabled}
                  className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all relative ${
                    isSelected
                      ? 'bg-primary border-primary text-black'
                      : isDisabled
                      ? 'bg-surface-dark/50 border-surface-highlight/50 text-gray-600 cursor-not-allowed'
                      : 'bg-surface-dark border-surface-highlight text-gray-300 hover:border-primary'
                  }`}
                >
                  {time}
                  {isBooked && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-surface-dark" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-primary rounded" />
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span>Booked</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-surface-dark/50 border border-surface-highlight/50 rounded" />
              <span>Past</span>
            </div>
          </div>

          {/* Warning */}
          {showWarning && (
            <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start gap-2 animate-pulse">
              <span className="material-symbols-outlined text-yellow-500 text-lg shrink-0">warning</span>
              <p className="text-sm text-yellow-500 font-medium">
                Please select consecutive time slots only. You cannot skip hours in between.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
