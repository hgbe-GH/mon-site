import { NextRequest, NextResponse } from 'next/server';
import {
  attachAdminSessionCookie,
  validateAdminPassword,
} from '@/lib/adminAuth';

export async function POST(request: NextRequest) {
  let password: string | undefined;

  try {
    const body = await request.json();
    password = typeof body?.password === 'string' ? body.password : undefined;
  } catch (error) {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  if (!password) {
    return NextResponse.json({ error: 'Le mot de passe est requis.' }, { status: 400 });
  }

  if (!validateAdminPassword(password)) {
    return NextResponse.json({ error: 'Mot de passe incorrect.' }, { status: 401 });
  }

  try {
    const response = NextResponse.json({ ok: true }, { status: 200 });
    attachAdminSessionCookie(response);
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur de configuration.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
