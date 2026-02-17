import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TurfsPageClient from '@/components/turfs/TurfsPageClient';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export default async function TurfsPage() {
  const supabase = await createServerSupabaseClient();
  
  // Fetch venues with their turfs and reviews
  const { data: venues, error } = await supabase
    .from('venues')
    .select(`
      *,
      owner:users!venues_owner_id_fkey(full_name, email),
      turfs:turfs_new(id, name, sport_type, price_per_hour, is_active),
      reviews:reviews_new(rating)
    `)
    .eq('is_active', true)
    .eq('approval_status', 'approved');

  // Transform venues to include computed fields
  const transformedVenues = (venues || []).map(venue => {
    const venueTurfs = venue.turfs || [];
    const activeTurfs = venueTurfs.filter((t: any) => t.is_active);
    
    const availableSports = [...new Set(activeTurfs.map((t: any) => t.sport_type))];
    const prices = activeTurfs.map((t: any) => t.price_per_hour);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

    // Calculate average rating from reviews
    const reviews = venue.reviews || [];
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length 
      : 0;

    return {
      id: venue.id,
      name: venue.name,
      description: venue.description,
      location: venue.location,
      city: venue.city,
      state: venue.state,
      phone: venue.phone,
      amenities: venue.amenities,
      images: venue.images,
      rating: Number(avgRating.toFixed(1)),
      total_reviews: reviews.length,
      is_active: venue.is_active,
      approval_status: venue.approval_status,
      owner: venue.owner,
      created_at: venue.created_at,
      total_turfs: activeTurfs.length,
      available_sports: availableSports,
      price_per_hour: minPrice,
      min_price: minPrice,
      max_price: maxPrice,
      sport_type: availableSports[0] || 'multi',
      turfs: activeTurfs,
    };
  }).sort((a, b) => b.rating - a.rating); // Sort by rating after transformation

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      <TurfsPageClient initialTurfs={transformedVenues as any} initialError={error?.message || null} />
      <Footer />
    </div>
  );
}
