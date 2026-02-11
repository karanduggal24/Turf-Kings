'use client';

import { useRouter } from 'next/navigation';
import { Booking } from '@/app/constants/booking-types';

interface BookingCardProps {
  booking: Booking;
  isPast: boolean;
}

export default function BookingCard({ booking, isPast }: BookingCardProps) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-primary/20">
            Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-amber-500/20">
            Pending Pay
          </span>
        );
      case 'completed':
        return (
          <span className="bg-slate-500/10 text-slate-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-slate-500/20">
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-red-500/20">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`bg-white/5 backdrop-blur-md border border-white/10 hover:border-primary/30 transition-all p-5 rounded-xl flex flex-col md:flex-row items-start md:items-center gap-6 ${
        isPast ? 'opacity-60 grayscale hover:grayscale-0 hover:opacity-100' : ''
      }`}
    >
      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-surface-dark">
        {booking.turf?.images?.[0] ? (
          <img
            src={booking.turf.images[0]}
            alt={booking.turf.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-gray-600">
              stadium
            </span>
          </div>
        )}
      </div>

      <div className="flex-grow">
        <div className="flex items-center gap-2 mb-1">
          <span className="material-symbols-outlined text-primary text-sm">
            sports_soccer
          </span>
          <h3 className="font-bold text-lg text-white">
            {booking.turf?.name || 'Turf Name'}
          </h3>
        </div>
        <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">event</span>
            {formatDate(booking.booking_date)}
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">schedule</span>
            {booking.start_time} - {booking.end_time}
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">payments</span>
            ₹{booking.total_amount}
          </div>
        </div>
      </div>

      <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4">
        {getStatusBadge(booking.status)}
        {booking.status === 'pending' && (
          <button className="bg-primary text-black text-xs font-bold px-4 py-1.5 rounded uppercase hover:brightness-110 transition-all">
            Pay Now
          </button>
        )}
        {booking.status === 'completed' && (
          <button
            onClick={() => router.push(`/turfs/${booking.turf_id}`)}
            className="text-primary text-xs font-bold uppercase hover:underline"
          >
            Rebook
          </button>
        )}
      </div>
    </div>
  );
}
