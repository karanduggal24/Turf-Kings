import { BookingSummarySectionProps } from './booking-types';

export default function BookingSummarySection({
  bookingId,
  bookingDate,
  startTime,
  endTime,
  status,
  formatDate,
  formatTime,
}: BookingSummarySectionProps) {
  return (
    <section className="bg-white/5 border border-primary/10 rounded-xl p-8 relative overflow-hidden print-section print-break-avoid">
      <div className="absolute top-0 right-0 p-4 opacity-10 no-print">
        <span className="material-symbols-outlined text-8xl transform rotate-12">sports_soccer</span>
      </div>
      <h2 className="text-xs font-bold uppercase tracking-widest text-primary mb-6 print-primary">Booking Summary</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <p className="text-xs text-gray-400 mb-1 print-text-gray">Booking ID</p>
          <p className="font-bold text-lg text-white print-text">#{bookingId.slice(0, 8)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1 print-text-gray">Date</p>
          <p className="font-bold text-lg text-white print-text">{formatDate(bookingDate)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1 print-text-gray">Time Slot</p>
          <p className="font-bold text-lg text-primary print-primary">
            {formatTime(startTime)} - {formatTime(endTime)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1 print-text-gray">Status</p>
          <p className="font-bold text-lg text-primary capitalize print-primary">{status}</p>
        </div>
      </div>
    </section>
  );
}
