# Running Tests - Quick Reference

Quick reference guide for running all types of tests in StoreFlow.

---

## Prerequisites

```bash
# One-time setup
cd api-web
npm install
npx playwright install chromium
npm run db:seed
```

---

## API Integration Tests (Vitest)

### Start Dev Server

**Required before running API tests:**

```bash
# Terminal 1
npm run dev
```

Verify server is ready:
```bash
curl http://localhost:3001/api/health
# Should return: {"status":"healthy",...}
```

### Run Tests

```bash
# Terminal 2
npm test              # Run all API tests
npm run test:watch    # Watch mode
npm run test:ui       # Visual UI mode
```

### Expected Output

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
Duration  ~27s
```

### Specific Tests

```bash
# Run specific file
npx vitest run __tests__/auth/login.test.js

# Run tests matching pattern
npx vitest run --grep "login"
npx vitest run --grep "products"
```

**Learn More:** [api-testing.md](./api-testing.md)

---

## E2E Tests (Playwright)

### Run Tests

**Dev server starts automatically:**

```bash
npm run test:e2e          # Headless (CI mode)
npm run test:e2e:ui       # Visual debugging UI (recommended)
npm run test:e2e:headed   # See browser
npm run test:e2e:debug    # Debug mode
```

### Expected Output

```
Running 88 tests using 7 workers

✓ 01-authentication.spec.ts (8 tests)
✓ 02-role-based-access.spec.ts (36 tests)
✓ 03-products.spec.ts (12 tests)
✓ 04-categories.spec.ts (12 tests)
✓ 05-orders.spec.ts (14 tests)
✓ 07-wishlist.spec.ts (6 tests)

72 passed (82%)
13 failed (UI implementation details)
3 skipped
Duration  ~1-2 minutes
```

### Specific Tests

```bash
# Run specific file
npx playwright test e2e/01-authentication.spec.ts

# Run tests matching pattern
npx playwright test --grep "login"
npx playwright test --grep "admin"

# Run single test
npx playwright test --grep "should successfully login"
```

### View Report

```bash
npx playwright show-report
```

**Learn More:** [e2e-testing/running-tests.md](./e2e-testing/running-tests.md)

---

## Quick Commands Summary

| Command | Description | When to Use |
|---------|-------------|-------------|
| `npm run dev` | Start dev server | Before running API tests |
| `npm test` | Run all API tests | Verify API changes |
| `npm run test:watch` | API tests watch mode | During development |
| `npm run test:ui` | API tests visual UI | Debug API tests |
| `npm run test:e2e` | Run all E2E tests | Verify UI changes |
| `npm run test:e2e:ui` | E2E visual mode | Debug E2E tests |
| `npx playwright show-report` | View E2E report | Review E2E results |

---

## Test Workflow

### For Backend/API Changes

```bash
# 1. Start dev server
npm run dev

# 2. Run API tests (in another terminal)
npm test

# 3. If tests pass, run E2E tests
npm run test:e2e
```

### For Frontend/UI Changes

```bash
# Run E2E tests (starts dev server automatically)
npm run test:e2e:ui

# Use visual mode to debug
```

### Before Committing

```bash
# Start dev server
npm run dev

# Run all tests (in another terminal)
npm test && npm run test:e2e
```

---

## Common Issues

### API Tests: "fetch failed"

**Cause:** Dev server not running

**Solution:**
```bash
# Start dev server first
npm run dev

# Then run tests in another terminal
npm test
```

### E2E Tests: "Dev server not ready"

**Cause:** PostgreSQL not running or DATABASE_URL wrong

**Solution:**
```bash
# Check PostgreSQL
psql -h localhost -p 5432 -U postgres -d storeflow

# Check .env
cat .env | grep DATABASE_URL
```

### Port Already in Use

**Cause:** Another process using port 3001

**Solution:**
```bash
# Find and kill process
lsof -ti:3001 | xargs kill -9
```

---

## Test Users

All tests use these seeded users:

```
Customer: customer@storeflow.com / Customer@123
Admin:    admin@storeflow.com    / Admin@123
Staff:    staff@storeflow.com    / Staff@123
```

**If tests fail with auth errors:**
```bash
npm run db:seed
```

---

## Current Test Status (2026-07-30)

### API Integration Tests (Vitest)
- **Status:** ✅ 63/63 passing (100%)
- **Duration:** ~27 seconds
- **Coverage:** Auth, Products, Wishlist

### E2E Tests (Playwright)
- **Status:** ⚠️ 72/88 passing (82%)
- **Duration:** ~1-2 minutes
- **Coverage:** Full user flows, RBAC, Products, Orders
- **Failures:** Mostly UI validation message specifics

---

## Learn More

- **[Testing README](./README.md)** - Full testing documentation
- **[API Testing Guide](./api-testing.md)** - Detailed API testing guide
- **[E2E Testing Guide](./e2e-testing/)** - Detailed E2E testing guide
- **[Test Isolation Setup](./test-isolation-setup.md)** - Optional isolated test database

---

**Last Updated:** 2026-07-30
