# Testing Guide

Comprehensive testing documentation for the StoreFlow e-commerce platform.

---

## Quick Start

### Run All Tests

```bash
cd api-web

# Start dev server (required for tests)
npm run dev

# In another terminal - Run API integration tests
npm test

# Run E2E tests
npm run test:e2e
```

---

## Test Architecture

StoreFlow uses a **multi-layered testing approach** following the Testing Pyramid:

```
        /\
       /E2E\        ← End-to-end (Playwright) - 88 tests
      /------\
     /  API   \     ← Integration (Vitest + Supertest) - 63 tests
    /----------\
   /   Unit     \   ← (Future: Component/Service tests)
  /--------------\
```

---

## Test Types

### 1. API Integration Tests (Vitest + Supertest)

**Purpose:** Test API endpoints with real database operations

**Location:** `api-web/__tests__/`

**Runner:** Vitest

**What's Tested:**
- ✅ Authentication (login, registration, sessions)
- ✅ User roles (Admin, Staff, Customer)
- ✅ Products CRUD operations
- ✅ Categories management
- ✅ Wishlist functionality
- ✅ Order processing

**Quick Commands:**
```bash
npm test              # Run all API tests
npm run test:watch    # Watch mode
npm run test:ui       # Visual UI mode
```

**Status:** 63/63 tests passing ✅

**Learn More:** [api-testing.md](./api-testing.md)

---

### 2. E2E Tests (Playwright)

**Purpose:** Test complete user flows in real browser with database

**Location:** `api-web/e2e/`

**Runner:** Playwright

**What's Tested:**
- ✅ Full authentication flows (register → login → dashboard)
- ✅ Role-based access control (RBAC)
- ✅ Product browsing and management
- ✅ Category management
- ✅ Order workflows (create → update → track)
- ✅ Wishlist operations
- ✅ Session management

**Quick Commands:**
```bash
npm run test:e2e          # Run all E2E tests
npm run test:e2e:ui       # Visual mode (debugging)
npm run test:e2e:headed   # See browser
npm run test:e2e:debug    # Debug mode
```

**Status:** 72/88 tests passing (82%) ⚠️

**Learn More:** [e2e-testing/](./e2e-testing/)

---

## Database Strategy

### Current Setup: Shared Development Database

**Both API and E2E tests currently use the same development database.**

| Test Type | Database | Port | Status |
|-----------|----------|------|--------|
| API Integration | Development | 5432 | ✅ Active |
| E2E Tests | Development | 5432 | ✅ Active |

**Pros:**
- ✅ Simple setup
- ✅ Tests use real data
- ✅ No extra database needed

**Cons:**
- ⚠️ Tests may pollute dev data
- ⚠️ Cannot run dev and tests simultaneously without conflicts

### Future: Isolated Test Database (Recommended)

For better isolation, consider setting up a separate test database:

| Environment | Database | Port |
|-------------|----------|------|
| **Development** | `storeflow` | 5432 |
| **Testing** | `storeflow_test` | 5433 |

**Learn More:** [test-isolation-setup.md](./test-isolation-setup.md)

---

## Prerequisites

### Required
- Node.js 18+ with npm
- PostgreSQL 14+
- Database seeded with test data

### Optional
- Docker (for isolated test database)
- Playwright browsers (auto-installed)

### Initial Setup

```bash
# 1. Install dependencies
cd api-web
npm install

# 2. Install Playwright browsers (one-time)
npx playwright install chromium

# 3. Seed database with test users
npm run db:seed

# 4. Start dev server (required for tests)
npm run dev
```

**Test Users:**
```
Customer: customer@storeflow.com / Customer@123
Admin:    admin@storeflow.com    / Admin@123
Staff:    staff@storeflow.com    / Staff@123
```

---

## Running Tests

### API Integration Tests

**Start dev server first:**
```bash
# Terminal 1
npm run dev
```

**Run tests:**
```bash
# Terminal 2
npm test                    # All tests
npm run test:watch          # Watch mode
npm run test:ui             # Visual UI mode

# Specific test file
npm test __tests__/auth/login.test.js

# Specific test pattern
npm test -- --grep "login"
```

**Expected Output:**
```
✓ __tests__/auth/login-roles.test.js  (12 tests)
✓ __tests__/auth/login.test.js  (6 tests)
✓ __tests__/products/products.test.js  (8 tests)
✓ __tests__/auth/api-login-seed.test.js  (8 tests)
✓ __tests__/auth/register.test.js  (6 tests)
✓ __tests__/products/product-detail.test.js  (8 tests)
✓ __tests__/wishlist/wishlist.test.js  (15 tests)

Test Files  7 passed (7)
Tests  63 passed (63)
```

**Learn More:** [running-tests.md](./running-tests.md)

---

### E2E Tests

**E2E tests start dev server automatically.**

```bash
# Run all E2E tests (headless)
npm run test:e2e

# Visual debugging mode (recommended)
npm run test:e2e:ui

# See browser while tests run
npm run test:e2e:headed

# Debug specific test
npm run test:e2e:debug

# Run specific test file
npx playwright test e2e/01-authentication.spec.ts

# Run tests matching pattern
npx playwright test --grep "login"
```

**Expected Output:**
```
Running 88 tests using 7 workers

✓ Feature: Authentication & Authorization (8 tests)
✓ Feature: Role-Based Page Access (36 tests)
✓ Feature: Product Management (12 tests)
✓ Feature: Category Management (12 tests)
✓ Feature: Order Management (14 tests)
✓ Feature: Wishlist (6 tests)

72 passed (82%)
13 failed (UI implementation details)
3 skipped
```

**Learn More:** [e2e-testing/running-tests.md](./e2e-testing/running-tests.md)

---

## Test Results & Reports

### API Test Results

Results automatically saved to `docs/test-result/` after each run:

```
docs/test-result/
├── test-summary.md        # Overall results
├── test-coverage.json     # Coverage data
└── test-output.log        # Detailed logs
```

### E2E Test Reports

```bash
# View last E2E test report
npx playwright show-report

# Reports stored in:
# api-web/playwright-report/
# api-web/test-results/
```

---

## Troubleshooting

### API Tests Fail with "fetch failed"

**Cause:** Dev server not running

**Solution:**
```bash
# Start dev server first
npm run dev

# Then run tests in another terminal
npm test
```

### E2E Tests Pick Up by Vitest

**Cause:** Vitest trying to run Playwright tests

**Solution:** Already fixed in `vitest.config.ts`:
```typescript
exclude: ['**/node_modules/**', '**/e2e/**']
```

### Port Already in Use

**Cause:** Another process using port 3001

**Solution:**
```bash
# Find and kill process
lsof -ti:3001 | xargs kill -9

# Or use different port in .env
PORT=3002
```

### Database Connection Errors

**Cause:** PostgreSQL not running or wrong credentials

**Solution:**
```bash
# Check PostgreSQL is running
psql -h localhost -p 5432 -U postgres -d storeflow

# Verify .env DATABASE_URL
cat api-web/.env
```

---

## Best Practices

### Writing Tests

1. **Use descriptive test names**
   ```javascript
   test('should successfully login with valid credentials', async () => {
     // Test implementation
   });
   ```

2. **Follow AAA pattern** (Arrange, Act, Assert)
   ```javascript
   test('should create product', async () => {
     // Arrange
     const productData = { name: 'Test Product', price: 100 };

     // Act
     const response = await request(app).post('/api/products').send(productData);

     // Assert
     expect(response.status).toBe(201);
     expect(response.body.name).toBe('Test Product');
   });
   ```

3. **Clean up test data** (for isolated tests)
   ```javascript
   afterEach(async () => {
     await prisma.product.deleteMany({ where: { name: 'Test Product' } });
   });
   ```

4. **Use test fixtures** for consistent data
5. **Mock external dependencies** (email, payment gateways)
6. **Test error cases** not just happy paths

### Performance

- API tests should complete in < 60 seconds
- E2E tests should complete in < 2 minutes
- Use `test.skip()` for flaky tests temporarily
- Parallelize independent tests

### CI/CD Integration

**GitHub Actions** (future):
```yaml
# .github/workflows/tests.yml
- name: Run API Tests
  run: npm test

- name: Run E2E Tests
  run: npm run test:e2e
```

---

## Test Coverage

### Current Coverage (2026-07-30)

| Feature | API Tests | E2E Tests | Status |
|---------|-----------|-----------|--------|
| Authentication | ✅ 20 tests | ✅ 8 tests | Complete |
| User Roles (RBAC) | ✅ 12 tests | ✅ 36 tests | Complete |
| Products | ✅ 16 tests | ✅ 12 tests | Complete |
| Categories | ✅ 0 tests | ⚠️ 12 tests (partial) | Partial |
| Orders | ✅ 0 tests | ⚠️ 14 tests (partial) | Partial |
| Wishlist | ✅ 15 tests | ⚠️ 6 tests (partial) | Partial |
| Cart | ❌ 0 tests | ❌ 0 tests | Missing |
| Analytics | ❌ 0 tests | ❌ 0 tests | Missing |

**Total:** 131 tests (63 API + 88 E2E, excluding 13 E2E failures)

---

## Documentation

### Testing Guides

- **[api-testing.md](./api-testing.md)** - API integration testing guide
- **[e2e-testing/](./e2e-testing/)** - E2E testing documentation
- **[running-tests.md](./running-tests.md)** - Quick reference for running tests
- **[test-isolation-setup.md](./test-isolation-setup.md)** - Setting up isolated test database

### Related Documentation

- [Main README](/api-web/README.md) - Project overview
- [Testing Reference](/docs/development/TESTING.md) - Official testing docs
- [References](/docs/REFERENCES.md) - Testing best practices and resources

---

## Support

### Common Issues

See [Troubleshooting](#troubleshooting) section above.

### Getting Help

1. Check existing test examples in `__tests__/` and `e2e/`
2. Review [Vitest docs](https://vitest.dev)
3. Review [Playwright docs](https://playwright.dev)
4. Check project issues on GitHub

---

**Last Updated:** 2026-07-30

**Test Status:**
- API Integration: ✅ 63/63 passing
- E2E Tests: ⚠️ 72/88 passing (82%)
