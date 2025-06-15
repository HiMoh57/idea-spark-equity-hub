
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Stats from '@/components/Stats';
import Footer from '@/components/Footer';
import EmailSignup from '@/components/EmailSignup';
import DelayedSignupBanner from '@/components/DelayedSignupBanner';
import MobileCTAPopup from '@/components/MobileCTAPopup';
import DesktopExitIntentModal from '@/components/DesktopExitIntentModal';
import FeaturedIdeasTease from '@/components/FeaturedIdeasTease';
import LiveStatsBanner from '@/components/LiveStatsBanner';
import WelcomeModal from '@/components/WelcomeModal';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <LiveStatsBanner />
      <Navbar />
      <Hero />
      
      {/* Email signup section - above the fold */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <EmailSignup />
        </div>
      </section>

      <Features />
      <FeaturedIdeasTease />
      <Stats />
      <Footer />
      
      {/* Conversion components */}
      <DelayedSignupBanner />
      <MobileCTAPopup />
      <DesktopExitIntentModal />
      <WelcomeModal />
    </div>
  );
};

export default Index;
