'use client';

import { useRouter } from 'next/navigation';
import { Booking } from '@/app/constants/booking-types';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';

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
        return <Badge variant="success">Confirmed</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending Pay</Badge>;
      case 'completed':
        return <Badge variant="default">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="danger">Cancelled</Badge>;
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
          <Button size="sm" className="uppercase">
            Pay Now
          </Button>
        )}
        {booking.status === 'completed' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/turfs/${booking.turf_id}`)}
            className="uppercase"
          >
            Rebook
          </Button>
        )}
      </div>
    </div>
  );
}
