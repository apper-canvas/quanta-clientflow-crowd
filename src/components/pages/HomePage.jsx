import React from 'react';
import HeroSection from '@/components/organisms/HeroSection';
import FeatureSection from '@/components/organisms/FeatureSection';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background dark:bg-surface-900">
      <div className="container mx-auto px-4 py-8">
        <HeroSection />
        <FeatureSection />
      </div>
    </div>
  );
};

export default HomePage;