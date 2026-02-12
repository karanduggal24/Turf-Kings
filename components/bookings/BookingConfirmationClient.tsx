'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface BookingDetails {
  id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  turf: {
    name: string;
    location: string;
    city: string;
    state: string;
    phone: string;
  };
  user: {
    full_name: string;
    email: string;
    phone: string;
  };
}

interface BookingConfirmationClientProps {
  bookingId: string;
}

export default function BookingConfirmationClient({ bookingId }: BookingConfirmationClientProps) {
  const router = useRouter();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  async function fetchBookingDetails() {
    try {
      setLoading(true);
      const response = await fetch(`/api/bookings/${bookingId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch booking details');
      }

      const data = await response.json();
      setBooking(data.booking);
    } catch (err: any) {
      setError(err.message || 'Failed to load booking');
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const generateQRCode = () => {
    // Generate QR code URL with booking ID
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${bookingId}`;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <span className="animate-spin text-4xl">⚡</span>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !booking) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-8 text-center max-w-md">
            <span className="material-symbols-outlined text-6xl text-red-500 mb-4">error</span>
            <p className="text-red-500 text-lg font-bold mb-4">{error || 'Booking not found'}</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-primary text-black font-bold rounded-lg hover:brightness-110 transition-all"
            >
              Back to Home
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const serviceTax = booking.total_amount * 0.05;
  const bookingFee = 50;
  const basePrice = booking.total_amount - serviceTax - bookingFee;

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-black py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <header className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 text-primary mb-6 shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-5xl">check_circle</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-2 text-white">Game On!</h1>
            <p className="text-gray-400 text-lg">Your booking at {booking.turf.name} is confirmed.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Booking Summary */}
              <section className="bg-white/5 border border-primary/10 rounded-xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <span className="material-symbols-outlined text-8xl transform rotate-12">sports_soccer</span>
                </div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-primary mb-6">Booking Summary</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Booking ID</p>
                    <p className="font-bold text-lg text-white">#{booking.id.slice(0, 8)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Date</p>
                    <p className="font-bold text-lg text-white">{formatDate(booking.booking_date)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Time Slot</p>
                    <p className="font-bold text-lg text-primary">
                      {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Status</p>
                    <p className="font-bold text-lg text-primary capitalize">{booking.status}</p>
                  </div>
                </div>
              </section>

              {/* Venue & User Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Venue */}
                <section className="bg-white/5 border border-primary/10 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-primary">stadium</span>
                    <h3 className="font-bold text-lg text-white">Venue Details</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-400 text-sm">Turf Name</p>
                      <p className="font-medium text-white">{booking.turf.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Address</p>
                      <p className="font-medium text-sm text-white">
                        {booking.turf.location}, {booking.turf.city}, {booking.turf.state}
                      </p>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          `${booking.turf.location}, ${booking.turf.city}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-primary text-sm font-semibold mt-2 hover:underline"
                      >
                        <span className="material-symbols-outlined text-sm mr-1">near_me</span>
                        Get Directions
                      </a>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Contact</p>
                      <p className="font-medium text-white">{booking.turf.phone}</p>
                    </div>
                  </div>
                </section>

                {/* User Details */}
                <section className="bg-white/5 border border-primary/10 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-primary">person</span>
                    <h3 className="font-bold text-lg text-white">User Details</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-400 text-sm">Customer Name</p>
                      <p className="font-medium text-white">{booking.user.full_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Email</p>
                      <p className="font-medium text-white">{booking.user.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Phone</p>
                      <p className="font-medium text-white">{booking.user.phone || 'Not provided'}</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* QR Code */}
              <section className="bg-primary/5 border-2 border-primary/20 rounded-xl p-6 text-center">
                <p className="text-sm font-bold text-white mb-4">YOUR ENTRY PASS</p>
                <div className="bg-white p-4 rounded-lg inline-block mb-4">
                  <img
                    src={generateQRCode()}
                    alt="QR Code"
                    className="w-40 h-40"
                  />
                </div>
                <p className="text-xs text-gray-400 px-4">
                  Scan this QR code at the entrance for hassle-free check-in.
                </p>
              </section>

              {/* Payment Breakdown */}
              <section className="bg-white/5 border border-primary/10 rounded-xl p-6">
                <h3 className="font-bold mb-4 text-white">Payment Breakdown</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Base Price</span>
                    <span className="text-white">₹{basePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Service Tax (5%)</span>
                    <span className="text-white">₹{serviceTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Booking Fee</span>
                    <span className="text-white">₹{bookingFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-primary/10 pt-3 flex justify-between items-center">
                    <span className="font-bold text-white">Total Paid</span>
                    <span className="text-2xl font-black text-primary">₹{booking.total_amount.toFixed(2)}</span>
                  </div>
                </div>
                <div className="bg-primary/10 rounded p-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">verified</span>
                  <span className="text-[10px] font-bold uppercase tracking-tight text-primary">
                    Payment Successful
                  </span>
                </div>
              </section>
            </div>
          </div>

          {/* Action Footer */}
          <footer className="mt-12 flex flex-col md:flex-row items-center justify-center gap-4">
            <button
              onClick={() => window.print()}
              className="w-full md:w-auto px-8 py-3 bg-primary text-black font-bold rounded-lg hover:brightness-110 transition flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">download</span>
              Download PDF
            </button>
            <button
              onClick={() => router.push('/profile')}
              className="w-full md:w-auto px-8 py-3 bg-white/5 border border-primary/20 font-bold rounded-lg hover:bg-white/10 transition flex items-center justify-center gap-2 text-white"
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

          {/* Helpful Note */}
          <div className="mt-12 text-center">
            <p className="text-xs text-gray-500 max-w-2xl mx-auto">
              Please arrive at least 15 minutes before your scheduled slot. Proper sports attire and footwear are required. 
              Cancellations must be made 24 hours in advance to be eligible for a refund.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
