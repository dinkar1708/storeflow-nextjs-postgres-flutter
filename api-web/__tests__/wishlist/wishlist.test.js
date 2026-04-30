import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import {
  makeRequest,
  closePrisma,
  createTestUser,
  deleteTestUser,
  jwtApiLogin,
} from '../helpers/test-utils.js';
import { PrismaClient } from '@prisma/client';
import { UserRole } from '../../lib/enums.ts';

const prisma = new PrismaClient();

/**
 * Integration tests for the Wishlist API.
 *
 * Requires:
 *   1. `npm run dev` running on http://localhost:3001
 *   2. Database reachable via DATABASE_URL with the Wishlist model migrated
 *      (`npx prisma migrate dev` after adding the model)
 */
describe('Wishlist API', () => {
  let testCategory;
  let testProduct;
  let outOfStockProduct;
  let inactiveProduct;
  let customer;
  let customerToken;
  let staff;
  let staffToken;

  const authHeaders = (token) => ({ Authorization: `Bearer ${token}` });

  beforeAll(async () => {
    testCategory = await prisma.category.create({
      data: {
        name: 'Wishlist Test Category',
        slug: `wishlist-test-${Date.now()}`,
        description: 'Category used by wishlist tests',
      },
    });

    testProduct = await prisma.product.create({
      data: {
        name: 'Wishlist Test Product',
        description: 'In-stock active product for wishlist tests',
        price: 49.99,
        stock: 10,
        sku: `WISH-${Date.now()}-A`,
        categoryId: testCategory.id,
        images: [],
        isActive: true,
      },
    });

    outOfStockProduct = await prisma.product.create({
      data: {
        name: 'Wishlist Out-of-Stock Product',
        description: 'Stock=0 active product',
        price: 19.99,
        stock: 0,
        sku: `WISH-${Date.now()}-B`,
        categoryId: testCategory.id,
        images: [],
        isActive: true,
      },
    });

    inactiveProduct = await prisma.product.create({
      data: {
        name: 'Wishlist Inactive Product',
        description: 'Inactive product',
        price: 9.99,
        stock: 5,
        sku: `WISH-${Date.now()}-C`,
        categoryId: testCategory.id,
        images: [],
        isActive: false,
      },
    });

    customer = await createTestUser({
      email: `wishlist-customer-${Date.now()}@example.com`,
      role: UserRole.CUSTOMER,
    });
    staff = await createTestUser({
      email: `wishlist-staff-${Date.now()}@example.com`,
      role: UserRole.STAFF,
    });

    const customerLogin = await jwtApiLogin(customer.email, customer.plainPassword);
    customerToken = customerLogin.data?.token;
    if (!customerToken) {
      throw new Error(
        `Customer login failed (status ${customerLogin.status}). Is the dev server running on :3001?`
      );
    }

    const staffLogin = await jwtApiLogin(staff.email, staff.plainPassword);
    staffToken = staffLogin.data?.token;
  });

  beforeEach(async () => {
    // Each test starts with an empty wishlist for the customer
    await prisma.wishlist.deleteMany({ where: { userId: customer.id } });
  });

  afterAll(async () => {
    await prisma.wishlist.deleteMany({
      where: { userId: { in: [customer.id, staff.id] } },
    });
    await prisma.order.deleteMany({ where: { userId: customer.id } });
    await deleteTestUser(customer.id);
    await deleteTestUser(staff.id);
    await prisma.product.deleteMany({
      where: { id: { in: [testProduct.id, outOfStockProduct.id, inactiveProduct.id] } },
    });
    await prisma.category.delete({ where: { id: testCategory.id } });
    await closePrisma();
  });

  describe('Auth requirements', () => {
    it('GET /api/wishlist returns 403 without auth', async () => {
      const res = await makeRequest('/api/wishlist', { method: 'GET' });
      expect(res.status).toBe(403);
      expect(res.data).toHaveProperty('error');
    });

    it('POST /api/wishlist returns 403 without auth', async () => {
      const res = await makeRequest('/api/wishlist', {
        method: 'POST',
        body: JSON.stringify({ productId: testProduct.id }),
      });
      expect(res.status).toBe(403);
    });

    it('DELETE /api/wishlist/{productId} returns 403 without auth', async () => {
      const res = await makeRequest(`/api/wishlist/${testProduct.id}`, {
        method: 'DELETE',
      });
      expect(res.status).toBe(403);
    });

    it('blocks non-customer roles (STAFF) from the wishlist', async () => {
      if (!staffToken) return; // skip if staff login failed
      const res = await makeRequest('/api/wishlist', {
        method: 'GET',
        headers: authHeaders(staffToken),
      });
      expect(res.status).toBe(403);
    });
  });

  describe('POST /api/wishlist — add to wishlist', () => {
    it('adds an active in-stock product (201)', async () => {
      const res = await makeRequest('/api/wishlist', {
        method: 'POST',
        headers: authHeaders(customerToken),
        body: JSON.stringify({ productId: testProduct.id }),
      });

      expect(res.status).toBe(201);
      expect(res.data.item).toBeDefined();
      expect(res.data.item.productId).toBe(testProduct.id);
      expect(res.data.item.userId).toBe(customer.id);
      expect(res.data.item.product).toBeDefined();
      expect(res.data.item.product.category).toBeDefined();
    });

    it('returns 200 (not duplicated) when the same product is added twice', async () => {
      const first = await makeRequest('/api/wishlist', {
        method: 'POST',
        headers: authHeaders(customerToken),
        body: JSON.stringify({ productId: testProduct.id }),
      });
      expect(first.status).toBe(201);

      const second = await makeRequest('/api/wishlist', {
        method: 'POST',
        headers: authHeaders(customerToken),
        body: JSON.stringify({ productId: testProduct.id }),
      });
      expect(second.status).toBe(200);
      expect(second.data.item.id).toBe(first.data.item.id);

      const count = await prisma.wishlist.count({
        where: { userId: customer.id, productId: testProduct.id },
      });
      expect(count).toBe(1);
    });

    it('returns 400 when productId is missing', async () => {
      const res = await makeRequest('/api/wishlist', {
        method: 'POST',
        headers: authHeaders(customerToken),
        body: JSON.stringify({}),
      });
      expect(res.status).toBe(400);
      expect(res.data).toHaveProperty('error');
    });

    it('returns 400 when product does not exist', async () => {
      const res = await makeRequest('/api/wishlist', {
        method: 'POST',
        headers: authHeaders(customerToken),
        body: JSON.stringify({ productId: 'does-not-exist-id' }),
      });
      expect(res.status).toBe(400);
    });

    it('rejects an inactive product (400)', async () => {
      const res = await makeRequest('/api/wishlist', {
        method: 'POST',
        headers: authHeaders(customerToken),
        body: JSON.stringify({ productId: inactiveProduct.id }),
      });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/wishlist — list', () => {
    it('returns an empty list for a customer with no items', async () => {
      const res = await makeRequest('/api/wishlist', {
        method: 'GET',
        headers: authHeaders(customerToken),
      });
      expect(res.status).toBe(200);
      expect(Array.isArray(res.data.items)).toBe(true);
      expect(res.data.items.length).toBe(0);
    });

    it('returns the customer’s wishlist items with product + category populated', async () => {
      await prisma.wishlist.create({
        data: { userId: customer.id, productId: testProduct.id },
      });

      const res = await makeRequest('/api/wishlist', {
        method: 'GET',
        headers: authHeaders(customerToken),
      });
      expect(res.status).toBe(200);
      expect(res.data.items.length).toBe(1);
      const item = res.data.items[0];
      expect(item.productId).toBe(testProduct.id);
      expect(item.product.name).toBe(testProduct.name);
      expect(item.product.category.name).toBe(testCategory.name);
    });

    it('does not leak other customers’ wishlist items', async () => {
      await prisma.wishlist.create({
        data: { userId: customer.id, productId: testProduct.id },
      });

      const otherCustomer = await createTestUser({
        email: `wishlist-other-${Date.now()}@example.com`,
        role: UserRole.CUSTOMER,
      });
      try {
        await prisma.wishlist.create({
          data: { userId: otherCustomer.id, productId: outOfStockProduct.id },
        });
        const otherLogin = await jwtApiLogin(
          otherCustomer.email,
          otherCustomer.plainPassword
        );
        const otherToken = otherLogin.data?.token;

        const res = await makeRequest('/api/wishlist', {
          method: 'GET',
          headers: authHeaders(otherToken),
        });
        expect(res.status).toBe(200);
        expect(res.data.items.length).toBe(1);
        expect(res.data.items[0].productId).toBe(outOfStockProduct.id);
      } finally {
        await prisma.wishlist.deleteMany({ where: { userId: otherCustomer.id } });
        await deleteTestUser(otherCustomer.id);
      }
    });
  });

  describe('DELETE /api/wishlist/{productId} — remove', () => {
    it('removes an existing wishlist item (200)', async () => {
      await prisma.wishlist.create({
        data: { userId: customer.id, productId: testProduct.id },
      });

      const res = await makeRequest(`/api/wishlist/${testProduct.id}`, {
        method: 'DELETE',
        headers: authHeaders(customerToken),
      });
      expect(res.status).toBe(200);

      const remaining = await prisma.wishlist.count({
        where: { userId: customer.id, productId: testProduct.id },
      });
      expect(remaining).toBe(0);
    });

    it('returns 404 when the item is not in the customer’s wishlist', async () => {
      const res = await makeRequest(`/api/wishlist/${testProduct.id}`, {
        method: 'DELETE',
        headers: authHeaders(customerToken),
      });
      expect(res.status).toBe(404);
    });
  });

  describe('Place order from wishlist', () => {
    it('places an order using a wishlisted product and the entry can be cleaned up', async () => {
      await prisma.wishlist.create({
        data: { userId: customer.id, productId: testProduct.id },
      });

      const price = Number(testProduct.price);
      const orderRes = await makeRequest('/api/orders', {
        method: 'POST',
        headers: authHeaders(customerToken),
        body: JSON.stringify({
          items: [{ productId: testProduct.id, quantity: 1, price }],
          total: price,
        }),
      });
      expect(orderRes.status).toBe(201);
      expect(orderRes.data.order.items[0].productId).toBe(testProduct.id);

      const removeRes = await makeRequest(`/api/wishlist/${testProduct.id}`, {
        method: 'DELETE',
        headers: authHeaders(customerToken),
      });
      expect(removeRes.status).toBe(200);

      const remaining = await prisma.wishlist.count({
        where: { userId: customer.id, productId: testProduct.id },
      });
      expect(remaining).toBe(0);
    });
  });
});
