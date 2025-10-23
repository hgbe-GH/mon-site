import React, { useState } from 'react';
import Link from 'next/link';
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
      <footer className="py-10 text-center text-xs text-slate-500">
        <p className="inline-flex items-center gap-2">
          <span className="uppercase tracking-widest text-slate-400">Équipe</span>
          <Link href="/admin" className="text-orange-300 hover:text-orange-200 underline underline-offset-4">
            Accéder à l'espace administrateur
          </Link>
        </p>
      </footer>
    </>
  );
};

export default HomePage;