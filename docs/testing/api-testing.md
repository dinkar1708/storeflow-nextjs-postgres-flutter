# API Integration Testing Guide

Complete guide to API integration testing for StoreFlow using Vitest + Supertest.

---

## Overview

StoreFlow uses **Vitest** for fast, modern API integration testing with real database operations.

**Current Status:** 63/63 tests passing (100%) ✅

---

## Quick Start

```bash
cd api-web

# Start dev server (required)
npm run dev

# In another terminal - Run all API tests
npm test

# Watch mode (auto-rerun on changes)
npm run test:watch

# Visual UI mode
npm run test:ui
```

---

## Test Architecture

### Stack

- **Test Runner:** Vitest (Vite-native, fast)
- **HTTP Testing:** Supertest (Express-style API testing)
- **Database:** Real PostgreSQL (development database)
- **Auth:** Real NextAuth.js sessions

### Test Pyramid

```
API Integration Tests ← We are here
    ↓
Real Database
Real Authentication
Real Business Logic
```

**What Makes Them "Integration" Tests:**
- ✅ Test full request/response cycle
- ✅ Use real database (not mocked)
- ✅ Test API routes with real Next.js
- ✅ Verify authentication/authorization
- ✅ Test database transactions

---

## What's Tested

### Current Coverage (63 tests)

| Feature | Tests | Status |
|---------|-------|--------|
| **Authentication** | 20 tests | ✅ Complete |
| - Registration | 6 tests | ✅ |
| - Login (all roles) | 12 tests | ✅ |
| - API login with seed data | 8 tests | ✅ |
| **User Roles** | 12 tests | ✅ Complete |
| - Admin login | 4 tests | ✅ |
| - Staff login | 4 tests | ✅ |
| - Customer login | 4 tests | ✅ |
| **Products** | 16 tests | ✅ Complete |
| - Public product listing | 5 tests | ✅ |
| - Product details | 8 tests | ✅ |
| - Admin product management | 3 tests | ✅ |
| **Wishlist** | 15 tests | ✅ Complete |
| - Add/remove items | 8 tests | ✅ |
| - View wishlist | 4 tests | ✅ |
| - Authentication required | 3 tests | ✅ |

### Not Yet Tested

- ❌ Categories API (create, update, delete)
- ❌ Orders API (full CRUD)
- ❌ Cart API operations
- ❌ Analytics endpoints
- ❌ User profile updates
- ❌ Admin user management

---

## Test File Structure

```
api-web/__tests__/
├── auth/
│   ├── api-login-seed.test.js      # Login with seeded users (8 tests)
│   ├── login.test.js               # Basic login tests (6 tests)
│   ├── login-roles.test.js         # Role-based login (12 tests)
│   └── register.test.js            # Registration tests (6 tests)
│
├── products/
│   ├── products.test.js            # Product listing (8 tests)
│   └── product-detail.test.js      # Product details (8 tests)
│
└── wishlist/
    └── wishlist.test.js            # Wishlist operations (15 tests)
```

---

## Writing Tests

### Basic Test Structure

```javascript
import { describe, test, expect } from 'vitest';

describe('Feature Name', () => {
  describe('Specific functionality', () => {
    test('should do something specific', async () => {
      // Arrange
      const testData = { /* ... */ };

      // Act
      const result = await someFunction(testData);

      // Assert
      expect(result).toBe(expected);
    });
  });
});
```

### Testing API Endpoints with Supertest

```javascript
import { describe, test, expect } from 'vitest';

describe('Products API', () => {
  test('should fetch all products', async () => {
    // Make HTTP request to API endpoint
    const response = await fetch('http://localhost:3001/api/products');
    const data = await response.json();

    // Verify response
    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  test('should return product with all required fields', async () => {
    const response = await fetch('http://localhost:3001/api/products');
    const products = await response.json();
    const product = products[0];

    // Verify structure
    expect(product).toHaveProperty('id');
    expect(product).toHaveProperty('name');
    expect(product).toHaveProperty('price');
    expect(product).toHaveProperty('stock');
    expect(product).toHaveProperty('category');
  });
});
```

### Testing Authentication

```javascript
describe('Authentication', () => {
  test('should require authentication for protected endpoint', async () => {
    const response = await fetch('http://localhost:3001/api/admin/products');

    // Should return 401 or redirect to login
    expect([401, 302, 303]).toContain(response.status);
  });

  test('should login successfully with valid credentials', async () => {
    const response = await fetch('http://localhost:3001/api/auth/callback/credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'customer@storeflow.com',
        password: 'Customer@123',
      }),
    });

    expect(response.ok).toBe(true);
  });
});
```

### Testing with Database

```javascript
import { prisma } from '@/lib/prisma';

describe('Product Creation', () => {
  test('should create product in database', async () => {
    // Create product via API
    const productData = {
      name: 'Test Product',
      price: 99.99,
      stock: 10,
      categoryId: 'existing-category-id',
    };

    await fetch('http://localhost:3001/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });

    // Verify in database
    const product = await prisma.product.findFirst({
      where: { name: 'Test Product' },
    });

    expect(product).toBeDefined();
    expect(product.price).toBe(99.99);

    // Cleanup
    await prisma.product.delete({ where: { id: product.id } });
  });
});
```

---

## Best Practices

### 1. Test Naming

```javascript
// Good: Descriptive, action-oriented
test('should successfully login with valid credentials', async () => {});
test('should return 400 when email is missing', async () => {});
test('should include category information in product response', async () => {});

// Bad: Vague, unclear
test('login test', async () => {});
test('products', async () => {});
test('error case', async () => {});
```

### 2. AAA Pattern (Arrange, Act, Assert)

```javascript
test('should filter products by category', async () => {
  // Arrange
  const categoryId = 'electronics-category-id';

  // Act
  const response = await fetch(`http://localhost:3001/api/products?category=${categoryId}`);
  const products = await response.json();

  // Assert
  expect(response.status).toBe(200);
  expect(products.every(p => p.categoryId === categoryId)).toBe(true);
});
```

### 3. Group Related Tests

```javascript
describe('Products API', () => {
  describe('GET /api/products', () => {
    test('should fetch all products', async () => {});
    test('should return only active products', async () => {});
    test('should include category information', async () => {});
  });

  describe('GET /api/products/[id]', () => {
    test('should fetch product by ID', async () => {});
    test('should return 404 for non-existent product', async () => {});
  });
});
```

### 4. Use Test Data Fixtures

```javascript
// test-helpers.js
export const TEST_USERS = {
  customer: {
    email: 'customer@storeflow.com',
    password: 'Customer@123',
  },
  admin: {
    email: 'admin@storeflow.com',
    password: 'Admin@123',
  },
};

export const TEST_PRODUCT = {
  name: 'Test Product',
  description: 'A test product',
  price: 99.99,
  stock: 10,
};

// Use in tests
import { TEST_USERS, TEST_PRODUCT } from './test-helpers';

test('should login as customer', async () => {
  const response = await fetch('http://localhost:3001/api/auth/callback/credentials', {
    method: 'POST',
    body: JSON.stringify(TEST_USERS.customer),
  });
  expect(response.ok).toBe(true);
});
```

### 5. Clean Up Test Data

```javascript
import { afterEach } from 'vitest';
import { prisma } from '@/lib/prisma';

describe('Product Tests', () => {
  const createdProductIds = [];

  afterEach(async () => {
    // Cleanup created test data
    await prisma.product.deleteMany({
      where: { id: { in: createdProductIds } },
    });
    createdProductIds.length = 0;
  });

  test('should create product', async () => {
    const response = await fetch('http://localhost:3001/api/admin/products', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test Product', price: 99 }),
    });

    const product = await response.json();
    createdProductIds.push(product.id);

    expect(product.name).toBe('Test Product');
  });
});
```

---

## Running Tests

### All Tests

```bash
npm test
```

**Output:**
```
✓ __tests__/auth/login-roles.test.js  (12 tests) 4116ms
✓ __tests__/auth/login.test.js  (6 tests) 6325ms
✓ __tests__/products/products.test.js  (8 tests) 8229ms
✓ __tests__/auth/api-login-seed.test.js  (8 tests) 8584ms
✓ __tests__/auth/register.test.js  (6 tests) 8619ms
✓ __tests__/products/product-detail.test.js  (8 tests) 9591ms
✓ __tests__/wishlist/wishlist.test.js  (15 tests) 26348ms

Test Files  7 passed (7)
Tests  63 passed (63)
Duration  26.73s
```

### Watch Mode

```bash
npm run test:watch
```

Auto-reruns tests when files change. Great for development.

### UI Mode

```bash
npm run test:ui
```

Opens interactive UI to run and debug tests visually.

### Specific Test File

```bash
npx vitest run __tests__/auth/login.test.js
```

### Specific Test Pattern

```bash
npx vitest run --grep "login"
npx vitest run --grep "products"
```

### Verbose Output

```bash
npx vitest run -v
```

---

## Debugging Tests

### 1. Console Logging

```javascript
test('debug test', async () => {
  const response = await fetch('http://localhost:3001/api/products');
  const data = await response.json();

  console.log('Response status:', response.status);
  console.log('Response data:', JSON.stringify(data, null, 2));

  expect(response.status).toBe(200);
});
```

### 2. Use Vitest UI

```bash
npm run test:ui
```

Provides visual debugging with:
- Test execution timeline
- Console output
- Error stack traces
- Re-run specific tests

### 3. Isolate Failing Test

```javascript
// Use test.only to run just one test
test.only('this specific test', async () => {
  // ...
});
```

### 4. Skip Flaky Tests Temporarily

```javascript
// Skip while investigating
test.skip('flaky test', async () => {
  // ...
});
```

---

## Configuration

### Vitest Config

**File:** `api-web/vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: [],
    exclude: ['**/node_modules/**', '**/e2e/**'], // Exclude E2E tests
    env: {
      NODE_ENV: 'test',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
```

**Key Settings:**
- `globals: true` - Use global test functions (no imports needed)
- `environment: 'node'` - Node.js environment (not jsdom)
- `exclude` - Exclude E2E tests (Playwright handles those)

---

## Test Database

### Current Setup: Development Database

**Both API tests and application use the same database.**

**Pros:**
- ✅ Simple setup
- ✅ Tests verify real data structures
- ✅ No separate database needed

**Cons:**
- ⚠️ Test data may pollute development
- ⚠️ Cannot run dev and tests simultaneously

### Database Connection

```javascript
// Tests use same DATABASE_URL from .env
import { prisma } from '@/lib/prisma';

// Example: Query in test
const users = await prisma.user.findMany();
```

### Seeded Test Data

Tests rely on seeded data:

```bash
npm run db:seed
```

**Creates:**
- Test users (customer, admin, staff)
- Sample products
- Sample categories
- Sample orders

---

## Troubleshooting

### Tests Fail with "fetch failed"

**Cause:** Dev server not running

**Solution:**
```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Run tests
npm test
```

### Tests Fail with Database Errors

**Cause:** Database not accessible or not seeded

**Solutions:**

1. **Check PostgreSQL is running:**
   ```bash
   psql -h localhost -p 5432 -U postgres -d storeflow
   ```

2. **Verify DATABASE_URL in .env:**
   ```bash
   cat api-web/.env | grep DATABASE_URL
   ```

3. **Reseed database:**
   ```bash
   npm run db:seed
   ```

### Slow Test Execution

**Causes & Solutions:**

1. **Database queries slow:**
   - Add database indexes
   - Optimize queries in API routes

2. **Too many sequential requests:**
   - Parallelize independent tests
   - Use `describe.concurrent` for independent test groups

3. **Network delays:**
   - Tests run against localhost (should be fast)
   - Check dev server performance

### Flaky Tests

**Symptoms:** Tests pass sometimes, fail others

**Common Causes:**

1. **Race conditions:**
   ```javascript
   // Bad: No wait for async operation
   test('flaky test', async () => {
     fetch('http://localhost:3001/api/slow-endpoint'); // No await!
     const data = await getData();
     expect(data).toBeDefined(); // May fail randomly
   });

   // Good: Proper await
   test('stable test', async () => {
     await fetch('http://localhost:3001/api/slow-endpoint');
     const data = await getData();
     expect(data).toBeDefined();
   });
   ```

2. **Shared test data conflicts:**
   - Clean up test data in `afterEach`
   - Use unique identifiers for test data

3. **Database state dependencies:**
   - Tests should not depend on execution order
   - Each test should set up its own data

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: API Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: storeflow
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci
        working-directory: api-web

      - name: Run migrations
        run: npx prisma migrate deploy
        working-directory: api-web

      - name: Seed database
        run: npm run db:seed
        working-directory: api-web

      - name: Start dev server
        run: npm run dev &
        working-directory: api-web

      - name: Wait for server
        run: npx wait-on http://localhost:3001/api/health

      - name: Run API tests
        run: npm test
        working-directory: api-web
```

---

## Next Steps

### Expand Coverage

1. **Categories API Tests**
   - Create category
   - Update category
   - Delete category
   - List categories

2. **Orders API Tests**
   - Create order
   - Update order status
   - Get order details
   - List customer orders

3. **Cart API Tests**
   - Add to cart
   - Update quantity
   - Remove from cart
   - Get cart total

4. **User Management Tests**
   - Update profile
   - Change password
   - Delete account

### Improve Quality

1. **Add code coverage tracking**
2. **Add performance benchmarks**
3. **Add API contract testing**
4. **Add load testing**

---

## Learn More

- [Vitest Documentation](https://vitest.dev)
- [Supertest Guide](https://github.com/ladjs/supertest)
- [Testing Best Practices - Martin Fowler](https://martinfowler.com/articles/practical-test-pyramid.html)
- [API Testing Patterns](https://kentcdodds.com/blog/write-tests)

---

**Last Updated:** 2026-07-30

**Test Status:** 63/63 passing (100%) ✅
