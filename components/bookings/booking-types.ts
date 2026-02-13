// Booking Interfaces
export interface BookingDetails {
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

export interface BookingConfirmationClientProps {
  bookingId: string;
}

export interface BookingHeaderProps {
  turfName: string;
}

export interface BookingSummarySectionProps {
  bookingId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: string;
  formatDate: (date: string) => string;
  formatTime: (time: string) => string;
}

export interface VenueDetailsSectionProps {
  turfName: string;
  location: string;
  city: string;
  state: string;
  phone: string;
}

export interface UserDetailsSectionProps {
  fullName: string;
  email: string;
  phone: string | null;
}

export interface QRCodeSectionProps {
  bookingId: string;
}

export interface PaymentBreakdownSectionProps {
  totalAmount: number;
}

// Utility Functions
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const formatTime = (timeStr: string): string => {
  const [hours, minutes] = timeStr.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const generateQRCode = (bookingId: string): string => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${bookingId}`;
};

export const calculatePaymentBreakdown = (totalAmount: number) => {
  const serviceTax = totalAmount * 0.05;
  const bookingFee = 50;
  const basePrice = totalAmount - serviceTax - bookingFee;
  
  return {
    basePrice,
    serviceTax,
    bookingFee,
    totalAmount,
  };
};
