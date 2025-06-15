import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Sun, Moon, Waves, Flame as Grill } from 'lucide-react';

const terrainImage1Url = "https://storage.googleapis.com/hostinger-horizons-assets-prod/d920d526-dc48-47a4-aa51-9f37007af78b/70424eca1620c7e8ae4769c73ade1bbd.png";
const terrainImage2Url = "https://storage.googleapis.com/hostinger-horizons-assets-prod/d920d526-dc48-47a4-aa51-9f37007af78b/d1e0c8cd051b8502e829070032262bae.png";
const terrainImage3Url = "https://storage.googleapis.com/hostinger-horizons-assets-prod/d920d526-dc48-47a4-aa51-9f37007af78b/a85ef82f531437dbdabe59c591d49141.png";


const TerrainSection = () => {
  return (
    <section id="terrain" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gradient mb-6">Découvrez nos terrains et espaces</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Plusieurs terrains de jeu, des niveaux de difficulté variés, et un espace détente unique.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="glass-effect rounded-xl p-6">
              <MapPin className="w-8 h-8 text-orange-400 mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-3">Deux terrains, multiples ambiances</h3>
              <p className="text-gray-300">
                Explorez nos deux terrains distincts offrant des défis variés : un village western abandonné et une zone de bunkers tactiques. Différents niveaux de jeu pour s'adapter à tous les joueurs.
              </p>
            </div>
            <div className="glass-effect rounded-xl p-6">
              <Sun className="w-8 h-8 text-yellow-400 mb-2 inline-block" />
              <Moon className="w-8 h-8 text-blue-300 mb-2 inline-block ml-2" />
              <h3 className="text-2xl font-semibold text-white mb-3">Espace détente & soirée</h3>
              <p className="text-gray-300">
                Profitez de notre espace détente avec tables, lumière d'ambiance pour vos soirées, plancha à disposition et un accès direct à la rivière pour vous rafraîchir. Parfait pour prolonger l'expérience après le jeu.
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                  <span className="flex items-center text-gray-200 glass-effect px-3 py-1 rounded-full text-sm"><Grill className="w-4 h-4 mr-2 text-orange-400" /> Plancha</span>
                  <span className="flex items-center text-gray-200 glass-effect px-3 py-1 rounded-full text-sm"><Waves className="w-4 h-4 mr-2 text-blue-400" /> Rivière</span>
                  <span className="flex items-center text-gray-200 glass-effect px-3 py-1 rounded-full text-sm"><Moon className="w-4 h-4 mr-2 text-yellow-300" /> Soirées</span>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            <img 
              alt="Espace extérieur arboré du site de paintball"
              className="rounded-xl h-56 w-full object-cover shadow-lg"
              src={terrainImage1Url} />
            <img 
              alt="Animateur briefant un groupe de joueurs de paintball"
              className="rounded-xl h-56 w-full object-cover shadow-lg"
              src={terrainImage2Url} />
            <img 
              alt="Passage couvert de bambous menant aux terrains de paintball"
              className="rounded-xl h-56 w-full object-cover col-span-2 shadow-lg"
              src={terrainImage3Url} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TerrainSection;