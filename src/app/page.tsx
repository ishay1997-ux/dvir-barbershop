import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnnouncementBanner from '@/components/common/AnnouncementBanner';
import HeroSection from '@/components/landing/HeroSection';
import ServicesSection from '@/components/landing/ServicesSection';
import BarberShowcase from '@/components/landing/BarberShowcase';
import BeforeAfterSection from '@/components/landing/BeforeAfterSection';
import GallerySection from '@/components/landing/GallerySection';
import ReviewsSection from '@/components/landing/ReviewsSection';
import FaqSection from '@/components/landing/FaqSection';
import ContactSection from '@/components/landing/ContactSection';

export default function HomePage() {
  return (
    <>
      <AnnouncementBanner />
      <Header />
      <main id="main-content">
        <HeroSection />
        <ServicesSection />
        <BarberShowcase />
        <BeforeAfterSection />
        <GallerySection />
        <ReviewsSection />
        <FaqSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
