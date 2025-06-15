import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Baby as Kid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import packagesData from '@/data/packages';

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
          <h2 className="text-4xl lg:text-5xl font-bold text-gradient mb-6">Nos forfaits</h2>
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
                  <Kid className="w-4 h-4 inline mr-1" /> Enfants 6-10
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

export default PackagesSection;