# Test Isolation Setup Guide

Guide to setting up isolated test database for StoreFlow (optional but recommended).

---

## Why Test Isolation?

### Current Setup: Shared Development Database

**Both development and tests use the same database.**

**Pros:**
- ✅ Simple setup
- ✅ One database to manage
- ✅ Tests verify real data structures

**Cons:**
- ⚠️ Tests pollute development data
- ⚠️ Cannot run dev and tests simultaneously without conflicts
- ⚠️ Test failures may corrupt dev data
- ⚠️ Hard to reset test state

---

### Recommended: Isolated Test Database

**Separate databases for development and testing.**

| Environment | Database | PostgreSQL Port | App Port |
|-------------|----------|-----------------|----------|
| **Development** | `storeflow` | 5432 | 3001 |
| **Testing** | `storeflow_test` | 5433 | 3002 |

**Benefits:**
- ✅ Tests use separate database
- ✅ No data pollution
- ✅ Can run dev and tests simultaneously
- ✅ Easy to reset test database
- ✅ Realistic CI/CD simulation

---

## Setup: Isolated Test Database

### Option 1: Docker (Recommended)

#### 1. Create Test Database Container

```bash
# Start separate PostgreSQL for tests on port 5433
docker run --name storeflow-postgres-test \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=storeflow_test \
  -p 5433:5432 \
  -d postgres:14

# Verify it's running
docker ps | grep storeflow-postgres-test
```

#### 2. Verify Connection

```bash
psql -h localhost -p 5433 -U postgres -d storeflow_test
# Should connect successfully
# Type \q to exit
```

#### 3. Create `.env.test` File

```bash
cd api-web
cat > .env.test << 'EOF'
# Test Environment Configuration
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/storeflow_test"
NEXTAUTH_SECRET="test-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3002"
PORT=3002
NODE_ENV="test"
EOF
```

#### 4. Run Migrations on Test Database

```bash
# Load test environment and run migrations
export $(cat .env.test | xargs)
npx prisma migrate deploy

# Verify tables created
psql -h localhost -p 5433 -U postgres -d storeflow_test -c "\dt"
```

#### 5. Seed Test Database

```bash
# Seed with test data
export $(cat .env.test | xargs)
npm run db:seed

# Verify users created
psql -h localhost -p 5433 -U postgres -d storeflow_test -c \
  "SELECT email, role FROM \"User\" WHERE email LIKE '%@storeflow.com';"
```

---

### Option 2: Native PostgreSQL

#### 1. Create Test Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create test database
CREATE DATABASE storeflow_test;

# Grant permissions
GRANT ALL PRIVILEGES ON DATABASE storeflow_test TO postgres;

# Exit
\q
```

#### 2. Run on Different Port (Optional)

If you want complete isolation, run a separate PostgreSQL instance:

```bash
# Initialize new data directory
initdb -D /usr/local/var/postgres-test

# Start on port 5433
pg_ctl -D /usr/local/var/postgres-test -o "-p 5433" start

# Create database
psql -p 5433 -U postgres -c "CREATE DATABASE storeflow_test;"
```

#### 3. Continue with Steps 3-5 from Docker Option

---

## Using Isolated Test Database

### Update Test Scripts

**File:** `api-web/package.json`

```json
{
  "scripts": {
    "dev": "next dev",
    "test": "dotenv -e .env.test -- vitest run",
    "test:watch": "dotenv -e .env.test -- vitest",
    "test:ui": "dotenv -e .env.test -- vitest --ui",
    "test:e2e": "dotenv -e .env.test -- playwright test",
    "test:e2e:ui": "dotenv -e .env.test -- playwright test --ui"
  },
  "devDependencies": {
    "dotenv-cli": "^7.3.0"
  }
}
```

### Install dotenv-cli

```bash
npm install --save-dev dotenv-cli
```

### Run Tests with Isolated Database

```bash
# API tests use test database (port 5433)
npm test

# E2E tests use test database (port 5433)
npm run test:e2e

# Dev server still uses development database (port 5432)
npm run dev
```

---

## Managing Test Database

### Reset Test Database

```bash
# Option 1: Drop and recreate
docker stop storeflow-postgres-test
docker rm storeflow-postgres-test
# Then recreate using Docker command above

# Option 2: Clear data and reseed
export $(cat .env.test | xargs)
npx prisma migrate reset --force
npm run db:seed
```

### Start/Stop Test Database

```bash
# Start
docker start storeflow-postgres-test

# Stop (keeps data)
docker stop storeflow-postgres-test

# Remove (deletes data)
docker rm -f storeflow-postgres-test
```

### View Test Database

```bash
# Connect
psql -h localhost -p 5433 -U postgres -d storeflow_test

# List tables
\dt

# View users
SELECT email, role FROM "User";

# Exit
\q
```

---

## Running Dev and Tests Simultaneously

With isolated setup, you can now:

```bash
# Terminal 1: Development server (port 3001, DB 5432)
npm run dev

# Terminal 2: API tests (port 3002, DB 5433)
npm test

# Terminal 3: E2E tests (port 3002, DB 5433)
npm run test:e2e
```

**No conflicts!** Each uses separate database and port.

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      # Test database on port 5433
      postgres-test:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: storeflow_test
        ports:
          - 5433:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3

      - name: Install dependencies
        working-directory: api-web
        run: npm ci

      - name: Create .env.test
        working-directory: api-web
        run: |
          cat > .env.test << EOF
          DATABASE_URL="postgresql://postgres:postgres@localhost:5433/storeflow_test"
          NEXTAUTH_SECRET="test-secret"
          NEXTAUTH_URL="http://localhost:3002"
          PORT=3002
          EOF

      - name: Run migrations
        working-directory: api-web
        run: |
          export $(cat .env.test | xargs)
          npx prisma migrate deploy

      - name: Seed database
        working-directory: api-web
        run: |
          export $(cat .env.test | xargs)
          npm run db:seed

      - name: Run API tests
        working-directory: api-web
        run: npm test

      - name: Install Playwright
        working-directory: api-web
        run: npx playwright install chromium --with-deps

      - name: Run E2E tests
        working-directory: api-web
        run: npm run test:e2e
```

---

## Configuration Files

### `.env` (Development)

```bash
# Development Environment
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/storeflow"
NEXTAUTH_SECRET="dev-secret-key"
NEXTAUTH_URL="http://localhost:3001"
PORT=3001
NODE_ENV="development"
```

### `.env.test` (Testing)

```bash
# Test Environment
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/storeflow_test"
NEXTAUTH_SECRET="test-secret-key"
NEXTAUTH_URL="http://localhost:3002"
PORT=3002
NODE_ENV="test"
```

### Update `.gitignore`

```bash
# Environment files
.env
.env.local
.env.test
.env.production

# Test results
test-results/
playwright-report/
coverage/
```

---

## Vitest Configuration Update

**File:** `api-web/vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: [],
    exclude: ['**/node_modules/**', '**/e2e/**'],
    env: {
      NODE_ENV: 'test',
      // Tests will use DATABASE_URL from .env.test via dotenv-cli
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
```

---

## Playwright Configuration Update

**File:** `api-web/playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  globalSetup: require.resolve('./e2e/global-setup'),
  use: {
    baseURL: process.env.NEXTAUTH_URL || 'http://localhost:3002', // Test port
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: process.env.NEXTAUTH_URL || 'http://localhost:3002',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    env: {
      // Use test database via .env.test
      PORT: '3002',
    },
  },
});
```

---

## Troubleshooting

### Port 5433 Already in Use

```bash
# Find process using port
lsof -ti:5433

# Kill it
lsof -ti:5433 | xargs kill -9

# Or use different port in .env.test
DATABASE_URL="postgresql://postgres:postgres@localhost:5434/storeflow_test"
```

### Cannot Connect to Test Database

```bash
# Check container is running
docker ps | grep storeflow-postgres-test

# Check logs
docker logs storeflow-postgres-test

# Restart container
docker restart storeflow-postgres-test
```

### Tests Still Using Development Database

**Cause:** `.env.test` not loaded

**Solution:**
```bash
# Verify dotenv-cli installed
npm list dotenv-cli

# Check .env.test exists
cat api-web/.env.test

# Manually test loading
export $(cat api-web/.env.test | xargs)
echo $DATABASE_URL
# Should show: postgresql://...localhost:5433/storeflow_test
```

### Migrations Not Applied

```bash
# Apply migrations to test database
export $(cat .env.test | xargs)
npx prisma migrate deploy

# Verify
psql -h localhost -p 5433 -U postgres -d storeflow_test -c "\dt"
```

---

## Comparison: Before vs After

### Before (Shared Database)

```bash
# Development
PORT=3001, DB=storeflow (port 5432)

# Tests
PORT=3001, DB=storeflow (port 5432)  ← Same database!

# Problem: Tests pollute dev data
```

### After (Isolated)

```bash
# Development
PORT=3001, DB=storeflow (port 5432)

# Tests
PORT=3002, DB=storeflow_test (port 5433)  ← Separate!

# Benefit: Complete isolation
```

---

## Best Practices

### 1. Use Docker for Test Database

- Easy to reset
- Consistent across team
- Same as CI environment

### 2. Separate Ports

- Development: 3001
- Testing: 3002
- Avoid conflicts

### 3. Automate Setup

Create setup script: `scripts/setup-test-db.sh`

```bash
#!/bin/bash
set -e

echo "Setting up test database..."

# Start test database
docker run --name storeflow-postgres-test \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=storeflow_test \
  -p 5433:5432 \
  -d postgres:14

# Wait for database
sleep 3

# Run migrations
export $(cat .env.test | xargs)
npx prisma migrate deploy

# Seed data
npm run db:seed

echo "✅ Test database ready!"
```

### 4. Document for Team

Add to README:

```markdown
## Testing Setup

1. Start test database: `./scripts/setup-test-db.sh`
2. Run tests: `npm test`
3. View test DB: `psql -h localhost -p 5433 -U postgres -d storeflow_test`
```

---

## Learn More

- [Prisma Testing Guide](https://www.prisma.io/docs/guides/testing)
- [Database Testing Best Practices](https://martinfowler.com/articles/practical-test-pyramid.html)
- [Docker PostgreSQL](https://hub.docker.com/_/postgres)

---

**Last Updated:** 2026-07-30

**Status:** Optional but recommended for production projects
