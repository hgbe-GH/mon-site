import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { createQuote, quoteSchema } from '@/lib/quotes';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsedPayload = quoteSchema.parse({
      ...payload,
      numParticipants:
        typeof payload.numParticipants === 'string'
          ? Number.parseInt(payload.numParticipants, 10)
          : payload.numParticipants,
    });

    const quote = await createQuote(parsedPayload);

    return NextResponse.json(
      { data: quote },
      {
        status: 201,
      },
    );
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
