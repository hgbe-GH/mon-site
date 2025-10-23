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

export type ReservationRecord = {
  id: number | string;
  date: string;
  packageId: string | null;
  people: number | null;
};

function mapReservationRow(row: {
  id: number | string;
  date: string;
  package_id?: string | null;
  people?: number | null;
}): ReservationRecord {
  return {
    id: row.id,
    date: row.date,
    packageId: row.package_id ?? null,
    people: row.people ?? null,
  };
}

export async function createReservation(input: ReservationInput): Promise<ReservationRecord> {
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
    .select('id, date, package_id, people')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapReservationRow(data);
}

export async function listReservations(params: { from?: string; to?: string } = {}): Promise<ReservationRecord[]> {
  let query = supabase.from('reservations').select('id, date, package_id, people');

  if (params.from) {
    query = query.gte('date', params.from);
  }

  if (params.to) {
    query = query.lte('date', params.to);
  }

  query = query.order('date', { ascending: true });

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapReservationRow);
}
