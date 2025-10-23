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

export const RESERVATION_STATUSES = ['pending', 'confirmed', 'cancelled'] as const;

export type ReservationStatus = (typeof RESERVATION_STATUSES)[number];

export type ReservationDetailRecord = {
  id: number | string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  packageId: string | null;
  people: number | null;
  date: string;
  status: ReservationStatus;
  createdAt: string | null;
};

type ReservationRow = {
  id: number | string;
  date: string;
  package_id?: string | null;
  people?: number | null;
};

type ReservationDetailRow = ReservationRow & {
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
  status?: string | null;
  created_at?: string | null;
};

function mapReservationRow(row: ReservationRow): ReservationRecord {
  return {
    id: row.id,
    date: row.date,
    packageId: row.package_id ?? null,
    people: row.people ?? null,
  };
}

function mapReservationDetailRow(row: ReservationDetailRow): ReservationDetailRecord {
  const status = RESERVATION_STATUSES.includes((row.status ?? 'pending') as ReservationStatus)
    ? ((row.status ?? 'pending') as ReservationStatus)
    : 'pending';

  return {
    id: row.id,
    firstName: row.first_name ?? '',
    lastName: row.last_name ?? '',
    email: row.email ?? '',
    phone: row.phone ?? null,
    packageId: row.package_id ?? null,
    people: row.people ?? null,
    date: row.date,
    status,
    createdAt: row.created_at ?? null,
  };
}

export async function createReservation(input: ReservationInput): Promise<ReservationRecord> {
  const payload: Record<string, unknown> = {
    first_name: input.firstName,
    last_name: input.lastName,
    email: input.email,
    phone: input.phone,
    package_id: input.package,
    people: input.people,
    date: input.date,
    total_amount: input.total ?? null,
    deposit_amount: input.deposit ?? null,
    status: 'pending',
  };

  const { status: _status, ...fallbackPayload } = payload;

  const { data, error } = await supabase
    .from('reservations')
    .insert(payload)
    .select('id, date, package_id, people')
    .single();

  if (error) {
    if (error.code === '42703') {
      const fallback = await supabase
        .from('reservations')
        .insert(fallbackPayload)
        .select('id, date, package_id, people')
        .single();

      if (fallback.error) {
        throw new Error(fallback.error.message);
      }

      return mapReservationRow(fallback.data);
    }

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

export async function listAllReservations(
  params: { from?: string; to?: string; status?: ReservationStatus } = {},
): Promise<ReservationDetailRecord[]> {
  const baseQuery = supabase
    .from('reservations')
    .select('id, date, package_id, people, first_name, last_name, email, phone, status, created_at');

  const applyFilters = (query: any) => {
    let filtered = query;

    if (params.from) {
      filtered = filtered.gte('date', params.from);
    }

    if (params.to) {
      filtered = filtered.lte('date', params.to);
    }

    if (params.status) {
      filtered = filtered.eq('status', params.status);
    }

    return filtered.order('date', { ascending: true });
  };

  const { data, error } = await applyFilters(baseQuery);

  if (error) {
    if (error.code === '42703') {
      const fallbackQuery = supabase
        .from('reservations')
        .select('id, date, package_id, people, first_name, last_name, email, phone, created_at');
      const { data: fallbackData, error: fallbackError } = await applyFilters(fallbackQuery);

      if (fallbackError) {
        throw new Error(fallbackError.message);
      }

      return (fallbackData ?? []).map((row) =>
        mapReservationDetailRow({ ...(row as ReservationDetailRow), status: 'pending' }),
      );
    }

    throw new Error(error.message);
  }

  return (data ?? []).map(mapReservationDetailRow);
}

export async function updateReservationStatus(
  id: string | number,
  status: ReservationStatus,
): Promise<ReservationDetailRecord> {
  const { data, error } = await supabase
    .from('reservations')
    .update({ status })
    .eq('id', id)
    .select('id, date, package_id, people, first_name, last_name, email, phone, status, created_at')
    .single();

  if (error) {
    if (error.code === '42703') {
      throw new Error(
        "La colonne 'status' est absente de la table 'reservations'. Ajoutez-la pour activer la validation des réservations.",
      );
    }

    throw new Error(error.message);
  }

  return mapReservationDetailRow(data);
}
