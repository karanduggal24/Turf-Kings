'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function ListVenueSuccessClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const turfId = searchParams.get('id');

  useEffect(() => {
    // Auto redirect to home after 5 seconds
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white/5 border border-primary/20 rounded-2xl p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-primary/20 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-primary">
              check_circle
            </span>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl md:text-4xl font-black text-white mb-4">
            Venue Submitted Successfully!
          </h1>
          
          <p className="text-gray-400 text-lg mb-8">
            Thank you for listing your venue with TurfKings. Your submission is now pending admin approval.
          </p>

          {/* Info Box */}
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mb-8 text-left">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">info</span>
              What happens next?
            </h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-xl mt-0.5">schedule</span>
                <span>Our admin team will review your venue details within 24-48 hours</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-xl mt-0.5">verified</span>
                <span>Once approved, your venue will be live on TurfKings</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-xl mt-0.5">notifications</span>
                <span>You'll receive an email notification when your venue goes live</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/')}
              className="px-8 py-3 bg-primary hover:bg-primary/90 text-black font-bold rounded-lg transition-all"
            >
              Back to Home
            </button>
            <button
              onClick={() => router.push('/list-venue')}
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg border border-primary/20 transition-all"
            >
              List Another Venue
            </button>
          </div>

          {/* Auto Redirect Notice */}
          <p className="text-sm text-gray-500 mt-6">
            You will be redirected to the home page in 5 seconds...
          </p>
        </div>
      </div>
    </div>
  );
}
