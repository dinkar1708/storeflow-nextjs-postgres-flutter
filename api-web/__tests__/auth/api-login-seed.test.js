import { describe, it, expect, afterAll } from 'vitest';
import { jwtApiLogin, closePrisma } from '../helpers/test-utils.js';
import { DEMO_SEED_ACCOUNTS } from './demo-seed-credentials.js';

/**
 * Integration tests: requires
 *   1. `npm run db:seed` (creates users from TEST_LOGIN.md)
 *   2. `npm run dev` (Next on http://localhost:3001)
 */
describe('POST /api/auth/login — TEST_LOGIN seed accounts', () => {
  afterAll(async () => {
    await closePrisma();
  });

  it.each(DEMO_SEED_ACCOUNTS)(
    '200 + token for $role — $email',
    async ({ email, password, role }) => {
      let res;
      try {
        res = await jwtApiLogin(email, password);
      } catch (e) {
        throw new Error(
          `Cannot reach API at http://localhost:3001 — start api-web with \`npm run dev\` (${e?.message || e})`
        );
      }

      expect(res.status, JSON.stringify(res.data)).toBe(200);
      expect(res.data?.token, 'JWT token present').toBeTruthy();
      expect(typeof res.data.token).toBe('string');
      expect(res.data?.user?.email).toBe(email);
      expect(res.data?.user?.role).toBe(role);
      expect(res.data?.user?.id).toBeTruthy();
    }
  );

  it('401 for wrong password (customer@storeflow.com)', async () => {
    let res;
    try {
      res = await jwtApiLogin('customer@storeflow.com', 'WrongPassword@999');
    } catch (e) {
      throw new Error(
        `Cannot reach API at http://localhost:3001 — start api-web with \`npm run dev\` (${e?.message || e})`
      );
    }
    expect(res.status).toBe(401);
  });
});
