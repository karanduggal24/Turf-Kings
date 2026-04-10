import OwnerEditVenueClient from '@/components/owner/dashboard/OwnerEditVenueClient';

export default async function OwnerEditVenuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OwnerEditVenueClient venueId={id} />;
}
