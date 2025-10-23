import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone, Mail, Briefcase } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import { Toaster } from '@/components/ui/toaster';

const newLogoUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/d920d526-dc48-47a4-aa51-9f37007af78b/4e66082661f8aeef2e96d545bee304c1.png";

export default function Layout({ children }) {
  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  const navLinkClasses =
    'text-white hover:text-orange-400 transition-colors px-3 py-2 rounded-md';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="hero-pattern min-h-screen">
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-effect border-b border-white/10 sticky top-0 z-50"
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src={newLogoUrl}
                  alt="Logo Paintball Méditerranée"
                  width={192}
                  height={64}
                  className="h-12 w-auto"
                  priority
                />
                <div>
                  <h1 className="text-sm font-bold text-gradient hidden sm:block">Paintball Méditerranée</h1>
                  <p className="text-xs text-gray-300 hidden sm:block">Montpellier</p>
                </div>
              </Link>
              <nav className="flex flex-wrap items-center gap-2 md:space-x-4 text-sm">
                <Link href="/" className={navLinkClasses}>Accueil</Link>
                <Link href="/#terrain" className={navLinkClasses}>Le Terrain</Link>
                <Link href="/#forfaits" className={navLinkClasses}>Forfaits</Link>
                <Link href="/#reservation" className={navLinkClasses}>Réservation</Link>
                <Link href="/espace-pro" className={navLinkClasses}>
                  <Briefcase className="w-5 h-5 inline-block md:hidden" />
                  <span className="hidden md:inline">Espace Pro</span>
                </Link>
                <Link href="/#contact" className={navLinkClasses}>Contact</Link>
              </nav>
            </div>
          </div>
        </motion.header>

        {children}

        <Footer />
      </div>
      <Toaster />
    </div>
  );
}

function Footer() {
  return (
    <footer className="glass-effect border-t border-white/10 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center space-x-3 mb-4">
              <Image
                src={newLogoUrl}
                alt="Logo Paintball Méditerranée Footer"
                width={160}
                height={60}
                className="h-10 w-auto"
              />
              <span className="text-xl font-bold text-gradient">Paintball Méditerranée</span>
            </Link>
            <p className="text-gray-300">
              L'expérience paintball ultime dans un cadre méditerranéen exceptionnel. Ouvert aux enfants dès 8 ans avec équipement Gotcha adapté.
            </p>
          </div>
          <div>
            <p className="text-lg font-semibold text-white mb-4">Liens rapides</p>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-orange-400 transition-colors">Accueil</Link></li>
              <li><Link href="/#terrain" className="text-gray-300 hover:text-orange-400 transition-colors">Le Terrain</Link></li>
              <li><Link href="/#forfaits" className="text-gray-300 hover:text-orange-400 transition-colors">Forfaits</Link></li>
              <li><Link href="/#reservation" className="text-gray-300 hover:text-orange-400 transition-colors">Réservation</Link></li>
              <li><Link href="/espace-pro" className="text-gray-300 hover:text-orange-400 transition-colors">Espace Pro</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-lg font-semibold text-white mb-4">Contact &amp; Horaires</p>
            <div className="space-y-2 text-gray-300">
              <p className="flex items-center"><Phone className="w-4 h-4 mr-2 text-orange-400" /> 06 23 73 50 02</p>
              <p className="flex items-center"><Mail className="w-4 h-4 mr-2 text-orange-400" /> contact@paintball-mediterranee.fr</p>
              <p>Tous les jours sur réservation</p>
              <p>Fermé mardi et jeudi matin</p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} Paintball Méditerranée Montpellier. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
