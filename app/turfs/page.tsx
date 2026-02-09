import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TurfsPageClient from '@/components/turfs/TurfsPageClient';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export default async function TurfsPage() {
  const supabase = await createServerSupabaseClient();
  
  const { data: turfs, error } = await supabase
    .from('turfs')
    .select('*')
    .eq('is_active', true)
    .order('rating', { ascending: false });

  console.log('Turfs data:', turfs);
  console.log('Turfs error:', error);
  console.log('Turfs count:', turfs?.length || 0);

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      <TurfsPageClient initialTurfs={turfs || []} initialError={error?.message || null} />
      <Footer />
    </div>
  );
}
