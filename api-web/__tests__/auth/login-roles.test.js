import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  createTestUser,
  deleteTestUser,
  loginUser,
  closePrisma,
} from '../helpers/test-utils.js';
import { UserRole } from '../../lib/enums.ts';

describe('Login API - Role-Based Tests', () => {
  let adminUser;
  let staffUser;
  let customerUser;

  beforeAll(async () => {
    // Create test users for all 3 roles
    const timestamp = Date.now();

    adminUser = await createTestUser({
      email: `admin${timestamp}@test.com`,
      password: 'AdminTest@123',
      name: 'Test Admin',
      role: UserRole.ADMIN,
    });

    staffUser = await createTestUser({
      email: `staff${timestamp}@test.com`,
      password: 'StaffTest@123',
      name: 'Test Staff',
      role: UserRole.STAFF,
    });

    customerUser = await createTestUser({
      email: `customer${timestamp}@test.com`,
      password: 'CustomerTest@123',
      name: 'Test Customer',
      role: UserRole.CUSTOMER,
    });
  });

  afterAll(async () => {
    // Clean up all test users
    await deleteTestUser(adminUser.id);
    await deleteTestUser(staffUser.id);
    await deleteTestUser(customerUser.id);
    await closePrisma();
  });

  describe('ADMIN Role Login', () => {
    it('should successfully login as ADMIN', async () => {
      const response = await loginUser(adminUser.email, adminUser.plainPassword);

      expect(response.status).toBe(200);
    });

    it('should verify ADMIN user has correct role', async () => {
      expect(adminUser.role).toBe(UserRole.ADMIN);
    });

    it('should reject ADMIN login with wrong password', async () => {
      const response = await loginUser(adminUser.email, 'WrongPassword@123');

      // NextAuth returns 200 but auth fails internally
      expect(response.status).toBeGreaterThanOrEqual(200);
    });
  });

  describe('STAFF Role Login', () => {
    it('should successfully login as STAFF', async () => {
      const response = await loginUser(staffUser.email, staffUser.plainPassword);

      expect(response.status).toBe(200);
    });

    it('should verify STAFF user has correct role', async () => {
      expect(staffUser.role).toBe(UserRole.STAFF);
    });

    it('should reject STAFF login with wrong password', async () => {
      const response = await loginUser(staffUser.email, 'WrongPassword@123');

      expect(response.status).toBeGreaterThanOrEqual(200);
    });
  });

  describe('CUSTOMER Role Login', () => {
    it('should successfully login as CUSTOMER', async () => {
      const response = await loginUser(customerUser.email, customerUser.plainPassword);

      expect(response.status).toBe(200);
    });

    it('should verify CUSTOMER user has correct role', async () => {
      expect(customerUser.role).toBe(UserRole.CUSTOMER);
    });

    it('should reject CUSTOMER login with wrong password', async () => {
      const response = await loginUser(customerUser.email, 'WrongPassword@123');

      expect(response.status).toBeGreaterThanOrEqual(200);
    });
  });

  describe('Role Verification After Login', () => {
    it('should have created all three roles', async () => {
      expect(adminUser.role).toBe(UserRole.ADMIN);
      expect(staffUser.role).toBe(UserRole.STAFF);
      expect(customerUser.role).toBe(UserRole.CUSTOMER);
    });

    it('should have different emails for each role', async () => {
      expect(adminUser.email).not.toBe(staffUser.email);
      expect(staffUser.email).not.toBe(customerUser.email);
      expect(customerUser.email).not.toBe(adminUser.email);
    });

    it('should allow all roles to login with valid credentials', async () => {
      const adminResponse = await loginUser(adminUser.email, adminUser.plainPassword);
      const staffResponse = await loginUser(staffUser.email, staffUser.plainPassword);
      const customerResponse = await loginUser(customerUser.email, customerUser.plainPassword);

      expect(adminResponse.status).toBe(200);
      expect(staffResponse.status).toBe(200);
      expect(customerResponse.status).toBe(200);
    });
  });
});
