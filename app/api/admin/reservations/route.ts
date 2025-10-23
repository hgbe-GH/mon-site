import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import {
  listAllReservations,
  ReservationStatus,
  RESERVATION_STATUSES,
} from '@/lib/reservations';

export async function GET(request: NextRequest) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Authentification requise.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from') ?? undefined;
  const to = searchParams.get('to') ?? undefined;
  const statusParam = searchParams.get('status') ?? undefined;
  const status = RESERVATION_STATUSES.includes(statusParam as ReservationStatus)
    ? (statusParam as ReservationStatus)
    : undefined;

  try {
    const reservations = await listAllReservations({ from, to, status });
    return NextResponse.json({ data: reservations }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
