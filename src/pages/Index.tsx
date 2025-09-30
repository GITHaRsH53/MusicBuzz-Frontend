import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import FloatingIcons from '@/components/FloatingIcons';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Floating Background Icons */}
      <FloatingIcons />
      
      {/* Main Content */}
      <div className="relative z-10">
        <Header />
        <main>
          <HeroSection />
          <FeaturesSection />
        </main>
        <Footer />
      </div>
      
      {/* Background Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background/90 to-background pointer-events-none z-0" />
    </div>
  );
};

export default Index;