import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Briefcase, MessageSquare } from 'lucide-react';
import { quoteSchema } from '@/lib/quotes';

const initialFormState = {
  companyName: '',
  contactName: '',
  email: '',
  phone: '',
  numParticipants: '',
  eventDate: '',
  eventDetails: '',
};

const ProQuotePage = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [status, setStatus] = useState('idle');
  const [validationErrors, setValidationErrors] = useState([]);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('pending');
    setValidationErrors([]);
    setMessage('');

    const payload = {
      ...formData,
      numParticipants: Number.parseInt(formData.numParticipants, 10),
      eventDate: formData.eventDate || undefined,
      phone: formData.phone || undefined,
      eventDetails: formData.eventDetails || undefined,
    };

    const parsed = quoteSchema.safeParse(payload);

    if (!parsed.success) {
      const errors = parsed.error.issues.map((issue) => issue.message);
      setStatus('error');
      setValidationErrors(errors);
      setMessage('Merci de corriger les erreurs avant de renvoyer votre demande.');
      toast({
        title: 'Erreurs de validation',
        description: errors.join('\n'),
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsed.data),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: 'Erreur inconnue' }));
        throw new Error(body.error || "Impossible d'envoyer la demande pour le moment.");
      }

      setStatus('success');
      setMessage('Votre demande de devis a bien été envoyée. Notre équipe vous répondra sous 48h.');
      setFormData(initialFormState);
      toast({
        title: 'Demande de devis envoyée',
        description: 'Nous avons bien reçu votre demande. Merci pour votre confiance !',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inattendue.';
      setStatus('error');
      setMessage(errorMessage);
      toast({
        title: 'Erreur lors de la demande',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const isSubmitting = status === 'pending';

  return (
    <motion.section
      id="espace-pro"
      className="py-16 sm:py-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Briefcase className="w-16 h-16 text-orange-400 mx-auto mb-6" />
          <h1 className="text-4xl lg:text-5xl font-bold text-gradient mb-6">Espace Professionnels & Groupes</h1>
          <p className="text-sm sm:text-xl text-gray-300 max-w-3xl mx-auto">
            Organisez vos événements d'entreprise, team building, ou sorties de groupe sur mesure.
            Remplissez le formulaire ci-dessous pour obtenir un devis personnalisé.
          </p>
        </motion.div>

        <motion.div
          className="max-w-2xl mx-auto glass-effect rounded-xl p-4 sm:p-8 shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <Label htmlFor="companyName" className="text-white">Nom de l'entreprise *</Label>
              <Input
                type="text"
                name="companyName"
                id="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Votre société SAS"
                className="bg-slate-800/50 border-slate-700 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="contactName" className="text-white">Nom du contact *</Label>
              <Input
                type="text"
                name="contactName"
                id="contactName"
                value={formData.contactName}
                onChange={handleChange}
                placeholder="Jean Dupont"
                className="bg-slate-800/50 border-slate-700 text-white"
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <Label htmlFor="email" className="text-white">Email *</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contact@societe.com"
                  className="bg-slate-800/50 border-slate-700 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-white">Téléphone</Label>
                <Input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="06 12 34 56 78"
                  className="bg-slate-800/50 border-slate-700 text-white"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <Label htmlFor="numParticipants" className="text-white">Nombre de participants (estimé) *</Label>
                <Input
                  type="number"
                  name="numParticipants"
                  id="numParticipants"
                  value={formData.numParticipants}
                  onChange={handleChange}
                  placeholder="Ex: 25"
                  className="bg-slate-800/50 border-slate-700 text-white"
                  required
                  min="1"
                />
              </div>
              <div>
                <Label htmlFor="eventDate" className="text-white">Date souhaitée</Label>
                <Input
                  type="date"
                  name="eventDate"
                  id="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  className="bg-slate-800/50 border-slate-700 text-white"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="eventDetails" className="text-white">Détails de l'événement / Besoins spécifiques</Label>
              <Textarea
                name="eventDetails"
                id="eventDetails"
                value={formData.eventDetails}
                onChange={handleChange}
                placeholder="Ex: Team building, EVG/EVJF, options repas, etc."
                rows={4}
                className="bg-slate-800/50 border-slate-700 text-white"
              />
            </div>

            {status !== 'idle' && message && (
              <div
                className={`rounded-lg border px-4 py-3 text-sm ${
                  status === 'success'
                    ? 'border-green-200 bg-green-50 text-green-700'
                    : 'border-red-200 bg-red-50 text-red-700'
                }`}
                role={status === 'success' ? 'status' : 'alert'}
                aria-live="polite"
              >
                {message}
                {validationErrors.length > 0 && (
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {validationErrors.map((error) => (
                      <li key={error}>{error}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="text-center">
              <Button
                type="submit"
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold px-8 py-3 pulse-glow w-full sm:w-auto"
                disabled={
                  isSubmitting ||
                  !formData.companyName ||
                  !formData.contactName ||
                  !formData.email ||
                  !formData.numParticipants
                }
              >
                {isSubmitting ? (
                  'Envoi en cours…'
                ) : (
                  <>
                    <MessageSquare className="mr-2 h-5 w-5" /> Demander un devis
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ProQuotePage;
