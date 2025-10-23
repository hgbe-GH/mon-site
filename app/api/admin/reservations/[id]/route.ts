import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import {
  ReservationStatus,
  RESERVATION_STATUSES,
  updateReservationStatus,
} from '@/lib/reservations';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Authentification requise.' }, { status: 401 });
  }

  const reservationId = params.id;

  if (!reservationId) {
    return NextResponse.json({ error: "Identifiant de réservation invalide." }, { status: 400 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ error: 'Corps de requête invalide.' }, { status: 400 });
  }

  const status =
    typeof body === 'object' && body !== null ? (body as { status?: unknown }).status : undefined;

  if (!RESERVATION_STATUSES.includes(status as ReservationStatus)) {
    return NextResponse.json({ error: 'Statut invalide.' }, { status: 400 });
  }

  try {
    const updated = await updateReservationStatus(reservationId, status as ReservationStatus);
    return NextResponse.json({ data: updated }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
