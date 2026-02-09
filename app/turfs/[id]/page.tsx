import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TurfDetailClient from '@/components/turfs/TurfDetailClient';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';

interface TurfDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TurfDetailPage({ params }: TurfDetailPageProps) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  
  console.log('Fetching turf with ID:', id);
  
  const { data: turf, error } = await supabase
    .from('turfs')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  console.log('Turf data:', turf);
  console.log('Turf error:', error);

  if (error || !turf) {
    console.log('Turf not found, showing 404');
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      <TurfDetailClient turf={turf} />
      <Footer />
    </div>
  );
}
