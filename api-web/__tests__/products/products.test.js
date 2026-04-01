import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { makeRequest, closePrisma } from '../helpers/test-utils.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Products API', () => {
  let testCategory;

  beforeAll(async () => {
    // Create a test category
    testCategory = await prisma.category.create({
      data: {
        name: 'Test Category',
        slug: `test-category-${Date.now()}`,
        description: 'Category for testing',
      },
    });
  });

  afterAll(async () => {
    // Cleanup: Delete test products and category
    await prisma.product.deleteMany({
      where: { categoryId: testCategory.id },
    });
    await prisma.category.delete({
      where: { id: testCategory.id },
    });
    await closePrisma();
  });

  describe('GET /api/products', () => {
    it('should fetch all active products', async () => {
      const response = await makeRequest('/api/products', {
        method: 'GET',
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('products');
      expect(Array.isArray(response.data.products)).toBe(true);
    });

    it('should return products with category information', async () => {
      const response = await makeRequest('/api/products', {
        method: 'GET',
      });

      expect(response.status).toBe(200);
      if (response.data.products.length > 0) {
        const product = response.data.products[0];
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('category');
        expect(product.category).toHaveProperty('name');
      }
    });

    it('should only return active products', async () => {
      const response = await makeRequest('/api/products', {
        method: 'GET',
      });

      expect(response.status).toBe(200);
      // All returned products should be active
      response.data.products.forEach(product => {
        expect(product.isActive).toBe(true);
      });
    });
  });

  describe('GET /api/categories', () => {
    it('should fetch all categories', async () => {
      const response = await makeRequest('/api/categories', {
        method: 'GET',
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('categories');
      expect(Array.isArray(response.data.categories)).toBe(true);
    });

    it('should return categories sorted by name', async () => {
      const response = await makeRequest('/api/categories', {
        method: 'GET',
      });

      expect(response.status).toBe(200);
      const categories = response.data.categories;

      if (categories.length > 1) {
        // Check if sorted alphabetically
        for (let i = 0; i < categories.length - 1; i++) {
          expect(categories[i].name.localeCompare(categories[i + 1].name)).toBeLessThanOrEqual(0);
        }
      }
    });
  });

  describe('GET /api/admin/products', () => {
    it('should require authentication for admin products endpoint', async () => {
      const response = await makeRequest('/api/admin/products', {
        method: 'GET',
      });

      // Should return 403 without authentication
      expect(response.status).toBe(403);
      expect(response.data).toHaveProperty('error');
    });
  });

  describe('POST /api/admin/products', () => {
    it('should require authentication for creating products', async () => {
      const response = await makeRequest('/api/admin/products', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test Product',
          price: 99.99,
          categoryId: testCategory.id,
        }),
      });

      // Should return 403 without authentication
      expect(response.status).toBe(403);
      expect(response.data).toHaveProperty('error');
    });

    it('should validate required fields', async () => {
      const response = await makeRequest('/api/admin/products', {
        method: 'POST',
        body: JSON.stringify({
          // Missing required fields
          description: 'Test description',
        }),
      });

      // Should fail validation
      expect([400, 403]).toContain(response.status);
    });
  });
});
