import React, { useState } from 'react';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import TerrainSection from '@/components/home/TerrainSection';
import PackagesSection, { packagesData } from '@/components/home/PackagesSection';
import ReservationSection from '@/components/home/ReservationSection';
import ContactSection from '@/components/home/ContactSection';

const HomePage = () => {
  const [selectedPackage, setSelectedPackage] = useState(() => packagesData[0]?.id ?? null);

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <TerrainSection />
      <PackagesSection selectedPackage={selectedPackage} onSelectPackage={setSelectedPackage} />
      <ReservationSection selectedPackage={selectedPackage} onSelectPackage={setSelectedPackage} />
      <ContactSection />
    </>
  );
};

export default HomePage;