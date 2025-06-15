import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin } from 'lucide-react';

const contactImageUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/d920d526-dc48-47a4-aa51-9f37007af78b/d344e398c32b963e912d5b820f54a380.png";

const ContactSection = () => {
  return (
  <section id="contact" className="py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gradient mb-6">Contactez-nous</h2>
          <p className="text-sm sm:text-xl text-gray-300">Une question ? Nous sommes là pour vous aider !</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="glass-effect rounded-xl p-4 sm:p-6">
              <Phone className="w-8 h-8 text-orange-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Téléphone</h3>
              <p className="text-gray-300">06 23 73 50 02</p>
              <p className="text-sm text-gray-400">Ouvert tous les jours sur réservation</p>
              <p className="text-sm text-gray-400">Fermé mardi et jeudi matin</p>
            </div>
            <div className="glass-effect rounded-xl p-4 sm:p-6">
              <Mail className="w-8 h-8 text-orange-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Email</h3>
              <p className="text-gray-300">contact@paintball-mediterranee.fr</p>
              <p className="text-sm text-gray-400">Réponse sous 24h</p>
            </div>
            <div className="glass-effect rounded-xl p-4 sm:p-6">
              <MapPin className="w-8 h-8 text-orange-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Adresse</h3>
              <p className="text-gray-300">140 Passage Charles Tillon,<br />34070 Montpellier</p>
              <p className="text-sm text-gray-400">Parking gratuit sur site</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <iframe
              title="Carte Paintball Méditerranée"
              aria-label="Emplacement sur Google Maps"
              src="https://www.google.com/maps?q=140+Passage+Charles+Tillon,+34070+Montpellier&output=embed"
              className="rounded-xl w-full aspect-video max-h-60 sm:max-h-none h-auto shadow-lg border-0"
              loading="lazy"
            ></iframe>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;