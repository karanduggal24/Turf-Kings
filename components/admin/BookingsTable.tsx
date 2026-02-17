'use client';

import { useEffect, useState } from 'react';
import { Booking } from '@/app/constants/booking-types';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ConfirmModal from '@/components/common/ConfirmModal';
import AlertModal from '@/components/common/AlertModal';
import BookingTableRow from './bookings/BookingTableRow';
import BookingsPagination from './bookings/BookingsPagination';

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

export default function BookingsTable() {
  const [bookings, setBookings] = useState<BookingWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertTitle, setAlertTitle] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<{ id: string; status?: string } | null>(null);

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

  const handleViewBooking = (bookingId: string) => {
    window.open(`/bookings/${bookingId}`, '_blank');
  };

  const handleCancelBookingClick = (bookingId: string) => {
    setSelectedBooking({ id: bookingId });
    setShowCancelModal(true);
  };

  const handleCancelBookingConfirm = async () => {
    if (!selectedBooking) return;

    try {
      const response = await fetch(`/api/admin/bookings/${selectedBooking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (response.ok) {
        setAlertTitle('Success');
        setAlertMessage('Booking cancelled successfully');
        setShowAlertModal(true);
        fetchBookings();
      } else {
        setAlertTitle('Error');
        setAlertMessage('Failed to cancel booking');
        setShowAlertModal(true);
      }
    } catch (error) {
      setAlertTitle('Error');
      setAlertMessage('Failed to cancel booking');
      setShowAlertModal(true);
    } finally {
      setShowCancelModal(false);
      setSelectedBooking(null);
    }
  };

  const handleUpdatePaymentClick = (bookingId: string, currentStatus: string) => {
    setSelectedBooking({ id: bookingId, status: currentStatus });
    setShowPaymentModal(true);
  };

  const handleUpdatePaymentConfirm = async () => {
    if (!selectedBooking) return;

    const newStatus = selectedBooking.status === 'paid' ? 'pending' : 'paid';

    try {
      const response = await fetch(`/api/admin/bookings/${selectedBooking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_status: newStatus }),
      });

      if (response.ok) {
        setAlertTitle('Success');
        setAlertMessage('Payment status updated successfully');
        setShowAlertModal(true);
        fetchBookings();
      } else {
        setAlertTitle('Error');
        setAlertMessage('Failed to update payment status');
        setShowAlertModal(true);
      }
    } catch (error) {
      setAlertTitle('Error');
      setAlertMessage('Failed to update payment status');
      setShowAlertModal(true);
    } finally {
      setShowPaymentModal(false);
      setSelectedBooking(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-md border border-primary/10 rounded-xl p-12">
        <LoadingSpinner size="md" />
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
              bookings.map((booking) => (
                <BookingTableRow
                  key={booking.id}
                  booking={booking}
                  onViewBooking={handleViewBooking}
                  onCancelBooking={handleCancelBookingClick}
                  onUpdatePayment={handleUpdatePaymentClick}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <BookingsPagination
        page={page}
        totalPages={totalPages}
        total={total}
        itemsPerPage={10}
        onPageChange={setPage}
      />

      <ConfirmModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelBookingConfirm}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Cancel Booking"
        cancelText="Keep Booking"
      />

      <ConfirmModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onConfirm={handleUpdatePaymentConfirm}
        title="Update Payment Status"
        message={`Mark payment as ${selectedBooking?.status === 'paid' ? 'pending' : 'paid'}?`}
        confirmText="Update Status"
        cancelText="Cancel"
      />

      <AlertModal
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        title={alertTitle}
        message={alertMessage}
      />
    </div>
  );
}
