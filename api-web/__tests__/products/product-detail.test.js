import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { makeRequest, closePrisma } from '../helpers/test-utils.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Product Detail API', () => {
  let testCategory;
  let testProduct;

  beforeAll(async () => {
    // Create test category
    testCategory = await prisma.category.create({
      data: {
        name: 'Test Detail Category',
        slug: `test-detail-${Date.now()}`,
        description: 'Category for product detail testing',
      },
    });

    // Create test product
    testProduct = await prisma.product.create({
      data: {
        name: 'Test Product Detail',
        description: 'Product for testing detail endpoint',
        price: 199.99,
        stock: 15,
        sku: `TEST-DETAIL-${Date.now()}`,
        categoryId: testCategory.id,
        images: ['/test-image.jpg'],
        isActive: true,
      },
    });
  });

  afterAll(async () => {
    // Cleanup
    await prisma.product.delete({
      where: { id: testProduct.id },
    });
    await prisma.category.delete({
      where: { id: testCategory.id },
    });
    await closePrisma();
  });

  describe('GET /api/products/[id]', () => {
    it('should fetch product by valid ID', async () => {
      const response = await makeRequest(`/api/products/${testProduct.id}`, {
        method: 'GET',
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('product');
      expect(response.data.product.id).toBe(testProduct.id);
    });

    it('should return product with all required fields', async () => {
      const response = await makeRequest(`/api/products/${testProduct.id}`, {
        method: 'GET',
      });

      expect(response.status).toBe(200);
      const product = response.data.product;

      // Check all required fields exist
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('description');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('stock');
      expect(product).toHaveProperty('sku');
      expect(product).toHaveProperty('isActive');
      expect(product).toHaveProperty('category');
    });

    it('should include category information', async () => {
      const response = await makeRequest(`/api/products/${testProduct.id}`, {
        method: 'GET',
      });

      expect(response.status).toBe(200);
      const category = response.data.product.category;

      expect(category).toHaveProperty('id');
      expect(category).toHaveProperty('name');
      expect(category.id).toBe(testCategory.id);
      expect(category.name).toBe(testCategory.name);
    });

    it('should return correct product data', async () => {
      const response = await makeRequest(`/api/products/${testProduct.id}`, {
        method: 'GET',
      });

      expect(response.status).toBe(200);
      const product = response.data.product;

      expect(product.name).toBe('Test Product Detail');
      expect(product.description).toBe('Product for testing detail endpoint');
      expect(product.price).toBe('199.99');
      expect(product.stock).toBe(15);
      expect(product.isActive).toBe(true);
    });

    it('should return 404 for non-existent product ID', async () => {
      const fakeId = 'non-existent-product-id-12345';
      const response = await makeRequest(`/api/products/${fakeId}`, {
        method: 'GET',
      });

      expect(response.status).toBe(404);
      expect(response.data).toHaveProperty('error');
      expect(response.data.error).toBe('Product not found');
    });

    it('should handle invalid product ID format gracefully', async () => {
      const invalidId = 'invalid-id-format!!!';
      const response = await makeRequest(`/api/products/${invalidId}`, {
        method: 'GET',
      });

      // Should return 404 or 500, but not crash
      expect([404, 500]).toContain(response.status);
      expect(response.data).toHaveProperty('error');
    });

    it('should return product images array', async () => {
      const response = await makeRequest(`/api/products/${testProduct.id}`, {
        method: 'GET',
      });

      expect(response.status).toBe(200);
      expect(response.data.product).toHaveProperty('images');
      expect(Array.isArray(response.data.product.images)).toBe(true);
    });

    it('should work for both active and inactive products', async () => {
      // Create inactive product
      const inactiveProduct = await prisma.product.create({
        data: {
          name: 'Inactive Test Product',
          description: 'Inactive product for testing',
          price: 99.99,
          stock: 5,
          sku: `INACTIVE-${Date.now()}`,
          categoryId: testCategory.id,
          images: [],
          isActive: false,
        },
      });

      const response = await makeRequest(`/api/products/${inactiveProduct.id}`, {
        method: 'GET',
      });

      expect(response.status).toBe(200);
      expect(response.data.product.isActive).toBe(false);

      // Cleanup
      await prisma.product.delete({
        where: { id: inactiveProduct.id },
      });
    });
  });
});
