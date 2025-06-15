import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Baby as Kid } from 'lucide-react';
import { Button } from '@/components/ui/button';

const packagesData = [
  {
    id: 'decouverte',
    name: 'Découverte',
    price: 20,
    duration: '40–60 min',
    players: '120 billes',
    description: '',
    features: ['Équipement complet', 'Briefing sécurité', 'Missions rapides']
  },
  {
    id: 'mediterranee',
    name: 'Méditerranée',
    price: 25,
    duration: '60–90 min',
    players: '200 billes',
    description: '',
    features: ['Équipement standard', 'Scénarios variés', 'Collation offerte']
  },
  {
    id: 'player',
    name: 'Player',
    price: 30,
    duration: '90–120 min',
    players: '300 billes',
    description: '',
    features: ['Équipement premium', '1 recharge offerte', 'Missions variées']
  },
  {
    id: 'punisher',
    name: 'Punisher',
    price: 35,
    duration: '90–120 min',
    players: '400 billes',
    description: '',
    features: ['Équipement pro', 'Missions spéciales', 'Collation incluse']
  },
  {
    id: 'expendable',
    name: 'Expendable',
    price: 45,
    duration: 'jusqu\u2019\u00e0 3h',
    players: '600 billes',
    description: '',
    features: ['Équipement pro complet', 'Repas inclus', 'Missions illimitées']
  },
  {
    id: 'gotcha',
    name: 'Gotcha Enfants – \u00e0 partir de 8 ans (8–12 ans)',
    price: 20,
    duration: '60 min',
    players: '200 billes lavables',
    description: '',
    features: ['Lanceurs \u00e0 ressort', 'Équipement complet', 'Animateur inclus']
  }
];

const PackagesSection = ({ selectedPackage, onSelectPackage }) => {
  return (
    <section id="forfaits" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gradient mb-6">Nos forfaits</h2>
          <p className="text-xl text-gray-300">Choisissez l'expérience qui vous correspond, pour adultes et enfants.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {packagesData.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`glass-effect rounded-xl p-8 relative overflow-hidden hover:scale-105 transition-transform cursor-pointer ${
                selectedPackage === pkg.id ? 'ring-2 ring-orange-400' : ''
              }`}
              onClick={() => onSelectPackage(pkg.id)}
            >
              {pkg.id === 'player' && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Populaire
                </div>
              )}
               {pkg.id === 'gotcha' && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  <Kid className="w-4 h-4 inline mr-1" /> Enfants 8-12
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                <p className="text-gray-300 mb-4 h-12">{pkg.description}</p>
                <div className="text-4xl font-bold text-gradient mb-2">{pkg.price}€</div>
                <div className="flex flex-col sm:flex-row justify-center space-y-1 sm:space-y-0 sm:space-x-4 text-sm text-gray-300">
                  <span className="flex items-center justify-center"><Clock className="w-4 h-4 mr-1" />{pkg.duration}</span>
                  <span className="flex items-center justify-center"><Users className="w-4 h-4 mr-1" />{pkg.players}</span>
                </div>
              </div>
              <ul className="space-y-3 min-h-[100px]">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-3 shrink-0"></div>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                aria-label={`Choisir le forfait ${pkg.name}`}
                className="w-full mt-6 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPackage(pkg.id);
                  document.getElementById('reservation')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Choisir ce forfait
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { packagesData };
export default PackagesSection;