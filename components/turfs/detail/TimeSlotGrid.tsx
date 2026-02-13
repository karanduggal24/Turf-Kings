'use client';

interface TimeSlotGridProps {
  timeSlots: string[];
  selectedTimes: string[];
  bookedSlots: string[];
  onToggleSlot: (time: string) => void;
  isSlotInPast: (time: string) => boolean;
  showWarning: boolean;
}

export default function TimeSlotGrid({
  timeSlots,
  selectedTimes,
  bookedSlots,
  onToggleSlot,
  isSlotInPast,
  showWarning,
}: TimeSlotGridProps) {
  const formatTime = (time: string) => {
    const [hours] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:00 ${ampm}`;
  };

  return (
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
              onClick={() => onToggleSlot(time)}
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
  );
}
