import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { packagesData } from './PackagesSection';

const timeSlots = [
  '09:00',
  '10:00',
  '11:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00 (Soirée)',
];

const MAX_RESERVATIONS_PER_DAY = timeSlots.length;

const monthNames = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
];

const formatDate = (date) => date.toISOString().split('T')[0];

const Calendar = ({
  currentMonth,
  selectedDate,
  onDateSelect,
  onMonthChange,
  fullyBookedDates,
  isLoading,
}) => {
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    for (let i = 0; i < 42; i += 1) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const isCurrentMonth = date.getMonth() === month;
      const normalizedDate = new Date(date);
      normalizedDate.setHours(0, 0, 0, 0);
      const iso = formatDate(date);
      const isPast = normalizedDate < startOfToday;
      const isToday = normalizedDate.getTime() === startOfToday.getTime();
      const isFullyBooked = fullyBookedDates.has(iso);
      const isAvailable = isCurrentMonth && !isPast && !isFullyBooked;

      days.push({
        date,
        day: date.getDate(),
        isCurrentMonth,
        isPast,
        isAvailable,
        isToday,
        iso,
        isFullyBooked,
      });
    }

    return days;
  }, [currentMonth, fullyBookedDates]);

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true }}
      className="glass-effect rounded-xl p-4 sm:p-6 overflow-hidden"
      aria-busy={isLoading}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Choisir une date</h3>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Button
            aria-label="Mois précédent"
            variant="ghost"
            size="sm"
            onClick={() =>
              onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
            }
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
            onClick={() =>
              onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
            }
            className="text-white hover:bg-white/10 px-2"
          >
            →
          </Button>
        </div>
      </div>

      <div className="calendar-grid mb-4">
        {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day) => (
          <div key={day} className="text-center text-gray-400 font-medium py-2 text-xs sm:text-sm">
            {day}
          </div>
        ))}
      </div>

      <div className={`calendar-grid ${isLoading ? 'opacity-60 pointer-events-none' : ''}`}>
        {calendarDays.map((day) => {
          const isSelected = selectedDate?.getTime() === day.date.getTime();
          const isDisabled = !day.isAvailable;
          const title = isDisabled
            ? day.isPast
              ? 'Date passée'
              : day.isFullyBooked
                ? 'Complet'
                : 'Non disponible'
            : 'Disponible';

          return (
            <div
              key={day.iso}
              role="button"
              tabIndex={isDisabled ? -1 : 0}
              aria-disabled={isDisabled}
              aria-pressed={isSelected}
              title={title}
              className={`calendar-day text-xs sm:text-sm ${
                !day.isCurrentMonth
                  ? 'text-gray-600'
                  : isDisabled
                    ? 'unavailable'
                    : 'available'
              } ${isSelected ? 'selected' : ''}`}
              onClick={() => {
                if (!isDisabled) {
                  onDateSelect(day.date);
                }
              }}
              onKeyDown={(event) => {
                if ((event.key === 'Enter' || event.key === ' ') && !isDisabled) {
                  event.preventDefault();
                  onDateSelect(day.date);
                }
              }}
            >
              <span className={day.isToday ? 'font-bold underline' : ''}>{day.day}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-400/20 border border-green-400/40 rounded mr-2" />
            <span className="text-gray-300 text-xs sm:text-sm">Disponible</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-white/5 rounded mr-2" />
            <span className="text-gray-300 text-xs sm:text-sm">Indisponible</span>
          </div>
        </div>
        {isLoading && (
          <span className="text-xs text-gray-300 animate-pulse">Chargement…</span>
        )}
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
  bookedSlots,
  isSubmitting,
  isDateFullyBooked,
}) => {
  const selectedPkgDetails = packagesData.find((p) => p.id === selectedPackageId);
  const peopleCount = Number.parseInt(form.people, 10) || 0;
  const totalPrice = selectedPkgDetails ? selectedPkgDetails.price * Math.max(peopleCount, 0) : 0;
  const depositAmount = Math.round(totalPrice * 0.3);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const isSlotUnavailable = (time) => bookedSlots.has(time) || isDateFullyBooked;

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true }}
      className="space-y-6"
    >
      <div className="glass-effect rounded-xl p-4 sm:p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Horaires disponibles</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {timeSlots.map((time) => {
            const isSelected = selectedTime === time;
            const disabled = !selectedDate || isSlotUnavailable(time) || isSubmitting;
            return (
              <Button
                key={time}
                aria-label={`Choisir l'horaire ${time}`}
                variant={isSelected ? 'default' : 'outline'}
                className={`text-xs sm:text-sm ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-500 to-yellow-500'
                    : 'border-white/30 text-white hover:bg-white/10'
                } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                onClick={() => {
                  if (!disabled) {
                    onTimeSelect(time);
                  }
                }}
                disabled={disabled}
              >
                {time}
              </Button>
            );
          })}
        </div>
        {selectedDate && isDateFullyBooked && (
          <p className="mt-4 text-sm text-orange-200">
            Tous les créneaux sont déjà réservés pour cette date. Choisissez un autre jour.
          </p>
        )}
      </div>

      <div className="glass-effect rounded-xl p-4 sm:p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Récapitulatif</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-300">Date :</span>
            <span className="text-white font-medium">
              {selectedDate ? selectedDate.toLocaleDateString('fr-FR') : 'Non sélectionnée'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Horaire :</span>
            <span className="text-white font-medium">{selectedTime || 'Non sélectionné'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Forfait :</span>
            <span className="text-white font-medium">
              {selectedPkgDetails ? selectedPkgDetails.name : 'Non sélectionné'}
            </span>
          </div>
          {selectedPkgDetails && (
            <>
              <div className="border-t border-white/20 pt-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Prix total :</span>
                  <span className="text-white font-semibold">{totalPrice}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Acompte (30%) :</span>
                  <span className="text-orange-400 font-semibold">{depositAmount}€</span>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mt-6 text-sm">
          <div>
            <Label htmlFor="firstName" className="text-white">
              Prénom
            </Label>
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
            <Label htmlFor="lastName" className="text-white">
              Nom
            </Label>
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
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="bg-slate-800/50 border-slate-700 text-white"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-white">
              Téléphone
            </Label>
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
            <Label htmlFor="people" className="text-white">
              Nombre de personnes
            </Label>
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
          disabled={
            isSubmitting ||
            isDateFullyBooked ||
            !selectedDate ||
            !selectedTime ||
            !selectedPackageId ||
            !form.firstName ||
            !form.lastName ||
            !form.email ||
            !form.phone ||
            !form.people
          }
        >
          {isSubmitting ? 'Enregistrement…' : 'Confirmer la réservation'}
        </Button>
      </div>
    </motion.div>
  );
};

const ReservationSection = ({ selectedPackage, onSelectPackage }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', people: '1' });
  const [reservations, setReservations] = useState([]);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const defaultPackageId = packagesData[0]?.id ?? null;
  const effectiveSelectedPackageId = selectedPackage ?? defaultPackageId;

  useEffect(() => {
    if (!selectedPackage && defaultPackageId && onSelectPackage) {
      onSelectPackage(defaultPackageId);
    }
  }, [selectedPackage, defaultPackageId, onSelectPackage]);

  const selectedDateKey = selectedDate ? formatDate(selectedDate) : null;

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    const fetchReservations = async () => {
      setIsLoadingAvailability(true);
      setAvailabilityError('');

      const params = new URLSearchParams({
        from: formatDate(startOfMonth),
        to: formatDate(endOfMonth),
      });

      try {
        const response = await fetch(`/api/reservations?${params.toString()}`, {
          signal: controller.signal,
        });
        const body = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(body.error || 'Impossible de récupérer les disponibilités.');
        }

        if (isMounted) {
          setReservations(Array.isArray(body.data) ? body.data : []);
        }
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        console.error('Failed to load reservations', error);
        if (isMounted) {
          setAvailabilityError(
            error instanceof Error ? error.message : 'Une erreur inattendue est survenue.',
          );
          setReservations([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingAvailability(false);
        }
      }
    };

    fetchReservations();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [currentMonth]);

  const reservationsByDate = useMemo(() => {
    const map = new Map();

    reservations.forEach((reservation) => {
      if (!reservation?.date) {
        return;
      }

      const key = reservation.date;
      const entry = map.get(key) || { count: 0, times: new Set() };
      entry.count += 1;
      if (reservation.time) {
        entry.times.add(reservation.time);
      }
      map.set(key, entry);
    });

    return map;
  }, [reservations]);

  const fullyBookedDates = useMemo(() => {
    const booked = new Set();

    reservationsByDate.forEach((entry, key) => {
      if (entry.times.size >= timeSlots.length || entry.count >= MAX_RESERVATIONS_PER_DAY) {
        booked.add(key);
      }
    });

    return booked;
  }, [reservationsByDate]);

  const bookedSlotsForSelectedDate = useMemo(() => {
    if (!selectedDateKey) {
      return new Set();
    }

    const entry = reservationsByDate.get(selectedDateKey);

    if (!entry) {
      return new Set();
    }

    return new Set(entry.times);
  }, [reservationsByDate, selectedDateKey]);

  useEffect(() => {
    if (!selectedTime || !selectedDateKey) {
      return;
    }

    if (bookedSlotsForSelectedDate.has(selectedTime) || fullyBookedDates.has(selectedDateKey)) {
      setSelectedTime(null);
    }
  }, [bookedSlotsForSelectedDate, fullyBookedDates, selectedDateKey, selectedTime]);

  const handleGoToReservationPage = () => {
    if (!selectedDate) {
      return;
    }

    const query = { date: formatDate(selectedDate) };

    if (effectiveSelectedPackageId) {
      query.package = effectiveSelectedPackageId;
    }

    if (selectedTime) {
      query.time = selectedTime;
    }

    router.push({ pathname: '/reservation', query });
  };

  const handleReservation = async () => {
    if (
      !selectedDate ||
      !selectedTime ||
      !effectiveSelectedPackageId ||
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.phone ||
      !form.people
    ) {
      toast({
        title: 'Informations manquantes',
        description: 'Veuillez remplir tous les champs du formulaire.',
        variant: 'destructive',
      });
      return;
    }

    if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) {
      toast({
        title: 'Téléphone invalide',
        description: 'Veuillez saisir un numéro valide de 10 chiffres.',
        variant: 'destructive',
      });
      return;
    }

    const peopleCount = Number.parseInt(form.people, 10);
    if (!Number.isFinite(peopleCount) || peopleCount <= 0) {
      toast({
        title: 'Nombre de personnes invalide',
        description: 'Veuillez indiquer un nombre supérieur à 0.',
        variant: 'destructive',
      });
      return;
    }

    const selectedPkgDetails = packagesData.find((pkg) => pkg.id === effectiveSelectedPackageId);

    if (!selectedPkgDetails) {
      toast({
        title: 'Forfait invalide',
        description: 'Veuillez sélectionner un forfait avant de réserver.',
        variant: 'destructive',
      });
      return;
    }

    const total = selectedPkgDetails.price * peopleCount;
    const deposit = Math.round(total * 0.3);
    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      package: effectiveSelectedPackageId,
      people: peopleCount,
      date: formatDate(selectedDate),
      total,
      deposit,
    };

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(body.error || "Une erreur est survenue lors de l'enregistrement.");
      }

      if (body.data?.date) {
        setReservations((prev) => [
          ...prev,
          { ...body.data, time: selectedTime },
        ]);
      }

      toast({
        title: 'Réservation enregistrée !',
        description: `Votre réservation pour le ${selectedDate.toLocaleDateString('fr-FR')} à ${selectedTime} pour le forfait ${selectedPkgDetails.name} est enregistrée. Acompte estimé : ${deposit}€`,
        duration: 9000,
      });
      toast({
        title: '🚧 Paiement Payplug non implémenté',
        description: `L'intégration Payplug pour l'acompte de ${deposit}€ n'est pas encore active. Veuillez suivre les instructions pour la configurer.`,
        duration: 9000,
      });

      setForm({ firstName: '', lastName: '', email: '', phone: '', people: '1' });
      setSelectedTime(null);
    } catch (error) {
      console.error('Error saving reservation:', error);
      toast({
        title: 'Erreur de réservation',
        description:
          error instanceof Error
            ? error.message
            : "Une erreur s'est produite lors de l'enregistrement de votre réservation. Veuillez réessayer.",
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
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
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gradient mb-6">
            Réservez votre session
          </h2>
          <p className="text-sm sm:text-xl text-gray-300">
            Sélectionnez votre date et horaire préférés
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-4 lg:gap-8">
            <div>
              <Calendar
                currentMonth={currentMonth}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                onMonthChange={setCurrentMonth}
                fullyBookedDates={fullyBookedDates}
                isLoading={isLoadingAvailability}
              />
              {availabilityError && (
                <p className="mt-3 text-sm text-red-200">
                  {availabilityError}
                </p>
              )}
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
              selectedPackageId={effectiveSelectedPackageId}
              onTimeSelect={setSelectedTime}
              form={form}
              setForm={setForm}
              onReserve={handleReservation}
              bookedSlots={bookedSlotsForSelectedDate}
              isSubmitting={isSubmitting}
              isDateFullyBooked={selectedDateKey ? fullyBookedDates.has(selectedDateKey) : false}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReservationSection;
