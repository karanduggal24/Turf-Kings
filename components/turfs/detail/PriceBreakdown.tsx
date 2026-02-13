'use client';

interface PriceBreakdownProps {
  hoursBooked: number;
  pricePerHour: number;
  subtotal: number;
  serviceFee: number;
  bookingFee: number;
  total: number;
}

export default function PriceBreakdown({
  hoursBooked,
  pricePerHour,
  subtotal,
  serviceFee,
  bookingFee,
  total,
}: PriceBreakdownProps) {
  if (hoursBooked === 0) return null;

  return (
    <div className="space-y-3 pt-4 border-t border-white/10">
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">
          {hoursBooked} hour{hoursBooked > 1 ? 's' : ''} × ₹{pricePerHour}
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
  );
}
