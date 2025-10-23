import { z } from 'zod';
import { supabase } from './supabaseClient';

export const reservationSchema = z
  .object({
    firstName: z.string().min(1, "Le prénom est requis."),
    lastName: z.string().min(1, "Le nom est requis."),
    email: z.string().email("Adresse email invalide."),
    phone: z
      .string()
      .min(6, "Le numéro de téléphone est trop court."),
    package: z.string().min(1, "Veuillez sélectionner un forfait."),
    people: z
      .number()
      .int("Le nombre de personnes doit être entier.")
      .positive("Le nombre de personnes doit être positif."),
    date: z
      .string()
      .min(1, "La date est requise.")
      .refine((value) => !Number.isNaN(new Date(value).getTime()), {
        message: 'La date est invalide.',
      }),
    total: z.number().nonnegative().optional(),
    deposit: z.number().nonnegative().optional(),
  })
  .refine((data) => new Date(data.date) >= new Date(new Date().toDateString()), {
    message: 'La date de réservation ne peut pas être dans le passé.',
    path: ['date'],
  });

export type ReservationInput = z.infer<typeof reservationSchema>;

export async function createReservation(input: ReservationInput) {
  const payload = {
    first_name: input.firstName,
    last_name: input.lastName,
    email: input.email,
    phone: input.phone,
    package_id: input.package,
    people: input.people,
    date: input.date,
    total_amount: input.total ?? null,
    deposit_amount: input.deposit ?? null,
  };

  const { data, error } = await supabase
    .from('reservations')
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
