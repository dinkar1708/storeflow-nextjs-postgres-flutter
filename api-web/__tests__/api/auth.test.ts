import { describe, it, expect } from 'vitest';

describe('Auth API Tests', () => {
  const BASE_URL = 'http://localhost:3000';

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: `test${Date.now()}@example.com`,
          password: 'Test@1234',
          name: 'Test User',
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.message).toBe('User created successfully');
      expect(data.userId).toBeDefined();
    });

    it('should fail with duplicate email', async () => {
      const email = 'duplicate@example.com';

      // First registration
      await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password: 'Test@1234',
          name: 'Test User',
        }),
      });

      // Duplicate registration
      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password: 'Test@1234',
          name: 'Test User 2',
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Email already registered');
    });

    it('should fail with missing fields', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          // missing password and name
        }),
      });

      expect(response.status).toBe(500);
    });
  });

  describe('POST /api/auth/[...nextauth] - Login', () => {
    it('should login with valid credentials', async () => {
      // First create a user
      const email = `login${Date.now()}@example.com`;
      await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password: 'Test@1234',
          name: 'Login User',
        }),
      });

      // Then try to login
      const response = await fetch(
        `${BASE_URL}/api/auth/callback/credentials`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password: 'Test@1234',
          }),
        }
      );

      expect(response.status).not.toBe(401);
    });
  });
});
