import { test, expect } from '@playwright/test';
import { reservationSchema } from '@/lib/reservations';
import { quoteSchema } from '@/lib/quotes';

const runApiTests = !!process.env.PLAYWRIGHT_RUN_API;

test.describe('Form payload validation', () => {
  test('rejects reservation payload with invalid email', () => {
    const result = reservationSchema.safeParse({
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'not-an-email',
      phone: '0612345678',
      package: 'classic',
      people: 4,
      date: new Date().toISOString().split('T')[0],
      total: 100,
      deposit: 30,
    });

    expect(result.success).toBeFalsy();
  });

  test('accepts professional quote payload with optional fields missing', () => {
    const result = quoteSchema.safeParse({
      companyName: 'Société Exemple',
      contactName: 'Marie Curie',
      email: 'marie@example.com',
      numParticipants: 12,
    });

    expect(result.success).toBeTruthy();
  });
});

test.describe('API endpoints', () => {
  test.skip(!runApiTests, 'Définissez PLAYWRIGHT_RUN_API=1 pour lancer les tests API.');

  test('reservation endpoint accepte un payload valide', async ({ request, baseURL }) => {
    const today = new Date();
    today.setDate(today.getDate() + 1);

    const response = await request.post(`${baseURL}/api/reservations`, {
      data: {
        firstName: 'Test',
        lastName: 'Automatique',
        email: 'test@example.com',
        phone: '0612345678',
        package: 'classic',
        people: 2,
        date: today.toISOString().split('T')[0],
        total: 200,
        deposit: 60,
      },
    });

    expect(response.status()).toBe(201);
  });
});
