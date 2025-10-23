import React from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const heroImageUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/d920d526-dc48-47a4-aa51-9f37007af78b/59edf7f8765c946070a3a950a4768cf4.png";

const HeroSection = () => {
  return (
    <section id="accueil" className="relative py-16 sm:py-20 overflow-hidden" data-aos="fade-up">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold mb-6 text-white">
              Paintball Méditerranée – le meilleur terrain de Montpellier
            </h1>
            <p className="text-sm sm:text-xl text-gray-300 mb-8 leading-relaxed">
              Nous vous accueillons dans un cadre boisé en lisière de rivière avec zones ombragées, buvette, pétanque, fléchettes et molky pour prolonger la journée. Sessions à partir de 8 joueurs, paintball ou gellyball dès 8 ans avec billes calibre .50 adaptées aux familles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                aria-label="Voir les formules"
                className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold px-8 py-3"
                onClick={() => document.getElementById('forfaits')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Voir les formules
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <div className="float-animation">
              <img
                alt="Joueur de paintball en armure de lapin futuriste"
                className="rounded-2xl shadow-2xl w-full aspect-video object-cover"
                src={heroImageUrl} />
            </div>
            <div className="absolute -bottom-6 -left-6 glass-effect rounded-xl p-4">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-white font-semibold">4.9/5</span>
                <span className="text-gray-300">• 250+ avis</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;