'use client';

import LoadingSpinner from '@/components/common/LoadingSpinner';

interface TimeSlotGridProps {
  timeSlots: string[];
  selectedSlots: string[];
  bookedSlots: { start: string; end: string; type?: string }[];
  selectedDate: string;
  loading: boolean;
  showWarning: boolean;
  onSlotToggle: (time: string) => void;
}

const fmt12 = (t: string) => {
  const [h] = t.split(':');
  const hour = parseInt(h);
  return `${hour % 12 || 12}${hour >= 12 ? 'pm' : 'am'}`;
};

export default function TimeSlotGrid({
  timeSlots,
  selectedSlots,
  bookedSlots,
  selectedDate,
  loading,
  showWarning,
  onSlotToggle,
}: TimeSlotGridProps) {
  const isSlotBooked = (time: string): boolean =>
    bookedSlots.some(b => {
      const t = time.substring(0, 5);
      return t >= b.start.substring(0, 5) && t < b.end.substring(0, 5);
    });

  const isSlotPast = (time: string): boolean => {
    if (!selectedDate) return false;
    return new Date(`${selectedDate}T${time}`) < new Date();
  };

  return (
    <div className="mb-6">
      {/* Header */}
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
          {/* Mobile: horizontal scroll row — Desktop: grid */}
          <div className="md:hidden flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {timeSlots.map(time => {
              const isBooked = isSlotBooked(time);
              const isPast = isSlotPast(time);
              const isDisabled = isBooked || isPast;
              const isSelected = selectedSlots.includes(time);

              return (
                <button
                  key={time}
                  onClick={() => onSlotToggle(time)}
                  disabled={isDisabled}
                  className={`relative shrink-0 flex items-center justify-center w-14 h-11 rounded-xl border text-xs font-bold transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-primary border-primary text-black'
                      : isDisabled
                      ? 'bg-surface-dark/50 border-surface-highlight/30 text-gray-600 cursor-not-allowed'
                      : 'bg-surface-dark border-surface-highlight text-gray-300'
                  }`}
                >
                  {fmt12(time)}
                  {isBooked && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-surface-dark" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Desktop: grid */}
          <div className="hidden md:grid md:grid-cols-6 gap-2 mb-3">
            {timeSlots.map(time => {
              const isBooked = isSlotBooked(time);
              const isPast = isSlotPast(time);
              const isDisabled = isBooked || isPast;
              const isSelected = selectedSlots.includes(time);

              return (
                <button
                  key={time}
                  onClick={() => onSlotToggle(time)}
                  disabled={isDisabled}
                  className={`relative py-2.5 px-2 rounded-lg border text-sm font-medium transition-all ${
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
          <div className="flex items-center gap-4 text-xs text-gray-400 mt-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-primary rounded" />
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span>Booked</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-surface-dark/50 border border-surface-highlight/50 rounded" />
              <span>Unavailable</span>
            </div>
          </div>

          {/* Consecutive warning */}
          {showWarning && (
            <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start gap-2">
              <span className="material-symbols-outlined text-yellow-500 text-lg shrink-0">warning</span>
              <p className="text-sm text-yellow-500 font-medium">
                Select consecutive slots only — you can't skip hours.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
