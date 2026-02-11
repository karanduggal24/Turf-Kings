'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OwnerHero from '@/components/owner/OwnerHero';
import HowItWorks from '@/components/owner/HowItWorks';
import OwnerFeatures from '@/components/owner/OwnerFeatures';
import RevenueCalculator from '@/components/owner/RevenueCalculator';
import OwnerTestimonials from '@/components/owner/OwnerTestimonials';
import OwnerCTA from '@/components/owner/OwnerCTA';

export default function BecomeOwnerClient() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      
      <OwnerHero />
      <HowItWorks />
      <OwnerFeatures />
      <RevenueCalculator />
      <OwnerTestimonials />
      <OwnerCTA />

      <Footer />
    </div>
  );
}
