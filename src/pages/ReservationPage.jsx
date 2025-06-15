import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { packagesData } from '@/components/home/PackagesSection';

const ReservationPage = () => {
  const location = useLocation();
  const initialDate = location.state?.selectedDate || '';
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    package: packagesData[0]?.id || '',
    people: 1,
    date: initialDate,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Réservation enregistrée');
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-xl md:text-2xl font-bold text-center mb-8">Réserver une session</h1>
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto rounded-xl p-6 shadow-md bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="Jean"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Dupont"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="jean.dupont@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                type="tel"
                name="phone"
                placeholder="0612345678"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="package">Forfait choisi</Label>
              <select
                id="package"
                name="package"
                className="border-input bg-background h-10 px-3 py-2 rounded-md w-full"
                value={formData.package}
                onChange={handleChange}
              >
                {packagesData.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="people">Nombre de personnes</Label>
              <Input
                id="people"
                type="number"
                name="people"
                min="1"
                value={formData.people}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="date">Date de la session</Label>
              <Input
                id="date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <Button type="submit" className="mt-6 w-full bg-primary hover:bg-primary/80">
            Réserver
          </Button>
        </form>
      </div>
    </section>
  );
};

export default ReservationPage;
