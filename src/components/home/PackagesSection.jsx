import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Baby as Kid } from 'lucide-react';
import { Button } from '@/components/ui/button';

const packagesData = [
  {
    id: 'decouverte',
    group: 'paintball',
    name: 'Découverte',
    price: 20,
    duration: 'Jusqu’à 2h de session',
    players: '120 billes',
    description: 'Idéal pour découvrir le paintball en douceur.',
    features: [
      'Encadrement et briefing sécurité inclus',
      'Recharge supplémentaire : 6€ les 100 billes',
      'Équipement complet fourni'
    ]
  },
  {
    id: 'mediterranee',
    group: 'paintball',
    name: 'Méditerranée',
    price: 25,
    duration: 'Jusqu’à 2h de session',
    players: '200 billes',
    description: 'Le bon équilibre pour des parties animées en groupe.',
    features: [
      'Sessions conviviales jusqu’à 2h',
      'Recharge supplémentaire : 6€ les 100 billes',
      'Équipement complet fourni'
    ]
  },
  {
    id: 'player',
    group: 'paintball',
    name: 'Player',
    price: 30,
    duration: 'Jusqu’à 2h de session',
    players: '300 billes',
    description: 'Pour ceux qui veulent enchaîner les scénarios sans compter.',
    badge: { text: 'Populaire', gradient: 'from-orange-500 to-yellow-500', position: 'right' },
    features: [
      '300 billes pour un rythme soutenu',
      'Recharge supplémentaire : 6€ les 100 billes',
      'Équipement complet fourni'
    ]
  },
  {
    id: 'punisher',
    group: 'paintball',
    name: 'Punisher',
    price: 35,
    duration: 'Jusqu’à 2h de session',
    players: '450 billes',
    description: 'Un maximum de billes pour les joueurs confirmés.',
    badge: { text: 'Promo été', gradient: 'from-pink-500 to-orange-500', position: 'right' },
    features: [
      '450 billes – profitez de la promo été',
      'Recharge supplémentaire : 6€ les 100 billes',
      'Équipement complet fourni'
    ]
  },
  {
    id: 'expendables',
    group: 'paintball',
    name: 'Expendables',
    price: 45,
    duration: 'Jusqu’à 2h de session',
    players: '600 billes',
    description: 'L’expérience ultime pour des affrontements prolongés.',
    features: [
      '600 billes pour ne jamais manquer de munitions',
      'Recharge supplémentaire : 6€ les 100 billes',
      'Équipement complet fourni'
    ]
  },
  {
    id: 'link-paintball',
    group: 'link-ranger',
    name: 'Link Ranger Paintball',
    price: 18,
    duration: 'Jusqu’à 1h30',
    players: '120 billes',
    description: 'Paintball accessible dès 8 ans avec l’équipe Link Ranger.',
    badge: { text: 'Dès 8 ans', gradient: 'from-blue-500 to-teal-500', position: 'left', icon: Kid },
    features: [
      'Encadrement adapté aux plus jeunes',
      'Recharge supplémentaire : 6€ les 100 billes',
      'Équipement complet fourni'
    ]
  },
  {
    id: 'link-orbeez',
    group: 'link-ranger',
    name: 'Link Ranger Orbeez',
    price: 18,
    duration: 'Jusqu’à 1h',
    players: '1600 billes orbeez',
    description: 'Version gellyball douce et ludique pour toute la famille.',
    badge: { text: 'Dès 8 ans', gradient: 'from-blue-500 to-teal-500', position: 'left', icon: Kid },
    features: [
      'Projectiles orbeez sans impact',
      'Recharge supplémentaire : 6€ les 100 billes',
      'Équipement complet fourni'
    ]
  }
];

const PackagesSection = ({ selectedPackage, onSelectPackage }) => {
  const paintballPackages = packagesData.filter((pkg) => pkg.group === 'paintball');
  const linkRangerPackages = packagesData.filter((pkg) => pkg.group === 'link-ranger');

  const renderPackageCard = (pkg, index) => (
    <motion.div
      key={pkg.id}
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`glass-effect rounded-xl p-4 sm:p-8 relative overflow-hidden hover:scale-105 transition-transform cursor-pointer ${
        selectedPackage === pkg.id ? 'ring-2 ring-orange-400' : ''
      }`}
      onClick={() => onSelectPackage(pkg.id)}
    >
      {pkg.badge && (
        <div
          className={`absolute top-4 ${
            pkg.badge.position === 'left' ? 'left-4' : 'right-4'
          } bg-gradient-to-r ${pkg.badge.gradient} text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1`}
        >
          {pkg.badge.icon && <pkg.badge.icon className="w-4 h-4" />}
          {pkg.badge.text}
        </div>
      )}
      <div className="text-center mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{pkg.name}</h3>
        <p className="text-gray-300 mb-4 min-h-[48px]">{pkg.description}</p>
        <div className="text-4xl font-bold text-gradient mb-2">{pkg.price}€</div>
        <div className="flex flex-col sm:flex-row justify-center space-y-1 sm:space-y-0 sm:space-x-4 text-sm text-gray-300">
          <span className="flex items-center justify-center"><Clock className="w-4 h-4 mr-1" />{pkg.duration}</span>
          <span className="flex items-center justify-center"><Users className="w-4 h-4 mr-1" />{pkg.players}</span>
        </div>
      </div>
      <ul className="space-y-3 min-h-[108px] text-sm">
        {pkg.features.map((feature, i) => (
          <li key={i} className="flex items-center text-gray-300">
            <div className="w-2 h-2 bg-orange-400 rounded-full mr-3 shrink-0" />
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
  );

  return (
    <section id="forfaits" className="py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gradient mb-6">
            Nos forfaits Paintball – jusqu’à 2h00 de session
          </h2>
          <p className="text-sm sm:text-xl text-gray-300 max-w-3xl mx-auto">
            Sessions à partir de 8 joueurs. Recharge +100 billes : 6€. Profitez d’un cadre boisé en lisière de rivière pour vos affrontements.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-8">
          {paintballPackages.map((pkg, index) => renderPackageCard(pkg, index))}
        </div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 grid md:grid-cols-2 gap-4 sm:gap-6"
        >
          <div className="glass-effect rounded-xl p-4 sm:p-6 text-left">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-3">Options & recharges</h3>
            <ul className="space-y-2 text-sm sm:text-base text-gray-200">
              <li><span className="text-white font-medium">Recharge +100 billes :</span> 6€</li>
              <li><span className="text-white font-medium">Combinaison intégrale tissu :</span> 4€</li>
              <li><span className="text-white font-medium">Gants coqués :</span> 2,5€</li>
              <li><span className="text-white font-medium">Costume de lapin :</span> 25€</li>
              <li><span className="text-white font-medium">Option nocturne (dès 20h00) :</span> +4€</li>
            </ul>
          </div>
          <div className="glass-effect rounded-xl p-4 sm:p-6 text-left">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-3">Équipement & conseils</h3>
            <p className="text-sm sm:text-base text-gray-200">
              Casque, lanceur paintball, plastron, tour de cou ainsi qu’une veste pour les femmes et les enfants de moins de 14 ans sont fournis pour chaque forfait.
            </p>
            <p className="text-sm sm:text-base text-gray-300 mt-3">
              Prévoyez des vêtements et chaussures adaptés : nous jouons avec des billes calibre .50, un sweat-shirt et des gants peuvent suffire.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16 mb-8"
        >
          <h3 className="text-xl sm:text-3xl font-bold text-gradient mb-4">
            Les forfaits Link Ranger – 18€/pers dès 8 ans
          </h3>
          <p className="text-sm sm:text-lg text-gray-300 max-w-2xl mx-auto">
            Nos forfaits paintball tout public à 18€/personne : paintball ou gellyball dès 8 ans, animés par l’équipe Link Ranger.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {linkRangerPackages.map((pkg, index) => renderPackageCard(pkg, index))}
        </div>
      </div>
    </section>
  );
};

export { packagesData };
export default PackagesSection;
