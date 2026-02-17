import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingCreateClient from '@/components/bookings/BookingCreateClient';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';

interface BookingCreatePageProps {
  params: Promise<{
    turfId: string;
  }>;
}

export default async function BookingCreatePage({ params }: BookingCreatePageProps) {
  const { turfId } = await params;
  const supabase = await createServerSupabaseClient();
  
  // Fetch turf details
  const { data: turf, error } = await supabase
    .from('turfs_new')
    .select(`
      *,
      venue:venues!inner(*)
    `)
    .eq('id', turfId)
    .eq('is_active', true)
    .single();

  if (error || !turf) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      <BookingCreateClient turf={turf} />
      <Footer />
    </div>
  );
}
