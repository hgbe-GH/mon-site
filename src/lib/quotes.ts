import { z } from 'zod';
import { supabase } from './supabaseClient';

export const quoteSchema = z.object({
  companyName: z.string().min(1, "Le nom de l'entreprise est requis."),
  contactName: z.string().min(1, 'Le nom du contact est requis.'),
  email: z.string().email('Adresse email invalide.'),
  phone: z
    .string()
    .optional()
    .transform((value) => value?.trim() || undefined),
  numParticipants: z
    .number()
    .int('Le nombre de participants doit être entier.')
    .positive('Le nombre de participants doit être positif.'),
  eventDate: z
    .string()
    .optional()
    .transform((value) => value?.trim() || undefined)
    .refine((value) => {
      if (!value) return true;
      return !Number.isNaN(new Date(value).getTime());
    }, "La date de l'événement est invalide."),
  eventDetails: z.string().optional().transform((value) => value?.trim() || undefined),
});

export type QuoteInput = z.infer<typeof quoteSchema>;

export async function createQuote(input: QuoteInput) {
  const payload = {
    company_name: input.companyName,
    contact_name: input.contactName,
    email: input.email,
    phone: input.phone ?? null,
    participants: input.numParticipants,
    event_date: input.eventDate ?? null,
    event_details: input.eventDetails ?? null,
  };

  const { data, error } = await supabase
    .from('quotes')
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
