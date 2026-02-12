import EditVenueClient from '@/components/admin/EditVenueClient';

export default async function EditVenuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditVenueClient turfId={id} />;
}
