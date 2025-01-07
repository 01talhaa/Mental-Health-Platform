// components/Homepage/Home.js

'use client';

import React from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import Testimonials from './Testimonials';
import HowItWorks from './HowItWorks';
import Footer from './Footer';
import Chatbot from '../ChatbotPage/Chatbot';
import { useSession } from '@/app/lib/session-provider';

export default function Home() {
  const session = useSession();

  return (
    <div>
      <Header />
      {/* <Chat/> */}
      <HeroSection />
      <Chatbot/>
      <FeaturesSection />
      <Testimonials />
      <HowItWorks />
      <Footer />
      
      {session && (
        <div className="mt-4">
          <h2>User Information:</h2>
          <p>Email: {session.user.email}</p>
          {session.user.name && <p>Name: {session.user.name}</p>}
        </div>
      )}
    </div>
  );
}