/**
 * Test data and utilities for E2E tests
 *
 * Uses seed data from prisma/seed.ts
 */

/**
 * Test users from database seed
 * Password pattern: Role@123 (e.g., Customer@123, Admin@123, Staff@123)
 */
export const TEST_USERS = {
  customer: {
    email: 'customer@storeflow.com',
    password: 'Customer@123',
    name: 'Customer User',
    role: 'CUSTOMER',
  },
  admin: {
    email: 'admin@storeflow.com',
    password: 'Admin@123',
    name: 'System Admin',
    role: 'ADMIN',
  },
  staff: {
    email: 'staff@storeflow.com',
    password: 'Staff@123',
    name: 'Staff User',
    role: 'STAFF',
  },
};

export const TEST_PRODUCT = {
  name: 'E2E Test Product',
  description: 'This is a test product for E2E testing',
  price: 99.99,
  stock: 100,
  sku: `TEST-${Date.now()}`,
};

export function generateUniqueEmail(prefix: string = 'test'): string {
  return `${prefix}-${Date.now()}@test.com`;
}

export function generateUniqueSKU(prefix: string = 'SKU'): string {
  return `${prefix}-${Date.now()}`;
}
