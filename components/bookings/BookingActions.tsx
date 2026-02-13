'use client';

import { useRouter } from 'next/navigation';

export default function BookingActions() {
  const router = useRouter();

  return (
    <>
      <footer className="mt-12 flex flex-col md:flex-row items-center justify-center gap-4 no-print">
        <button
          onClick={() => window.print()}
          className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-primary to-yellow-400 text-black font-bold rounded-lg hover:shadow-lg hover:shadow-primary/50 transition-all flex items-center justify-center gap-2 shadow-md"
        >
          <span className="material-symbols-outlined">download</span>
          Download PDF
        </button>
        <button
          onClick={() => router.push('/profile')}
          className="w-full md:w-auto px-8 py-3 bg-white/10 border border-white/20 font-bold rounded-lg hover:bg-white/20 transition flex items-center justify-center gap-2 text-white"
        >
          <span className="material-symbols-outlined">person</span>
          View My Bookings
        </button>
        <button
          onClick={() => router.push('/')}
          className="w-full md:w-auto px-8 py-3 text-gray-400 font-bold hover:text-primary transition flex items-center justify-center gap-2"
        >
          Back to Home
        </button>
      </footer>

      <div className="mt-12 text-center no-print">
        <p className="text-xs text-gray-500 max-w-2xl mx-auto">
          Please arrive at least 15 minutes before your scheduled slot. Proper sports attire and footwear are required. 
          Cancellations must be made 24 hours in advance to be eligible for a refund.
        </p>
      </div>
    </>
  );
}
