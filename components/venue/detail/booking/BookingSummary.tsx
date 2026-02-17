'use client';

import Button from '@/components/common/Button';

interface BookingSummaryProps {
  selectedSlots: string[];
  pricing: {
    hoursBooked: number;
    subtotal: number;
    serviceFee: number;
    total: number;
  };
  onBookNow: () => void;
  disabled: boolean;
}

export default function BookingSummary({
  selectedSlots,
  pricing,
  onBookNow,
  disabled,
}: BookingSummaryProps) {
  const getEndTime = () => {
    if (selectedSlots.length === 0) return '';
    const lastSlot = selectedSlots[selectedSlots.length - 1];
    const [hours, minutes] = lastSlot.split(':');
    const endHour = (parseInt(hours) + 1).toString().padStart(2, '0');
    return `${endHour}:${minutes}`;
  };

  return (
    <>
      {selectedSlots.length > 0 && (
        <div className="mb-4 p-4 bg-surface-dark border border-surface-highlight rounded-lg space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Selected Slots:</span>
            <span className="font-medium text-white">
              {selectedSlots[0]} - {getEndTime()}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">
              Price ({pricing.hoursBooked} {pricing.hoursBooked === 1 ? 'Hour' : 'Hours'})
            </span>
            <span className="font-medium text-white">₹{pricing.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Service Fee (5%)</span>
            <span className="font-medium text-white">₹{pricing.serviceFee.toFixed(2)}</span>
          </div>
          <div className="pt-3 border-t border-surface-highlight flex items-center justify-between">
            <span className="text-sm font-bold text-gray-300 uppercase tracking-wide">Total</span>
            <span className="text-2xl font-black text-primary">
              ₹{pricing.total.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      <Button
        onClick={onBookNow}
        fullWidth
        icon="calendar_month"
        className="neon-glow-hover text-lg py-4"
        disabled={disabled}
      >
        {selectedSlots.length > 0
          ? `RESERVE NOW (${selectedSlots.length} SLOT${selectedSlots.length !== 1 ? 'S' : ''})`
          : 'SELECT SLOTS TO BOOK'
        }
      </Button>

      <p className="text-xs text-center text-gray-500 font-medium mt-2">
        No cancellation fee up to 12h before booking
      </p>
    </>
  );
}
