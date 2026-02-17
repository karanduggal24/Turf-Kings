'use client';

interface BookingUser {
  full_name: string;
  email: string;
  phone: string;
}

interface BookingTurf {
  name: string;
  location: string;
  sport_type: string;
}

interface BookingRowData {
  id: string;
  user?: BookingUser;
  turf?: BookingTurf;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: string;
  payment_status: string;
}

interface BookingTableRowProps {
  booking: BookingRowData;
  onViewBooking: (id: string) => void;
  onCancelBooking: (id: string) => void;
  onUpdatePayment: (id: string, currentStatus: string) => void;
}

const SPORT_COLORS: Record<string, string> = {
  cricket: 'bg-primary',
  football: 'bg-blue-500',
  badminton: 'bg-purple-500',
  multi: 'bg-orange-500',
};

const PAYMENT_STATUS_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  pending: { bg: 'bg-amber-500/20', text: 'text-amber-500', border: 'border-amber-500/30' },
  paid: { bg: 'bg-primary/20', text: 'text-primary', border: 'border-primary/30' },
  failed: { bg: 'bg-red-500/20', text: 'text-red-500', border: 'border-red-500/30' },
  refunded: { bg: 'bg-red-500/20', text: 'text-red-500', border: 'border-red-500/30' },
};

export default function BookingTableRow({
  booking,
  onViewBooking,
  onCancelBooking,
  onUpdatePayment,
}: BookingTableRowProps) {
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

  const statusStyle = PAYMENT_STATUS_STYLES[booking.payment_status] || PAYMENT_STATUS_STYLES.pending;
  const sportColor = SPORT_COLORS[booking.turf?.sport_type || ''] || 'bg-gray-500';

  return (
    <tr className="hover:bg-primary/5 transition-colors group">
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
          <button 
            onClick={() => onViewBooking(booking.id)}
            className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded transition-all"
            title="View Booking"
          >
            <span className="material-symbols-outlined text-lg">visibility</span>
          </button>
          <button 
            onClick={() => onCancelBooking(booking.id)}
            disabled={booking.status === 'cancelled'}
            className="p-1.5 text-gray-400 hover:text-amber-500 hover:bg-amber-500/10 rounded transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            title="Cancel Booking"
          >
            <span className="material-symbols-outlined text-lg">cancel</span>
          </button>
          <button 
            onClick={() => onUpdatePayment(booking.id, booking.payment_status)}
            className="p-1.5 text-gray-400 hover:text-green-500 hover:bg-green-500/10 rounded transition-all"
            title={booking.payment_status === 'paid' ? 'Mark as Pending' : 'Mark as Paid'}
          >
            <span className="material-symbols-outlined text-lg">payments</span>
          </button>
        </div>
      </td>
    </tr>
  );
}
