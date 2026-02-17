import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VenueDetailClient from '@/components/venue/VenueDetailClient';
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
  
  // Fetch venue with turfs and reviews
  const { data: venue, error } = await supabase
    .from('venues')
    .select(`
      *,
      owner:users!venues_owner_id_fkey(full_name, email, phone),
      turfs:turfs_new(id, name, sport_type, price_per_hour, is_active),
      reviews:reviews_new(id, rating, comment, created_at, user:users(full_name))
    `)
    .eq('id', id)
    .eq('is_active', true)
    .eq('approval_status', 'approved')
    .single();

  if (error || !venue) {
    notFound();
  }

  // Calculate average rating
  const reviews = venue.reviews || [];
  const avgRating = reviews.length > 0 
    ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length 
    : 0;

  const venueData = {
    ...venue,
    rating: Number(avgRating.toFixed(1)),
    total_reviews: reviews.length,
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      <VenueDetailClient venue={venueData} />
      <Footer />
    </div>
  );
}
