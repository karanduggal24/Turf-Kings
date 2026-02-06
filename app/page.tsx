import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturedSection from '../components/FeaturedSection';
import PromotionalBanner from '../components/PromotionalBanner';
import Footer from '../components/Footer';
import { createServerSupabaseClient } from '@/lib/supabase';

// Server Component - fetches data on server
export default async function Home() {
  // Fetch initial turfs on server for fast load + SEO
  const supabase = createServerSupabaseClient();
  
  const { data: initialTurfs, error } = await supabase
    .from('turfs')
    .select('*')
    .eq('is_active', true)
    .order('rating', { ascending: false })
    .limit(8);

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      <main className="grow">
        <HeroSection />
        <FeaturedSection 
          initialTurfs={initialTurfs || []} 
          initialError={error?.message || null}
        />
        <PromotionalBanner />
      </main>
      <Footer />
    </div>
  );
}
