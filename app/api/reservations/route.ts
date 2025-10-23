import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { createReservation, listReservations, reservationSchema } from '@/lib/reservations';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from') ?? undefined;
    const to = searchParams.get('to') ?? undefined;

    const reservations = await listReservations({ from, to });

    return NextResponse.json({ data: reservations }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur serveur inattendue.';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsedPayload = reservationSchema.parse({
      ...payload,
      people:
        typeof payload.people === 'string' ? Number.parseInt(payload.people, 10) : payload.people,
      total:
        typeof payload.total === 'string' ? Number.parseFloat(payload.total) : payload.total,
      deposit:
        typeof payload.deposit === 'string' ? Number.parseFloat(payload.deposit) : payload.deposit,
    });

    const reservation = await createReservation(parsedPayload);

    return NextResponse.json({ data: reservation }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      const message = error.issues.map((issue) => issue.message).join('\n');
      return NextResponse.json(
        { error: message },
        {
          status: 400,
        },
      );
    }

    const message = error instanceof Error ? error.message : 'Erreur serveur inattendue.';

    return NextResponse.json(
      { error: message },
      {
        status: 500,
      },
    );
  }
}
