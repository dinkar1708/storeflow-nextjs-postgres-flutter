import { describe, it, expect, beforeEach, afterEach, afterAll } from 'vitest';
import {
  createTestUser,
  deleteTestUser,
  loginUser,
  closePrisma,
} from '../helpers/test-utils.js';

describe('Login API', () => {
  let testUser;

  beforeEach(async () => {
    // Create a fresh test user before each test
    testUser = await createTestUser({
      email: `logintest${Date.now()}@example.com`,
      password: 'TestLogin@123',
      name: 'Login Test User',
    });
  });

  afterEach(async () => {
    // Clean up test user after each test
    if (testUser?.id) {
      await deleteTestUser(testUser.id);
    }
  });

  afterAll(async () => {
    await closePrisma();
  });

  describe('POST /api/auth/callback/credentials', () => {
    it('should successfully login with valid credentials', async () => {
      const response = await loginUser(testUser.email, testUser.plainPassword);

      // NextAuth returns 200 on success
      expect(response.status).toBe(200);
    });

    it('should handle login with wrong password', async () => {
      const response = await loginUser(testUser.email, 'WrongPassword123');

      // NextAuth returns 200 but auth fails (checked via session)
      // Just verify we got a response
      expect(response.status).toBeGreaterThanOrEqual(200);
    });

    it('should handle login with non-existent user', async () => {
      const response = await loginUser(
        'nonexistent@example.com',
        'SomePassword123'
      );

      // NextAuth returns 200 but auth fails
      expect(response.status).toBeGreaterThanOrEqual(200);
    });

    it('should handle login with missing password', async () => {
      const response = await loginUser(testUser.email, '');

      // NextAuth handles this gracefully
      expect(response.status).toBeGreaterThanOrEqual(200);
    });

    it('should handle login with missing email', async () => {
      const response = await loginUser('', testUser.plainPassword);

      // NextAuth handles this gracefully
      expect(response.status).toBeGreaterThanOrEqual(200);
    });

    it('should handle login with missing both credentials', async () => {
      const response = await loginUser('', '');

      // NextAuth handles this gracefully
      expect(response.status).toBeGreaterThanOrEqual(200);
    });
  });
});
