import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import {
  registerUser,
  deleteTestUserByEmail,
  closePrisma,
} from '../helpers/test-utils.js';

describe('Registration API', () => {
  const testEmails = [];

  // Track emails for cleanup
  function trackEmail(email) {
    testEmails.push(email);
  }

  afterEach(async () => {
    // Clean up all tracked emails after each test
    for (const email of testEmails) {
      await deleteTestUserByEmail(email);
    }
    testEmails.length = 0;
  });

  afterAll(async () => {
    await closePrisma();
  });

  describe('POST /api/auth/register', () => {
    it('should successfully register a new user', async () => {
      const email = `newuser${Date.now()}@example.com`;
      trackEmail(email);

      const response = await registerUser({
        email,
        password: 'SecurePass@123',
        name: 'John Doe',
      });

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('message');
      expect(response.data.user).toHaveProperty('email', email);
      expect(response.data.user).toHaveProperty('name', 'John Doe');
      expect(response.data.user).not.toHaveProperty('password');
    });

    it('should reject duplicate email registration', async () => {
      const email = `duplicate${Date.now()}@test.com`;
      trackEmail(email);

      // First registration
      const firstResponse = await registerUser({
        email,
        password: 'Pass@123',
        name: 'User One',
      });

      expect(firstResponse.status).toBe(201);

      // Attempt duplicate registration
      const secondResponse = await registerUser({
        email,
        password: 'Pass@123',
        name: 'User Two',
      });

      expect(secondResponse.status).toBe(400);
      expect(secondResponse.data).toHaveProperty('error');
      expect(secondResponse.data.error).toMatch(/already exists|already registered/i);
    });

    it('should reject registration with missing password', async () => {
      const email = `nopwd${Date.now()}@example.com`;
      trackEmail(email);

      const response = await registerUser({
        email,
        name: 'Test User',
        // password missing
      });

      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.data).toHaveProperty('error');
    });

    it('should reject registration with missing email', async () => {
      const response = await registerUser({
        password: 'SecurePass@123',
        name: 'Test User',
        // email missing
      });

      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.data).toHaveProperty('error');
    });

    it('should reject registration with invalid email format', async () => {
      const invalidEmail = 'notanemail';

      const response = await registerUser({
        email: invalidEmail,
        password: 'SecurePass@123',
        name: 'Test User',
      });

      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.data).toHaveProperty('error');
    });

    it('should reject registration with weak password', async () => {
      const email = `weakpwd${Date.now()}@example.com`;
      trackEmail(email);

      const response = await registerUser({
        email,
        password: '123', // Too weak
        name: 'Test User',
      });

      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.data).toHaveProperty('error');
    });
  });
});
