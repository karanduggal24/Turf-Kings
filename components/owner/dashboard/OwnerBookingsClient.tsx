'use client';

import { useEffect, useState } from 'react';
import { ownerApi } from '@/lib/api';
import ConfirmModal from '@/components/common/ConfirmModal';
import AlertModal from '@/components/common/AlertModal';

interface Booking {
  id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  total_amount: number;
  status: string;
  payment_status: string;
  user: { full_name: string; email: string; phone?: string };
  venue: { name: string; city: string };
  turf: { name: string; sport_type: string };
}

const statusColor: Record<string, string> = {
  confirmed: 'bg-primary/10 text-primary border-primary/20',
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function OwnerBookingsClient() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [alert, setAlert] = useState<{ open: boolean; message: string; type: 'success' | 'error' }>({
    open: false, message: '', type: 'success',
  });

  const fetchBookings = () => {
    setLoading(true);
    ownerApi.getBookings(page)
      .then((data: any) => {
        setBookings(data.bookings || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotal(data.pagination?.total || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, [page]);

  const handleCancelConfirm = async () => {
    if (!confirmId) return;
    setCancelling(true);
    try {
      await ownerApi.cancelBooking(confirmId);
      setBookings(prev => prev.map(b => b.id === confirmId ? { ...b, status: 'cancelled' } : b));
      setAlert({ open: true, message: 'Booking cancelled successfully.', type: 'success' });
    } catch (err: any) {
      setAlert({ open: true, message: err.message || 'Failed to cancel booking.', type: 'error' });
    } finally {
      setCancelling(false);
      setConfirmId(null);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const formatTime = (t: string) => {
    const [h, m] = t.split(':');
    const hour = parseInt(h);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  return (
    <div className="p-6 lg:p-10 space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">Bookings</h1>
        <p className="text-gray-400 mt-1">{total} total booking{total !== 1 ? 's' : ''} across your venues</p>
      </div>

      <div className="bg-white/5 border border-primary/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-primary/10 bg-primary/5">
                {['Customer', 'Venue / Turf', 'Date & Time', 'Amount', 'Status', ''].map((h, i) => (
                  <th key={i} className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-white/5 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center text-gray-400">
                    <span className="material-symbols-outlined text-5xl block mb-3 text-gray-600">event_busy</span>
                    No bookings yet
                  </td>
                </tr>
              ) : (
                bookings.map(b => (
                  <tr key={b.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-medium text-white text-sm">{b.user?.full_name || '—'}</p>
                      <p className="text-xs text-gray-400">{b.user?.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-white text-sm">{b.venue?.name}</p>
                      <p className="text-xs text-gray-400 capitalize">{b.turf?.name} · {b.turf?.sport_type}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-white">{formatDate(b.booking_date)}</p>
                      <p className="text-xs text-gray-400">{formatTime(b.start_time)} – {formatTime(b.end_time)}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-primary text-sm">₹{Number(b.total_amount).toLocaleString('en-IN')}</p>
                      <p className="text-xs text-gray-400 capitalize">{b.payment_status}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border capitalize ${statusColor[b.status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {b.status !== 'cancelled' && b.status !== 'completed' && (
                        <button
                          onClick={() => setConfirmId(b.id)}
                          className="text-xs font-medium text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-400/40 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-primary/10 flex items-center justify-between">
            <p className="text-sm text-gray-400">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border border-primary/20 text-sm text-gray-400 hover:text-primary hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                Previous
              </button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg border border-primary/20 text-sm text-gray-400 hover:text-primary hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={handleCancelConfirm}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Yes, Cancel"
        cancelText="Keep Booking"
        type="danger"
        loading={cancelling}
      />

      <AlertModal
        isOpen={alert.open}
        onClose={() => setAlert(a => ({ ...a, open: false }))}
        title={alert.type === 'success' ? 'Done' : 'Error'}
        message={alert.message}
        type={alert.type}
      />
    </div>
  );
}
