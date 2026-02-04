import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturedSection from '../components/FeaturedSection';
import PromotionalBanner from '../components/PromotionalBanner';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturedSection />
        <PromotionalBanner />
      </main>
      <Footer />
    </div>
  );
}
