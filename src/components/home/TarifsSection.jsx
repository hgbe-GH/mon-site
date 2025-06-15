import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const tarifs = [
  { name: 'Découverte', billes: '120 billes', duree: '40–60 min', prix: 20 },
  { name: 'Méditerranée', billes: '200 billes', duree: '60–90 min', prix: 25 },
  { name: 'Player', billes: '300 billes', duree: '90–120 min', prix: 30 },
  { name: 'Punisher', billes: '400 billes', duree: '90–120 min', prix: 35 },
  { name: 'Expendable', billes: '600 billes', duree: 'jusqu\u2019\u00e0 3h', prix: 45 },
  { name: 'Enfant Gotcha', billes: 'billes lavables', duree: '6–10 ans', prix: 20 },
];

const TarifsSection = () => (
  <section id="tarifs" className="py-16 sm:py-20">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl lg:text-5xl font-bold text-gradient mb-6">
          Nos formules
        </h2>
        <p className="text-sm sm:text-xl text-gray-300">
          Choisissez la formule qui vous convient
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
        {tarifs.map((t, index) => (
          <motion.div
            key={t.name}
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="glass-effect rounded-xl p-4 sm:p-6 flex flex-col items-center text-center hover:scale-105 transition-transform"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{t.name}</h3>
            <p className="text-gray-300 mb-4">
              {t.billes} – {t.duree}
            </p>
            <div className="text-4xl font-bold text-gradient mb-6">
              {t.prix}€
            </div>
            <Button
              aria-label={`Réserver la formule ${t.name}`}
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
              onClick={() =>
                document
                  .getElementById('reservation')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Réserver maintenant
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TarifsSection;
