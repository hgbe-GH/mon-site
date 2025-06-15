import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { packagesData } from './PackagesSection';
import { supabase } from '@/lib/supabaseClient';

const timeSlots = [
  '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00 (Soirée)'
];

const monthNames = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const Calendar = ({ currentMonth, selectedDate, onDateSelect, onMonthChange }) => {
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === month;
      const isPast = date < today.setHours(0,0,0,0) && date.toDateString() !== today.toDateString();
      const isAvailable = isCurrentMonth && !isPast && Math.random() > 0.3;
      
      days.push({
        date,
        day: date.getDate(),
        isCurrentMonth,
        isPast,
        isAvailable
      });
    }
    return days;
  };
  const calendarDays = generateCalendarDays();

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true }}
      className="glass-effect rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Choisir une date</h3>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Button
            aria-label="Mois précédent"
            variant="ghost"
            size="sm"
            onClick={() => onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="text-white hover:bg-white/10 px-2"
          >
            ←
          </Button>
          <span className="text-white font-medium text-sm sm:text-base">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <Button
            aria-label="Mois suivant"
            variant="ghost"
            size="sm"
            onClick={() => onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="text-white hover:bg-white/10 px-2"
          >
            →
          </Button>
        </div>
      </div>

      <div className="calendar-grid mb-4">
        {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
          <div key={day} className="text-center text-gray-400 font-medium py-2 text-xs sm:text-sm">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`calendar-day text-xs sm:text-sm ${
              !day.isCurrentMonth ? 'text-gray-600' :
              day.isPast ? 'unavailable' :
              day.isAvailable ? 'available' : 'unavailable'
            } ${selectedDate?.getTime() === day.date.getTime() ? 'selected' : ''}`}
            onClick={() => {
              if (day.isCurrentMonth && !day.isPast && day.isAvailable) {
                onDateSelect(day.date);
              }
            }}
          >
            {day.day}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-400/20 border border-green-400/40 rounded mr-2"></div>
            <span className="text-gray-300 text-xs sm:text-sm">Disponible</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-white/5 rounded mr-2"></div>
            <span className="text-gray-300 text-xs sm:text-sm">Indisponible</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const BookingSummary = ({
  selectedDate,
  selectedTime,
  selectedPackageId,
  onTimeSelect,
  form,
  setForm,
  onReserve,
}) => {
  const selectedPkgDetails = packagesData.find(p => p.id === selectedPackageId);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  
  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true }}
      className="space-y-6"
    >
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Horaires disponibles</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {timeSlots.map(time => (
            <Button
              key={time}
              aria-label={`Choisir l'horaire ${time}`}
              variant={selectedTime === time ? "default" : "outline"}
              className={`text-xs sm:text-sm ${
                selectedTime === time
                  ? 'bg-gradient-to-r from-orange-500 to-yellow-500'
                  : 'border-white/30 text-white hover:bg-white/10'
              }`}
              onClick={() => onTimeSelect(time)}
              disabled={!selectedDate}
            >
              {time}
            </Button>
          ))}
        </div>
      </div>

      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Récapitulatif</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-300">Date:</span>
            <span className="text-white font-medium">
              {selectedDate ? selectedDate.toLocaleDateString('fr-FR') : 'Non sélectionnée'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Horaire:</span>
            <span className="text-white font-medium">{selectedTime || 'Non sélectionné'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Forfait:</span>
            <span className="text-white font-medium">
              {selectedPkgDetails ? selectedPkgDetails.name : 'Non sélectionné'}
            </span>
          </div>
          {selectedPkgDetails && (
            <>
              <div className="border-t border-white/20 pt-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Prix total:</span>
                  <span className="text-white font-semibold">
                    {selectedPkgDetails.price}€
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Acompte (30%):</span>
                  <span className="text-orange-400 font-semibold">
                    {Math.round(selectedPkgDetails.price * 0.3)}€
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          <div>
            <Label htmlFor="firstName" className="text-white">Prénom</Label>
            <Input
              id="firstName"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
              className="bg-slate-800/50 border-slate-700 text-white"
            />
          </div>
          <div>
            <Label htmlFor="lastName" className="text-white">Nom</Label>
            <Input
              id="lastName"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
              className="bg-slate-800/50 border-slate-700 text-white"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-white">Téléphone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              required
              className="bg-slate-800/50 border-slate-700 text-white"
            />
          </div>
          <div>
            <Label htmlFor="people" className="text-white">Nombre de personnes</Label>
            <Input
              id="people"
              name="people"
              type="number"
              min="1"
              value={form.people}
              onChange={handleChange}
              required
              className="bg-slate-800/50 border-slate-700 text-white"
            />
          </div>
        </div>
        <Button
          aria-label="Confirmer la réservation"
          className="w-full mt-6 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 pulse-glow"
          onClick={onReserve}
          disabled={!selectedDate || !selectedTime || !selectedPackageId || !form.firstName || !form.lastName || !form.phone || !form.people}
        >
          Confirmer la réservation
        </Button>
      </div>
    </motion.div>
  );
};


const ReservationSection = ({ selectedPackage, onSelectPackage }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', people: '' });
  const navigate = useNavigate();

  const handleGoToReservationPage = () => {
    if (selectedDate) {
      navigate('/reservation', {
        state: { selectedDate: selectedDate.toISOString().split('T')[0] },
      });
    }
  };

  const handleReservation = async () => {
    if (!selectedDate || !selectedTime || !selectedPackage || !form.firstName || !form.lastName || !form.phone || !form.people) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs du formulaire.",
        variant: "destructive"
      });
      return;
    }

    if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) {
      toast({
        title: "Téléphone invalide",
        description: "Veuillez saisir un numéro valide de 10 chiffres.",
        variant: "destructive",
      });
      return;
    }

    if (parseInt(form.people, 10) <= 0) {
      toast({
        title: "Nombre de personnes invalide",
        description: "Veuillez indiquer un nombre supérieur à 0.",
        variant: "destructive",
      });
      return;
    }

    const selectedPkgDetails = packagesData.find(p => p.id === selectedPackage);
    const deposit = Math.round(selectedPkgDetails.price * 0.3);
    
    const reservationData = {
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
      package_id: selectedPackage,
      package_name: selectedPkgDetails.name,
      total_price: selectedPkgDetails.price,
      deposit_amount: deposit,
      first_name: form.firstName,
      last_name: form.lastName,
      phone: form.phone,
      num_people: parseInt(form.people, 10),
      status: 'pending_payment',
    };

    const { data, error } = await supabase
      .from('reservations')
      .insert([reservationData])
      .select();

    if (error) {
      console.error('Error saving reservation:', error);
      toast({
        title: "Erreur de réservation",
        description: "Une erreur s'est produite lors de l'enregistrement de votre réservation. Veuillez réessayer.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Réservation enregistrée !",
        description: `Votre réservation pour le ${selectedDate.toLocaleDateString('fr-FR')} à ${selectedTime} pour le forfait ${selectedPkgDetails.name} est en attente de paiement. Acompte: ${deposit}€.`,
        duration: 9000,
      });
      toast({
        title: "🚧 Paiement Payplug non implémenté",
        description: `L'intégration Payplug pour l'acompte de ${deposit}€ n'est pas encore active. Veuillez suivre les instructions pour la configurer.`,
        duration: 9000,
      });
      setForm({ firstName: '', lastName: '', phone: '', people: '' });
    }
  };
  
  return (
    <section id="reservation" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gradient mb-6">Réservez votre session</h2>
          <p className="text-xl text-gray-300">Sélectionnez votre date et horaire préférés</p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <Calendar
                currentMonth={currentMonth}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                onMonthChange={setCurrentMonth}
              />
              <Button
                className="mt-4 w-full bg-primary hover:bg-primary/80"
                onClick={handleGoToReservationPage}
                disabled={!selectedDate}
              >
                Réserver cette date
              </Button>
            </div>
            <BookingSummary
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              selectedPackageId={selectedPackage}
              onTimeSelect={setSelectedTime}
              form={form}
              setForm={setForm}
              onReserve={handleReservation}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReservationSection;