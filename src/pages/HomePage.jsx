import React, { useState } from 'react';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import TerrainSection from '@/components/home/TerrainSection';
import PackagesSection from '@/components/home/PackagesSection';
import TarifsSection from '@/components/home/TarifsSection';
import ReservationSection from '@/components/home/ReservationSection';
import ContactSection from '@/components/home/ContactSection';

const HomePage = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <TerrainSection />
      <TarifsSection />
      <PackagesSection selectedPackage={selectedPackage} onSelectPackage={setSelectedPackage} />
      <ReservationSection selectedPackage={selectedPackage} onSelectPackage={setSelectedPackage} />
      <ContactSection />
    </>
  );
};

export default HomePage;