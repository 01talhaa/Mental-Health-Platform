import Header from './Header';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import Testimonials from './Testimonials';
import HowItWorks from './HowItWorks';
import Footer from './Footer';

export default function Home() {
  return (
    <div>
      <Header />
      <HeroSection />
      <FeaturesSection />
      <Testimonials />
      <HowItWorks />
      <Footer />
    </div>
  );
}
