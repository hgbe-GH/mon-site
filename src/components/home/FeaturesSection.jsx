import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Trophy, Users, Baby as Kid } from 'lucide-react';

const features = [
  { icon: Shield, title: "Sécurité maximale", desc: "Équipements certifiés et briefing complet" },
  { icon: Trophy, title: "Expérience unique", desc: "Scénarios variés et terrains authentiques" },
  { icon: Users, title: "Groupes & événements", desc: "Parfait pour team building et anniversaires" },
  { icon: Kid, title: "Enfants bienvenus", desc: "Gotcha dès 8 ans, matériel adapté et sécurisé" }
];

const FeaturesSection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-effect rounded-xl p-6 text-center hover:scale-105 transition-transform"
            >
              <feature.icon className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;