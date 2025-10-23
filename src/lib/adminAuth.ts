import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';

export const ADMIN_COOKIE_NAME = 'admin_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 6; // 6 heures

export class AdminUnauthorizedError extends Error {
  constructor(message = 'Accès administrateur requis.') {
    super(message);
    this.name = 'AdminUnauthorizedError';
  }
}

function getAdminSecrets() {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_PASSWORD;

  if (!password) {
    throw new Error("La variable d'environnement ADMIN_PASSWORD est manquante.");
  }

  if (!secret) {
    throw new Error("La variable d'environnement ADMIN_SESSION_SECRET est manquante.");
  }

  return { password, secret };
}

function computeSessionToken(password: string, secret: string) {
  return createHmac('sha256', secret).update(password).digest('hex');
}

export function validateAdminPassword(password: string): boolean {
  try {
    const { password: expectedPassword } = getAdminSecrets();
    return password === expectedPassword;
  } catch (error) {
    return false;
  }
}

export function getExpectedSessionToken(): string | null {
  try {
    const { password, secret } = getAdminSecrets();
    return computeSessionToken(password, secret);
  } catch (error) {
    return null;
  }
}

export function isAdminAuthenticated(): boolean {
  const token = cookies().get(ADMIN_COOKIE_NAME)?.value;
  const expected = getExpectedSessionToken();

  if (!token || !expected) {
    return false;
  }

  return token === expected;
}

export function requireAdminAuthentication() {
  if (!isAdminAuthenticated()) {
    throw new AdminUnauthorizedError();
  }
}

export function attachAdminSessionCookie(response: NextResponse) {
  const token = getExpectedSessionToken();

  if (!token) {
    throw new Error("Impossible de créer une session administrateur sans configuration.");
  }

  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  return response;
}

export function clearAdminSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: '',
    path: '/',
    maxAge: 0,
  });

  return response;
}
