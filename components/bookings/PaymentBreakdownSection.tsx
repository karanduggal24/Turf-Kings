import { PaymentBreakdownSectionProps, calculatePaymentBreakdown } from './booking-types';

export default function PaymentBreakdownSection({ totalAmount }: PaymentBreakdownSectionProps) {
  const { basePrice, serviceTax, bookingFee } = calculatePaymentBreakdown(totalAmount);

  return (
    <section className="bg-white/5 border border-primary/10 rounded-xl p-6 print-section print-break-avoid">
      <h3 className="font-bold mb-4 text-white print-text">Payment Breakdown</h3>
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400 print-text-gray">Base Price</span>
          <span className="text-white print-text">₹{basePrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400 print-text-gray">Service Tax (5%)</span>
          <span className="text-white print-text">₹{serviceTax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400 print-text-gray">Booking Fee</span>
          <span className="text-white print-text">₹{bookingFee.toFixed(2)}</span>
        </div>
        <div className="border-t border-primary/10 pt-3 flex justify-between items-center">
          <span className="font-bold text-white print-text">Total Paid</span>
          <span className="text-2xl font-black text-primary print-primary">₹{totalAmount.toFixed(2)}</span>
        </div>
      </div>
      <div className="bg-primary/10 rounded p-3 flex items-center gap-2 print-section">
        <span className="material-symbols-outlined text-primary text-sm print-primary">verified</span>
        <span className="text-[10px] font-bold uppercase tracking-tight text-primary print-primary">
          Payment Successful
        </span>
      </div>
    </section>
  );
}
