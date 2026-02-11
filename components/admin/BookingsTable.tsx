'use client';

import { useEffect, useState } from 'react';
import { Booking } from '@/app/constants/booking-types';

interface BookingWithRelations extends Omit<Booking, 'turf'> {
  user?: {
    full_name: string;
    email: string;
    phone: string;
  };
  turf?: {
    name: string;
    location: string;
    sport_type: string;
  };
}

const SPORT_COLORS: Record<string, string> = {
  cricket: 'bg-primary',
  football: 'bg-blue-500',
  badminton: 'bg-purple-500',
  multi: 'bg-orange-500',
};

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  pending: { bg: 'bg-amber-500/20', text: 'text-amber-500', border: 'border-amber-500/30' },
  confirmed: { bg: 'bg-primary/20', text: 'text-primary', border: 'border-primary/30' },
  completed: { bg: 'bg-green-500/20', text: 'text-green-500', border: 'border-green-500/30' },
  cancelled: { bg: 'bg-gray-500/20', text: 'text-gray-500', border: 'border-gray-500/30' },
};

const PAYMENT_STATUS_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  pending: { bg: 'bg-amber-500/20', text: 'text-amber-500', border: 'border-amber-500/30' },
  paid: { bg: 'bg-primary/20', text: 'text-primary', border: 'border-primary/30' },
  failed: { bg: 'bg-red-500/20', text: 'text-red-500', border: 'border-red-500/30' },
  refunded: { bg: 'bg-red-500/20', text: 'text-red-500', border: 'border-red-500/30' },
};

export default function BookingsTable() {
  const [bookings, setBookings] = useState<BookingWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchBookings();
  }, [page]);

  async function fetchBookings() {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/bookings?page=${page}&limit=10`);
      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings);
        setTotalPages(data.pagination.totalPages);
        setTotal(data.pagination.total);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (timeStr: string) => {
    return timeStr.substring(0, 5);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-md border border-primary/10 rounded-xl p-12 flex items-center justify-center">
        <span className="animate-spin text-4xl">⚡</span>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-md border border-primary/10 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-primary/10 bg-primary/5">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">
                Booking ID
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">
                Customer
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">
                Turf Venue
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">
                Date & Time
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">
                Payment Status
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/5">
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  No bookings found
                </td>
              </tr>
            ) : (
              bookings.map((booking) => {
                const statusStyle = PAYMENT_STATUS_STYLES[booking.payment_status] || PAYMENT_STATUS_STYLES.pending;
                const sportColor = SPORT_COLORS[booking.turf?.sport_type || ''] || 'bg-gray-500';

                return (
                  <tr key={booking.id} className="hover:bg-primary/5 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-1 rounded">
                        #{booking.id.substring(0, 8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold border border-primary/30">
                          {getInitials(booking.user?.full_name || 'U')}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {booking.user?.full_name || 'Unknown'}
                          </p>
                          <p className="text-xs text-gray-500">{booking.user?.phone || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${sportColor}`}></span>
                        <span className="text-sm text-white">{booking.turf?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <p className="font-medium text-gray-200">{formatDate(booking.booking_date)}</p>
                      <p className="text-xs text-gray-500">
                        {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.text.replace('text-', 'bg-')} mr-1.5 ${booking.payment_status === 'paid' ? 'animate-pulse' : ''}`}></span>
                        {booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded transition-all">
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-amber-500 hover:bg-amber-500/10 rounded transition-all">
                          <span className="material-symbols-outlined text-lg">cancel</span>
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded transition-all">
                          <span className="material-symbols-outlined text-lg">payments</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 bg-primary/5 border-t border-primary/10 flex items-center justify-between">
        <p className="text-xs text-gray-500">
          Showing <span className="font-medium text-gray-300">{(page - 1) * 10 + 1}-{Math.min(page * 10, total)}</span> of{' '}
          <span className="font-medium text-gray-300">{total}</span> bookings
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="p-1 text-gray-500 hover:text-primary transition-all disabled:opacity-30"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={`w-8 h-8 rounded text-xs flex items-center justify-center transition-all ${
                page === pageNum
                  ? 'bg-primary text-black font-bold'
                  : 'hover:bg-primary/10 text-gray-400 hover:text-primary'
              }`}
            >
              {pageNum}
            </button>
          ))}
          {totalPages > 5 && (
            <>
              <span className="text-gray-600 text-xs px-1">...</span>
              <button
                onClick={() => setPage(totalPages)}
                className="w-8 h-8 rounded hover:bg-primary/10 text-gray-400 hover:text-primary text-xs flex items-center justify-center transition-all"
              >
                {totalPages}
              </button>
            </>
          )}
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="p-1 text-gray-500 hover:text-primary transition-all disabled:opacity-30"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}
