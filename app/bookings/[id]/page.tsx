import BookingConfirmationClient from '@/components/bookings/BookingConfirmationClient';

export default async function BookingConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BookingConfirmationClient bookingId={id} />;
}
