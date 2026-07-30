# Running E2E Tests

Complete guide to running E2E tests for StoreFlow.

---

## Quick Start

### One Command (Easiest)

```bash
cd api-web
npm run test:e2e
```

This automatically:
- Starts dev server on port 3001 (if not running)
- Runs all 88 E2E tests in headless mode
- Generates HTML report
- Captures screenshots/videos on failures

---

## Test Modes

### 1. Headless Mode (CI/Production)

```bash
npm run test:e2e
```

**Best For:** CI/CD pipelines, quick validation

**Features:**
- Runs in background (no visible browser)
- Fastest execution
- Captures artifacts on failure

---

### 2. UI Mode (Recommended for Development)

```bash
npm run test:e2e:ui
```

**Best For:** Writing and debugging tests

**Features:**
- Interactive visual interface
- See test execution in real-time
- Inspect DOM, network, console
- Time travel debugging
- Re-run specific tests easily

---

### 3. Headed Mode (Watch Browser)

```bash
npm run test:e2e:headed
```

**Best For:** Understanding test behavior, demos

**Features:**
- See browser window during tests
- Useful for visual verification
- Watch UI interactions

---

### 4. Debug Mode (Step Through)

```bash
npm run test:e2e:debug
```

**Best For:** Troubleshooting failing tests

**Features:**
- Pauses before each action
- Playwright Inspector opens
- Step through test line by line
- Inspect page state at each step

---

## Running Specific Tests

### Run Single Test File

```bash
# Run authentication tests only
npx playwright test e2e/01-authentication.spec.ts

# Run RBAC tests only
npx playwright test e2e/02-role-based-access.spec.ts

# Run products tests only
npx playwright test e2e/03-products.spec.ts
```

### Run Tests Matching Pattern

```bash
# Run all login tests
npx playwright test --grep "login"

# Run all admin tests
npx playwright test --grep "admin"

# Run all customer tests
npx playwright test --grep "customer"

# Exclude tests
npx playwright test --grep-invert "flaky"
```

### Run Single Test

```bash
# By exact name
npx playwright test --grep "should successfully login with valid customer credentials"

# Combined with file
npx playwright test e2e/01-authentication.spec.ts --grep "login"
```

---

## Test Setup

### Prerequisites

```bash
# 1. Install dependencies (one-time)
cd api-web
npm install

# 2. Install Playwright browsers (one-time)
npx playwright install chromium

# 3. Seed test database (one-time)
npm run db:seed
```

**Test Users Created:**
```
Customer: customer@storeflow.com / Customer@123
Admin:    admin@storeflow.com    / Admin@123
Staff:    staff@storeflow.com    / Staff@123
```

---

## What E2E Tests Need Running

```
┌─────────────┐
│  Playwright │
└──────┬──────┘
       │
       v
┌─────────────────┐
│   Next.js App   │  ← Port 3001 (auto-started)
└────────┬────────┘
         │
         v
  ┌─────────────┐
  │  PostgreSQL │   ← Port 5432 (must be running)
  └─────────────┘
```

**Automatic:**
- Next.js dev server (started by Playwright)

**Manual:**
- PostgreSQL database (must be running)
- Database seeded with test users

---

## Manual Setup (Alternative)

If you prefer to start services manually:

### 1. Start PostgreSQL

```bash
# Using Docker
docker run --name storeflow-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=storeflow \
  -p 5432:5432 \
  -d postgres:14

# Or use existing PostgreSQL installation
# (make sure it's running)
```

### 2. Start Dev Server

```bash
cd api-web
npm run dev
```

**Verify server is ready:**
```bash
curl http://localhost:3001/api/health
# Should return: {"status":"healthy",...}
```

### 3. Run Tests

```bash
# In another terminal
npm run test:e2e
```

---

## Test Execution Flow

### Global Setup (Runs Once)

`e2e/global-setup.ts` runs before all tests:

1. ✅ Checks dev server is ready (port 3001)
2. ✅ Validates test user credentials
3. ✅ Logs setup status

### Individual Tests

Each test file runs independently:

1. Browser launches (Chromium)
2. Test navigates to pages
3. Test interacts with UI
4. Test verifies outcomes
5. Artifacts captured on failure

### Cleanup

- Browser closes after each test
- Database data persists (shared dev DB)

---

## Test Results & Reports

### View HTML Report

```bash
npx playwright show-report
```

Opens interactive report showing:
- Test results (passed/failed/skipped)
- Execution times
- Screenshots/videos on failures
- Error stack traces

### Report Files

```
api-web/
├── playwright-report/          # HTML reports
│   └── index.html             # Main report
│
├── test-results/              # Test artifacts
│   ├── 01-authentication-*/
│   │   ├── test-failed-1.png  # Failure screenshot
│   │   ├── video.webm         # Test recording
│   │   ├── trace.zip          # Full trace
│   │   └── error-context.md   # Error details
│   └── .../
```

### Artifacts Captured on Failure

- **Screenshots:** Visual state when test failed
- **Videos:** Full recording of test execution
- **Traces:** Complete timeline with network, DOM, console
- **Error Context:** Detailed error information

---

## Viewing Test Artifacts

### Screenshots

```bash
# Automatically saved to test-results/
open api-web/test-results/*/test-failed-1.png
```

### Videos

```bash
# Automatically saved to test-results/
open api-web/test-results/*/video.webm
```

### Traces

```bash
# View interactive trace
npx playwright show-trace test-results/*/trace.zip
```

Trace viewer shows:
- Timeline of actions
- Network requests
- Console logs
- DOM snapshots
- Screenshots at each step

---

## Troubleshooting

### Error: Dev server not ready

**Symptom:**
```
⏳ Waiting for dev server to be ready...
❌ Dev server failed to start
```

**Solutions:**

1. **Check PostgreSQL is running:**
   ```bash
   psql -h localhost -p 5432 -U postgres -d storeflow
   # If fails, start PostgreSQL
   ```

2. **Check port 3001 is available:**
   ```bash
   lsof -ti:3001
   # If returns PID, kill it:
   lsof -ti:3001 | xargs kill -9
   ```

3. **Check .env file exists:**
   ```bash
   cat api-web/.env
   # Should contain DATABASE_URL
   ```

4. **Manually start dev server:**
   ```bash
   npm run dev
   # Check for errors in output
   ```

---

### Error: Test user login failed

**Symptom:**
```
⚠️  Test user login failed - tests may need to register users
```

**Solution:**

```bash
# Reseed database
npm run db:seed

# Verify users exist
psql -h localhost -p 5432 -U postgres -d storeflow -c \
  "SELECT email, role FROM \"User\" WHERE email LIKE '%@storeflow.com';"
```

**Expected Output:**
```
         email         |   role
-----------------------+----------
 customer@storeflow.com| CUSTOMER
 admin@storeflow.com   | ADMIN
 staff@storeflow.com   | STAFF
```

---

### Error: Tests timeout

**Symptom:**
```
Test timeout of 30000ms exceeded
```

**Solutions:**

1. **Increase timeout for specific test:**
   ```typescript
   test('slow test', async ({ page }) => {
     test.setTimeout(60000); // 60 seconds
     // ...
   });
   ```

2. **Global timeout in config:**
   ```typescript
   // playwright.config.ts
   export default defineConfig({
     timeout: 60000, // 60 seconds
   });
   ```

3. **Check server performance:**
   ```bash
   # Monitor server logs
   npm run dev
   # Look for slow database queries
   ```

---

### Error: Element not found

**Symptom:**
```
Error: locator.click: Target closed
Error: locator.toBeVisible: Element not found
```

**Solutions:**

1. **Add explicit wait:**
   ```typescript
   await page.waitForSelector('text=Expected Content');
   await page.click('button[type="submit"]');
   ```

2. **Wait for navigation:**
   ```typescript
   await page.click('a[href="/products"]');
   await page.waitForURL(/products/);
   ```

3. **Use debug mode:**
   ```bash
   npx playwright test --debug --grep "failing test name"
   ```

---

### Flaky Tests

**Symptoms:**
- Tests pass sometimes, fail others
- Race conditions
- Timing issues

**Solutions:**

1. **Add network idle wait:**
   ```typescript
   await page.goto('/products');
   await page.waitForLoadState('networkidle');
   ```

2. **Wait for specific element:**
   ```typescript
   await page.waitForSelector('text=Products loaded');
   ```

3. **Use retry:**
   ```typescript
   // playwright.config.ts
   export default defineConfig({
     retries: process.env.CI ? 2 : 0,
   });
   ```

---

## Parallel Execution

### Default Behavior

Playwright runs tests in parallel by default:

```typescript
// playwright.config.ts
export default defineConfig({
  workers: process.env.CI ? 1 : undefined,
  fullyParallel: true,
});
```

### Run Tests Serially

```bash
# One test at a time
npx playwright test --workers=1
```

### Run Specific Number of Workers

```bash
# Use 4 parallel workers
npx playwright test --workers=4
```

---

## CI/CD Integration

### Environment Variables

```bash
# Set in CI environment
export CI=true
export DATABASE_URL=postgresql://...
export PORT=3001
```

### GitHub Actions Example

```yaml
- name: Install Playwright
  run: npx playwright install chromium --with-deps
  working-directory: api-web

- name: Seed database
  run: npm run db:seed
  working-directory: api-web

- name: Run E2E tests
  run: npm run test:e2e
  working-directory: api-web

- name: Upload report
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: api-web/playwright-report/
```

---

## Performance Tips

### Faster Test Execution

1. **Use headless mode:**
   ```bash
   npm run test:e2e  # Not npm run test:e2e:headed
   ```

2. **Run in parallel:**
   ```bash
   npx playwright test --workers=4
   ```

3. **Skip slow tests during development:**
   ```typescript
   test.skip('slow integration test', async ({ page }) => {
     // ...
   });
   ```

4. **Use test.describe.configure for specific groups:**
   ```typescript
   test.describe.configure({ mode: 'parallel' });
   ```

---

## Current Test Status (2026-07-30)

**Overall:** 72/88 tests passing (82%)

**By Feature:**
| Feature | Passing | Total | Rate |
|---------|---------|-------|------|
| Authentication | 5 | 8 | 63% |
| RBAC | 36 | 36 | 100% |
| Products | 11 | 12 | 92% |
| Categories | 9 | 12 | 75% |
| Orders | 12 | 14 | 86% |
| Wishlist | 5 | 6 | 83% |

**Failures:** Mostly UI validation error message specifics

---

## Learn More

- [Playwright Test Docs](https://playwright.dev/docs/test-configuration)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Tests](https://playwright.dev/docs/debug)
- [Test Fixtures](https://playwright.dev/docs/test-fixtures)

---

**Last Updated:** 2026-07-30
