import { Page } from '@playwright/test';
import { TEST_USERS } from './test-data';

/**
 * Authentication helper functions for E2E tests
 */

export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Login helper - handles the full login flow
 */
export async function login(page: Page, credentials: LoginCredentials) {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');

  // Fill login form
  await page.fill('input[name="email"], input[type="email"]', credentials.email);
  await page.fill('input[name="password"], input[type="password"]', credentials.password);

  // Submit form
  await page.click('button[type="submit"]');

  // Wait for navigation or response
  await page.waitForTimeout(2000);
}

/**
 * Login as customer
 */
export async function loginAsCustomer(page: Page) {
  await login(page, TEST_USERS.customer);
}

/**
 * Login as admin
 */
export async function loginAsAdmin(page: Page) {
  await login(page, TEST_USERS.admin);
}

/**
 * Login as staff
 */
export async function loginAsStaff(page: Page) {
  await login(page, TEST_USERS.staff);
}

/**
 * Logout helper
 */
export async function logout(page: Page) {
  // Look for logout button/link
  const logoutButton = page.locator('button:has-text("Logout"), a:has-text("Logout"), button:has-text("Sign out")').first();

  if (await logoutButton.count() > 0) {
    await logoutButton.click();
    await page.waitForTimeout(1000);
  } else {
    // Alternative: navigate to login page (clears session)
    await page.goto('/login');
  }
}

/**
 * Check if user is logged in
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
  const pageContent = await page.content();
  return !pageContent.toLowerCase().includes('login') ||
         pageContent.toLowerCase().includes('dashboard') ||
         pageContent.toLowerCase().includes('logout');
}

/**
 * Wait for successful login redirect
 */
export async function waitForLoginRedirect(page: Page, expectedPath?: string) {
  await page.waitForURL((url) => {
    if (expectedPath) {
      return url.pathname.includes(expectedPath);
    }
    return !url.pathname.includes('/login');
  }, { timeout: 5000 }).catch(() => {
    // Ignore timeout - will be caught by test assertions
  });
}

/**
 * Setup authenticated session using API (faster than UI login)
 */
export async function setupAuthenticatedSession(page: Page, role: 'customer' | 'admin' | 'staff') {
  const user = TEST_USERS[role];

  // Login via API to get session token
  const response = await page.request.post('/api/auth/login', {
    data: {
      email: user.email,
      password: user.password,
    },
  });

  if (!response.ok()) {
    throw new Error(`Failed to authenticate as ${role}: ${response.status()}`);
  }

  // Session should be set in cookies automatically
  await page.goto('/');
  await page.waitForTimeout(1000);
}
