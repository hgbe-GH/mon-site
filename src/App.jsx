import React from 'react';
import { Routes, Route, Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import HomePage from '@/pages/HomePage';
import ProQuotePage from '@/pages/ProQuotePage';
import { Phone, Mail, Briefcase } from 'lucide-react';

const newLogoUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/d920d526-dc48-47a4-aa51-9f37007af78b/4e66082661f8aeef2e96d545bee304c1.png";

function App() {
  const navLinkClasses = ({ isActive }) => 
    `text-white hover:text-orange-400 transition-colors px-3 py-2 rounded-md ${isActive ? 'bg-white/10 text-orange-400' : ''}`;

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
              <Link to="/" className="flex items-center space-x-2">
                <img src={newLogoUrl} alt="Logo Paintball Méditerranée" className="h-12 w-auto" />
                <div>
                  <h1 className="text-sm font-bold text-gradient hidden sm:block">Paintball Méditerranée</h1>
                  <p className="text-xs text-gray-300 hidden sm:block">Montpellier</p>
                </div>
              </Link>
              <nav className="flex items-center space-x-1 md:space-x-4">
                <NavLink to="/" className={navLinkClasses}>Accueil</NavLink>
                <NavLink to="/#terrain" className={navLinkClasses} onClick={() => setTimeout(() => document.getElementById('terrain')?.scrollIntoView({ behavior: 'smooth' }),0)}>Le Terrain</NavLink>
                <NavLink to="/#forfaits" className={navLinkClasses} onClick={() => setTimeout(() => document.getElementById('forfaits')?.scrollIntoView({ behavior: 'smooth' }),0)}>Forfaits</NavLink>
                <NavLink to="/#reservation" className={navLinkClasses} onClick={() => setTimeout(() => document.getElementById('reservation')?.scrollIntoView({ behavior: 'smooth' }),0)}>Réservation</NavLink>
                <NavLink to="/espace-pro" className={navLinkClasses}>
                  <Briefcase className="w-5 h-5 inline-block md:hidden" />
                  <span className="hidden md:inline">Espace Pro</span>
                </NavLink>
                <NavLink to="/#contact" className={navLinkClasses} onClick={() => setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }),0)}>Contact</NavLink>
              </nav>
            </div>
          </div>
        </motion.header>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/espace-pro" element={<ProQuotePage />} />
        </Routes>

        <Footer />
      </div>
      <Toaster />
    </div>
  );
}

const Footer = () => (
  <footer className="glass-effect border-t border-white/10 py-12">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-3 gap-8">
        <div>
          <Link to="/" className="flex items-center space-x-3 mb-4">
            <img src={newLogoUrl} alt="Logo Paintball Méditerranée Footer" className="h-10 w-auto" />
            <span className="text-xl font-bold text-gradient">Paintball Méditerranée</span>
          </Link>
          <p className="text-gray-300">
            L'expérience paintball ultime dans un cadre méditerranéen exceptionnel. Ouvert aux enfants dès 8 ans avec équipement Gotcha adapté.
          </p>
        </div>
        <div>
          <p className="text-lg font-semibold text-white mb-4">Liens rapides</p>
          <ul className="space-y-2">
            <li><Link to="/" className="text-gray-300 hover:text-orange-400 transition-colors">Accueil</Link></li>
            <li><Link to="/#terrain" onClick={() => document.getElementById('terrain')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-300 hover:text-orange-400 transition-colors">Le Terrain</Link></li>
            <li><Link to="/#forfaits" onClick={() => document.getElementById('forfaits')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-300 hover:text-orange-400 transition-colors">Forfaits</Link></li>
            <li><Link to="/#reservation" onClick={() => document.getElementById('reservation')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-300 hover:text-orange-400 transition-colors">Réservation</Link></li>
            <li><Link to="/espace-pro" className="text-gray-300 hover:text-orange-400 transition-colors">Espace Pro</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-lg font-semibold text-white mb-4">Contact & Horaires</p>
          <div className="space-y-2 text-gray-300">
            <p className="flex items-center"><Phone className="w-4 h-4 mr-2 text-orange-400" /> 04 67 XX XX XX</p>
            <p className="flex items-center"><Mail className="w-4 h-4 mr-2 text-orange-400" /> contact@paintball-mediterranee.fr</p>
            <p>Lundi - Vendredi: 9h - 18h</p>
            <p>Samedi - Dimanche: 8h - 19h</p>
            <p className="text-orange-400">Réservation obligatoire</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 mt-8 pt-8 text-center">
        <p className="text-gray-400">© {new Date().getFullYear()} Paintball Méditerranée Montpellier. Tous droits réservés.</p>
      </div>
    </div>
  </footer>
);

export default App;