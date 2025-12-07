"use client";

import {
  Navigation,
  HeroSection,
  QRTypesSection,
  AnalyticsSection,
  PricingSection,
  BlogSection,
  Footer,
} from '@/components/landing';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      <Navigation />
      <HeroSection />
      <QRTypesSection />
      <AnalyticsSection />
      <PricingSection />
      <BlogSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
