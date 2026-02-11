'use client';

import { useRouter } from 'next/navigation';
import { Booking } from '@/app/constants/booking-types';
import BookingCard from './BookingCard';

interface BookingsListProps {
  bookings: Booking[];
  loading: boolean;
  activeTab: 'upcoming' | 'past';
  onTabChange: (tab: 'upcoming' | 'past') => void;
  onRefresh?: () => void;
}

export default function BookingsList({ 
  bookings, 
  loading, 
  activeTab, 
  onTabChange,
  onRefresh 
}: BookingsListProps) {
  const router = useRouter();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-white">
          <span className="material-symbols-outlined text-primary">calendar_today</span>
          My Bookings
        </h2>
        <div className="flex items-center gap-3">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-primary transition-colors disabled:opacity-50"
              title="Refresh bookings"
            >
              <span className={`material-symbols-outlined ${loading ? 'animate-spin' : ''}`}>
                refresh
              </span>
            </button>
          )}
          <div className="flex p-1 bg-primary/5 rounded-lg">
            <button
              onClick={() => onTabChange('upcoming')}
              className={`px-4 py-1.5 text-sm font-medium rounded transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-primary text-black shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => onTabChange('past')}
              className={`px-4 py-1.5 text-sm font-medium rounded transition-all ${
                activeTab === 'past'
                  ? 'bg-primary text-black shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Past Matches
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <span className="animate-spin text-4xl">⚡</span>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-12 text-center">
          <span className="material-symbols-outlined text-6xl text-gray-600 mb-4">
            event_busy
          </span>
          <p className="text-gray-400 text-lg mb-2">
            No {activeTab} bookings found
          </p>
          <p className="text-gray-500 text-sm mb-6">
            {activeTab === 'upcoming' 
              ? 'Book a turf to get started!' 
              : 'Your completed bookings will appear here'}
          </p>
          {activeTab === 'upcoming' && (
            <button
              onClick={() => router.push('/turfs')}
              className="bg-primary cursor-pointer text-black font-bold px-6 py-3 rounded-lg hover:brightness-110 transition-all"
            >
              Browse Turfs
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <BookingCard 
              key={booking.id} 
              booking={booking} 
              isPast={activeTab === 'past'} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
