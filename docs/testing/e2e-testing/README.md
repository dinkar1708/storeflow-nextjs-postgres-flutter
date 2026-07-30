# E2E Testing Documentation

End-to-end testing documentation for the StoreFlow e-commerce platform.

---

## Overview

StoreFlow uses **Playwright** for comprehensive E2E testing, covering complete user journeys from authentication to checkout.

**Current Status:** 72/88 tests passing (82%)

---

## Documents in this Folder

1. **[running-tests.md](./running-tests.md)** - Complete guide to running E2E tests
   - Quick start commands
   - Test modes (headless, headed, UI, debug)
   - Database setup
   - Troubleshooting guide

2. **[test-coverage.md](./test-coverage.md)** - Test coverage analysis
   - Features covered by E2E tests
   - Features not covered
   - Test statistics
   - Recommendations for new tests

3. **[writing-e2e-tests.md](./writing-e2e-tests.md)** - Guide for writing E2E tests
   - Best practices
   - Common patterns
   - Page object model
   - Test fixtures

---

## Quick Start

### One Command (Easiest)

```bash
cd api-web
npm run test:e2e
```

This automatically:
- Starts dev server on port 3001
- Runs all E2E tests
- Generates HTML report

### Visual Mode (Best for Debugging)

```bash
cd api-web
npm run test:e2e:ui
```

Interactive UI to run and debug tests visually.

### Watch Browser (Development)

```bash
cd api-web
npm run test:e2e:headed
```

See the browser while tests run.

---

## Test Files Location

All E2E test files are in: `api-web/e2e/`

```
api-web/e2e/
├── 01-authentication.spec.ts           # Auth flows (8 tests)
├── 02-role-based-access.spec.ts        # RBAC (36 tests)
├── 03-products.spec.ts                 # Product management (12 tests)
├── 04-categories.spec.ts               # Category management (12 tests)
├── 05-orders.spec.ts                   # Order workflows (14 tests)
├── 07-wishlist.spec.ts                 # Wishlist operations (6 tests)
├── global-setup.ts                     # Global test setup
└── helpers/
    ├── auth-helpers.ts                 # Login/auth utilities
    └── test-data.ts                    # Test users & data
```

---

## What's Tested

### ✅ Core Features (72 tests passing)

| Feature | Tests | Status | Description |
|---------|-------|--------|-------------|
| **Authentication** | 5/8 | ⚠️ Partial | Login, session management |
| **RBAC** | 36/36 | ✅ Complete | Role-based page access control |
| **Products** | 11/12 | ⚠️ Partial | Browse, search, view details |
| **Categories** | 9/12 | ⚠️ Partial | Category browsing, filtering |
| **Orders** | 12/14 | ⚠️ Partial | Order creation, tracking, status |
| **Wishlist** | 5/6 | ⚠️ Partial | Add/remove wishlist items |

### ⚠️ Partially Tested (13 failures)

Most failures are due to:
- UI validation error messages not matching expected patterns
- Registration form validation specifics
- Admin/Staff specific UI elements
- Wishlist/order page implementation details

### ❌ Not Tested Yet

- Cart functionality
- Checkout flow
- Payment processing
- Analytics dashboard
- User profile management
- Product reviews

---

## Test Users

E2E tests use seeded test users:

```javascript
Customer: customer@storeflow.com / Customer@123
Admin:    admin@storeflow.com    / Admin@123
Staff:    staff@storeflow.com    / Staff@123
```

**Setup:**
```bash
npm run db:seed  # One-time setup
```

---

## Test Architecture

### Test Execution Flow

```
Playwright Test Runner
    ↓
Global Setup (global-setup.ts)
    ↓ Verifies dev server running
    ↓ Checks test users exist
    ↓
Individual Test Specs
    ↓ Navigate to pages
    ↓ Interact with UI
    ↓ Verify outcomes
    ↓
Test Results & Reports
```

### Page Object Pattern

```typescript
// Good: Reusable helper
async function loginAsCustomer(page) {
  await page.goto('/login');
  await page.fill('input[name="email"]', TEST_USERS.customer.email);
  await page.fill('input[name="password"]', TEST_USERS.customer.password);
  await page.click('button[type="submit"]');
}

// Usage in test
test('should access customer dashboard', async ({ page }) => {
  await loginAsCustomer(page);
  await expect(page).toHaveURL(/customer/);
});
```

---

## Running Tests

### All Tests

```bash
npm run test:e2e              # Headless (CI mode)
npm run test:e2e:ui           # Visual debugging UI
npm run test:e2e:headed       # See browser
npm run test:e2e:debug        # Debug mode
```

### Specific Tests

```bash
# Run specific file
npx playwright test e2e/01-authentication.spec.ts

# Run tests matching pattern
npx playwright test --grep "login"

# Run single test
npx playwright test --grep "should successfully login"

# Run in specific browser
npx playwright test --project=chromium
```

### Debug Specific Test

```bash
npx playwright test --debug --grep "should successfully login"
```

---

## Test Reports

### View HTML Report

```bash
npx playwright show-report
```

Opens interactive HTML report in browser.

### Report Locations

```
api-web/
├── playwright-report/       # HTML reports
├── test-results/           # Screenshots, videos, traces
│   ├── *.png              # Failure screenshots
│   ├── *.webm             # Test videos
│   └── error-context.md   # Error details
```

### Artifacts

Playwright automatically captures on failure:
- Screenshots
- Videos
- Page traces
- Network logs

---

## Configuration

E2E test configuration: `api-web/playwright.config.ts`

```typescript
export default defineConfig({
  testDir: './e2e',
  baseURL: 'http://localhost:3001',

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
  },

  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
```

---

## Best Practices

### 1. Use Descriptive Test Names

```typescript
// Good
test('should successfully login with valid customer credentials', async ({ page }) => {
  // ...
});

// Bad
test('login test', async ({ page }) => {
  // ...
});
```

### 2. Group Related Tests

```typescript
test.describe('Feature: Authentication', () => {
  test.describe('User Login', () => {
    test('should login with valid credentials', async ({ page }) => {
      // ...
    });

    test('should show error with invalid credentials', async ({ page }) => {
      // ...
    });
  });
});
```

### 3. Use Helper Functions

```typescript
// helpers/auth-helpers.ts
export async function loginAsRole(page: Page, role: 'customer' | 'admin' | 'staff') {
  const user = TEST_USERS[role];
  await page.goto('/login');
  await page.fill('input[name="email"]', user.email);
  await page.fill('input[name="password"]', user.password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/dashboard|customer|admin/);
}
```

### 4. Wait for Elements Properly

```typescript
// Good: Explicit wait
await page.waitForSelector('text=Products loaded');

// Bad: Hard wait
await page.waitForTimeout(1000);
```

### 5. Use Data Test IDs

```typescript
// Component
<button data-testid="add-to-cart">Add to Cart</button>

// Test
await page.click('[data-testid="add-to-cart"]');
```

---

## Troubleshooting

### Tests Timeout

**Increase timeout:**
```typescript
test('slow test', async ({ page }) => {
  test.setTimeout(60000); // 60 seconds
  // ...
});
```

### Element Not Found

**Use better selectors:**
```typescript
// Good: Specific and stable
await page.click('[data-testid="login-button"]');
await page.locator('button:has-text("Login")').click();

// Bad: Fragile
await page.click('button');
await page.click('.btn-primary');
```

### Flaky Tests

**Add proper waits:**
```typescript
// Wait for network idle
await page.waitForLoadState('networkidle');

// Wait for specific element
await page.waitForSelector('text=Loaded');

// Wait for navigation
await page.waitForURL(/dashboard/);
```

### Debug Failed Test

```bash
# Run with headed browser and pause
npx playwright test --headed --debug --grep "failing test"

# View trace
npx playwright show-trace test-results/.../trace.zip
```

---

## CI/CD Integration

### GitHub Actions (Example)

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3

      - name: Install dependencies
        run: npm ci
        working-directory: api-web

      - name: Install Playwright
        run: npx playwright install chromium --with-deps
        working-directory: api-web

      - name: Run E2E tests
        run: npm run test:e2e
        working-directory: api-web
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

      - name: Upload report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: api-web/playwright-report/
```

---

## Next Steps

### Improve Coverage

1. Add cart E2E tests
2. Add checkout flow tests
3. Add analytics dashboard tests
4. Add user profile tests
5. Fix 13 failing UI validation tests

### Enhance Tests

1. Add visual regression testing
2. Add API mocking for external services
3. Add performance testing
4. Add accessibility testing

---

## Learn More

- **[Playwright Documentation](https://playwright.dev)**
- **[Best Practices](https://playwright.dev/docs/best-practices)**
- **[Test Fixtures](https://playwright.dev/docs/test-fixtures)**
- **[Page Object Model](https://playwright.dev/docs/pom)**

---

**Last Updated:** 2026-07-30

**Test Status:** 72/88 passing (82%)
