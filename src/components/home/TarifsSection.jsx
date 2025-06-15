import React from 'react';
import { Button } from '@/components/ui/button';

const tarifs = [
  { name: 'Découverte', billes: 120, duree: '40–60 min', prix: '20 €' },
  { name: 'Méditerranée', billes: 200, duree: '60–90 min', prix: '25 €' },
  { name: 'Player', billes: 300, duree: '90–120 min', prix: '30 €' },
  { name: 'Punisher', billes: 400, duree: '90–120 min', prix: '35 €' },
  { name: 'Expendable', billes: 600, duree: 'jusqu\u2019\u00e0 3h', prix: '45 €' },
  { name: 'Enfant Gotcha', billes: 'billes lavables', duree: '6–10 ans', prix: '20 €' },
];

const TarifsSection = () => {
  return (
    <section id="tarifs" className="py-20" data-aos="fade-up">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl lg:text-5xl font-bold text-gradient mb-8 text-center">Nos tarifs</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-gray-300">
            <thead className="bg-white/10 text-white">
              <tr>
                <th className="px-4 py-3">Formule</th>
                <th className="px-4 py-3">Billes</th>
                <th className="px-4 py-3">Durée</th>
                <th className="px-4 py-3">Prix</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {tarifs.map((t) => (
                <tr key={t.name} className="border-b border-white/10">
                  <td className="px-4 py-4 font-semibold text-white">{t.name}</td>
                  <td className="px-4 py-4">{t.billes}</td>
                  <td className="px-4 py-4">{t.duree}</td>
                  <td className="px-4 py-4">{t.prix}</td>
                  <td className="px-4 py-4">
                    <Button
                      aria-label={`Réserver la formule ${t.name}`}
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                      onClick={() => document.getElementById('reservation')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      Réserver maintenant
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default TarifsSection;
