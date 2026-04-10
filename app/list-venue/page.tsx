import ListVenueClient from '@/components/venue/ListVenueClient';
import { listVenueMetadata } from '@/lib/metadata';

export const metadata = listVenueMetadata;

export default function ListVenuePage() {
  return <ListVenueClient />;
}
