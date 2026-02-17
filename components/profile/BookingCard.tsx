'use client';

import { useRouter } from 'next/navigation';
import { Booking } from '@/app/constants/booking-types';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Image from 'next/image';

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

  const handleViewReceipt = () => {
    router.push(`/bookings/${booking.id}`);
  };

  // Get venue and turf names
  const venueName = (booking as any).venue?.name || booking.turf?.name || 'Venue';
  const turfName = (booking as any).turf?.name || 'Turf';
  const displayName = (booking as any).venue?.name 
    ? `${venueName} (${turfName})`
    : turfName;

  // Get venue image
  const venueImage = (booking as any).venue?.images?.[0] || booking.turf?.images?.[0];

  return (
    <div
      onClick={handleViewReceipt}
      className={`bg-white/5 backdrop-blur-md border border-white/10 hover:border-primary/50 transition-all p-5 rounded-xl flex flex-col md:flex-row items-start md:items-center gap-6 cursor-pointer group ${
        isPast ? 'opacity-60 grayscale hover:grayscale-0 hover:opacity-100' : ''
      }`}
    >
      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-surface-dark relative border border-surface-highlight group-hover:border-primary transition-colors">
        {venueImage ? (
          <Image
            src={venueImage}
            alt={displayName}
            fill
            sizes="96px"
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-gray-600 group-hover:text-primary transition-colors">
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
          <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors">
            {displayName}
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
        <div className="flex items-center gap-2 text-sm text-gray-400 group-hover:text-primary transition-colors">
          <span>View Receipt</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </div>
      </div>
    </div>
  );
}
