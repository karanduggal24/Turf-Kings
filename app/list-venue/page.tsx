import { Metadata } from 'next';
import ListVenueClient from '@/components/venue/ListVenueClient';

export const metadata: Metadata = {
  title: 'List Your Venue | TurfKings',
  description: 'Register your turf venue and start accepting bookings',
};

export default function ListVenuePage() {
  return <ListVenueClient />;
}
