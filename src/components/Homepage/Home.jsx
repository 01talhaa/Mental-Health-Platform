import Header from './Header';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import Testimonials from './Testimonials';
import HowItWorks from './HowItWorks';
import Footer from './Footer';
import Chatbot from '../ChatbotPage/Chatbot';

export default function Home() {
  return (
    <div>
      <Header />
      <HeroSection />
      <Chatbot/>
      <FeaturesSection />
      <Testimonials />
      <HowItWorks />
      <Footer />
    </div>
  );
}
