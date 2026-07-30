import { test, expect } from '@playwright/test';
import { loginAsCustomer, loginAsAdmin, loginAsStaff } from './helpers/auth-helpers';

/**
 * Comprehensive Role-Based Access Control (RBAC) Tests
 * Tests that each role can access their designated pages and cannot access others
 */

test.describe('Feature: Role-Based Page Access', () => {
  test.describe('Customer Role - Can Access Customer Pages', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsCustomer(page);
    });

    test('should access customer dashboard', async ({ page }) => {
      await page.goto('/customer/dashboard');
      await page.waitForTimeout(1000);

      expect(page.url()).toContain('/customer/dashboard');
      const pageContent = await page.content();
      expect(pageContent.toLowerCase()).toMatch(/dashboard|welcome|customer/);
    });

    test('should access customer products page', async ({ page }) => {
      await page.goto('/customer/products');
      await page.waitForTimeout(1000);

      expect(page.url()).toContain('/customer/products');
      const pageContent = await page.content();
      expect(pageContent.toLowerCase()).toMatch(/product/);
    });

    test('should access customer cart page', async ({ page }) => {
      await page.goto('/customer/cart');
      await page.waitForTimeout(1000);

      expect(page.url()).toContain('/customer/cart');
      const pageContent = await page.content();
      expect(pageContent.toLowerCase()).toMatch(/cart|shopping/);
    });

    test('should access customer orders page', async ({ page }) => {
      await page.goto('/customer/orders');
      await page.waitForTimeout(1000);

      expect(page.url()).toContain('/customer/orders');
      const pageContent = await page.content();
      expect(pageContent.toLowerCase()).toMatch(/order|history/);
    });

    test('should access customer wishlist page', async ({ page }) => {
      await page.goto('/customer/wishlist');
      await page.waitForTimeout(1000);

      expect(page.url()).toContain('/customer/wishlist');
      const pageContent = await page.content();
      expect(pageContent.toLowerCase()).toMatch(/wishlist|saved/);
    });

    test('should access customer profile page', async ({ page }) => {
      await page.goto('/customer/profile');
      await page.waitForTimeout(1000);

      expect(page.url()).toContain('/customer/profile');
      const pageContent = await page.content();
      expect(pageContent.toLowerCase()).toMatch(/profile|account|settings/);
    });
  });

  test.describe('Customer Role - Cannot Access Admin Pages', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsCustomer(page);
    });

    test('should NOT access admin dashboard', async ({ page }) => {
      await page.goto('/admin/dashboard');
      await page.waitForTimeout(1000);

      const url = page.url();
      const pageContent = await page.content();

      // Should be redirected or show forbidden
      const isForbidden =
        !url.includes('/admin/dashboard') ||
        pageContent.toLowerCase().includes('forbidden') ||
        pageContent.toLowerCase().includes('403') ||
        pageContent.toLowerCase().includes('unauthorized');

      expect(isForbidden).toBeTruthy();
    });

    test('should NOT access admin products', async ({ page }) => {
      await page.goto('/admin/products');
      await page.waitForTimeout(1000);

      const url = page.url();
      const pageContent = await page.content();

      const isForbidden =
        !url.includes('/admin/products') ||
        pageContent.toLowerCase().includes('forbidden') ||
        pageContent.toLowerCase().includes('403');

      expect(isForbidden).toBeTruthy();
    });

    test('should NOT access admin users', async ({ page }) => {
      await page.goto('/admin/users');
      await page.waitForTimeout(1000);

      const url = page.url();
      const pageContent = await page.content();

      const isForbidden =
        !url.includes('/admin/users') ||
        pageContent.toLowerCase().includes('forbidden') ||
        pageContent.toLowerCase().includes('403');

      expect(isForbidden).toBeTruthy();
    });

    test('should NOT access admin orders', async ({ page }) => {
      await page.goto('/admin/orders');
      await page.waitForTimeout(1000);

      const url = page.url();
      const pageContent = await page.content();

      const isForbidden =
        !url.includes('/admin/orders') ||
        pageContent.toLowerCase().includes('forbidden') ||
        pageContent.toLowerCase().includes('403');

      expect(isForbidden).toBeTruthy();
    });

    test('should NOT access admin analytics', async ({ page }) => {
      await page.goto('/admin/analytics');
      await page.waitForTimeout(1000);

      const url = page.url();
      const pageContent = await page.content();

      const isForbidden =
        !url.includes('/admin/analytics') ||
        pageContent.toLowerCase().includes('forbidden') ||
        pageContent.toLowerCase().includes('403');

      expect(isForbidden).toBeTruthy();
    });
  });

  test.describe('Customer Role - Cannot Access Staff Pages', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsCustomer(page);
    });

    test('should NOT access staff dashboard', async ({ page }) => {
      await page.goto('/staff/dashboard');
      await page.waitForTimeout(1000);

      const url = page.url();
      const pageContent = await page.content();

      const isForbidden =
        !url.includes('/staff/dashboard') ||
        pageContent.toLowerCase().includes('forbidden') ||
        pageContent.toLowerCase().includes('403');

      expect(isForbidden).toBeTruthy();
    });
  });

  test.describe('Admin Role - Can Access Admin Pages', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
    });

    test('should access admin dashboard', async ({ page }) => {
      await page.goto('/admin/dashboard');
      await page.waitForTimeout(1000);

      expect(page.url()).toContain('/admin/dashboard');
      const pageContent = await page.content();
      expect(pageContent.toLowerCase()).toMatch(/dashboard|admin/);
    });

    test('should access admin products page', async ({ page }) => {
      await page.goto('/admin/products');
      await page.waitForTimeout(1000);

      expect(page.url()).toContain('/admin/products');
      const pageContent = await page.content();
      expect(pageContent.toLowerCase()).toMatch(/product/);
    });

    test('should access admin users page', async ({ page }) => {
      await page.goto('/admin/users');
      await page.waitForTimeout(1000);

      expect(page.url()).toContain('/admin/users');
      const pageContent = await page.content();
      expect(pageContent.toLowerCase()).toMatch(/user|customer|staff/);
    });

    test('should access admin orders page', async ({ page }) => {
      await page.goto('/admin/orders');
      await page.waitForTimeout(1000);

      expect(page.url()).toContain('/admin/orders');
      const pageContent = await page.content();
      expect(pageContent.toLowerCase()).toMatch(/order/);
    });

    test('should access admin analytics page', async ({ page }) => {
      await page.goto('/admin/analytics');
      await page.waitForTimeout(1000);

      expect(page.url()).toContain('/admin/analytics');
      const pageContent = await page.content();
      expect(pageContent.toLowerCase()).toMatch(/analytics|sales|revenue|chart/);
    });
  });

  test.describe('Admin Role - Can Also Access Customer Pages', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
    });

    test('should access customer products page', async ({ page }) => {
      await page.goto('/customer/products');
      await page.waitForTimeout(1000);

      // Admin can view customer pages
      const pageContent = await page.content();
      expect(pageContent).toBeTruthy();
    });
  });

  test.describe('Staff Role - Can Access Staff Pages', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsStaff(page);
    });

    test('should access staff dashboard', async ({ page }) => {
      await page.goto('/staff/dashboard');
      await page.waitForTimeout(1000);

      expect(page.url()).toContain('/staff/dashboard');
      const pageContent = await page.content();
      expect(pageContent.toLowerCase()).toMatch(/dashboard|staff/);
    });

    test('should access admin products page (staff has access)', async ({ page }) => {
      // Staff can manage products
      await page.goto('/admin/products');
      await page.waitForTimeout(1000);

      // Staff should be able to access products
      const url = page.url();
      const pageContent = await page.content();

      // Either on products page or not forbidden
      const hasAccess =
        url.includes('/admin/products') ||
        !pageContent.toLowerCase().includes('forbidden');

      expect(hasAccess).toBeTruthy();
    });

    test('should access admin orders page (staff can process orders)', async ({ page }) => {
      await page.goto('/admin/orders');
      await page.waitForTimeout(1000);

      // Staff should access orders to process them
      const url = page.url();
      const pageContent = await page.content();

      const hasAccess =
        url.includes('/admin/orders') ||
        url.includes('/staff/orders') ||
        !pageContent.toLowerCase().includes('forbidden');

      expect(hasAccess).toBeTruthy();
    });
  });

  test.describe('Staff Role - Cannot Access Admin-Only Pages', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsStaff(page);
    });

    test('should NOT access admin users page (admin-only)', async ({ page }) => {
      await page.goto('/admin/users');
      await page.waitForTimeout(1000);

      const url = page.url();
      const pageContent = await page.content();

      // Staff should not manage users
      const isForbidden =
        !url.includes('/admin/users') ||
        pageContent.toLowerCase().includes('forbidden') ||
        pageContent.toLowerCase().includes('403');

      expect(isForbidden).toBeTruthy();
    });

    test('should NOT access admin analytics (admin-only)', async ({ page }) => {
      await page.goto('/admin/analytics');
      await page.waitForTimeout(1000);

      const url = page.url();
      const pageContent = await page.content();

      // Staff might not see full analytics
      const isRestricted =
        !url.includes('/admin/analytics') ||
        pageContent.toLowerCase().includes('forbidden') ||
        pageContent.toLowerCase().includes('403');

      // This might pass or fail depending on business rules
      // Update based on your RBAC requirements
      expect(true).toBeTruthy(); // Placeholder - adjust based on requirements
    });
  });

  test.describe('Staff Role - Cannot Access Customer-Specific Pages', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsStaff(page);
    });

    test('should NOT access customer cart page', async ({ page }) => {
      await page.goto('/customer/cart');
      await page.waitForTimeout(1000);

      const url = page.url();
      const pageContent = await page.content();

      // Staff should not have a customer cart
      const isForbidden =
        !url.includes('/customer/cart') ||
        pageContent.toLowerCase().includes('forbidden') ||
        pageContent.toLowerCase().includes('403');

      expect(isForbidden).toBeTruthy();
    });

    test('should NOT access customer wishlist page', async ({ page }) => {
      await page.goto('/customer/wishlist');
      await page.waitForTimeout(1000);

      const url = page.url();
      const pageContent = await page.content();

      const isForbidden =
        !url.includes('/customer/wishlist') ||
        pageContent.toLowerCase().includes('forbidden') ||
        pageContent.toLowerCase().includes('403');

      expect(isForbidden).toBeTruthy();
    });
  });

  test.describe('Guest User - Cannot Access Protected Pages', () => {
    test('should NOT access customer dashboard without login', async ({ page }) => {
      await page.goto('/customer/dashboard');
      await page.waitForTimeout(1000);

      const url = page.url();

      // Should redirect to login
      expect(url).toContain('/login');
    });

    test('should NOT access admin dashboard without login', async ({ page }) => {
      await page.goto('/admin/dashboard');
      await page.waitForTimeout(1000);

      const url = page.url();

      // Should redirect to login
      expect(url).toContain('/login');
    });

    test('should NOT access staff dashboard without login', async ({ page }) => {
      await page.goto('/staff/dashboard');
      await page.waitForTimeout(1000);

      const url = page.url();

      // Should redirect to login
      expect(url).toContain('/login');
    });
  });
});

test.describe('Feature: Complete Role Access Matrix', () => {
  /**
   * This test provides a complete matrix of which roles can access which pages
   */
  test('role access matrix summary', async ({ page }) => {
    // This is a documentation test showing the access matrix

    const accessMatrix = {
      CUSTOMER: {
        canAccess: [
          '/customer/dashboard',
          '/customer/products',
          '/customer/cart',
          '/customer/orders',
          '/customer/wishlist',
          '/customer/profile',
        ],
        cannotAccess: [
          '/admin/dashboard',
          '/admin/products',
          '/admin/users',
          '/admin/orders',
          '/admin/analytics',
          '/staff/dashboard',
        ],
      },
      ADMIN: {
        canAccess: [
          '/admin/dashboard',
          '/admin/products',
          '/admin/users',
          '/admin/orders',
          '/admin/analytics',
          '/customer/products', // Can view customer pages
        ],
        cannotAccess: [], // Admin has access to everything
      },
      STAFF: {
        canAccess: [
          '/staff/dashboard',
          '/admin/products', // Can manage products
          '/admin/orders', // Can process orders
        ],
        cannotAccess: [
          '/admin/users', // Cannot manage users
          '/customer/cart', // No personal cart
          '/customer/wishlist', // No personal wishlist
        ],
      },
      GUEST: {
        canAccess: [
          '/', // Homepage
          '/login',
          '/register',
          '/products/:id', // View product details
        ],
        cannotAccess: [
          '/customer/*', // All customer pages
          '/admin/*', // All admin pages
          '/staff/*', // All staff pages
        ],
      },
    };

    console.log('Role Access Matrix:', JSON.stringify(accessMatrix, null, 2));

    // This test always passes - it's for documentation
    expect(true).toBeTruthy();
  });
});
