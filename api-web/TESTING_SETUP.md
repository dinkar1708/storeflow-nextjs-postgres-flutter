# Testing Setup Guide

Complete guide to set up isolated test database for StoreFlow.

## Overview

This project supports two testing approaches:

1. **Shared Database** (Default) - Tests use development database
2. **Isolated Database** (Recommended) - Tests use separate database on port 5433

## Why Isolated Test Database?

**Benefits:**
- No data pollution between dev and tests
- Run dev and tests simultaneously
- Easy to reset test state
- Matches CI/CD environment

**Setup:**
| Environment | Database | Port | App Port |
|-------------|----------|------|----------|
| Development | storeflow | 5432 | 3001 |
| Testing | storeflow_test | 5433 | 3002 |

---

## Quick Setup (Recommended)

### One Command Setup

```bash
cd api-web
./scripts/setup-test-db.sh
```

This script will:
1. Start PostgreSQL test database on port 5433
2. Run database migrations
3. Seed test data
4. Verify setup

### Verify Setup

```bash
# Check test database
psql -h localhost -p 5433 -U postgres -d storeflow_test

# List test users
psql -h localhost -p 5433 -U postgres -d storeflow_test -c \
  "SELECT email, role FROM \"User\";"
```

**Expected test users:**
```
customer@storeflow.com - CUSTOMER
admin@storeflow.com    - ADMIN
staff@storeflow.com    - STAFF
```

---

## Manual Setup (Alternative)

### 1. Install Dependencies

```bash
npm install
```

### 2. Create .env.test File

```bash
# Copy template
cp .env.test.example .env.test

# Or create manually
cat > .env.test << 'EOF'
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/storeflow_test"
NEXTAUTH_URL="http://localhost:3002"
NEXTAUTH_SECRET="test-secret-key"
NODE_ENV="test"
PORT=3002
DISABLE_RATE_LIMIT="true"
EOF
```

### 3. Start Test Database

**Option A: Docker (Recommended)**

```bash
docker run --name storeflow-postgres-test \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=storeflow_test \
  -p 5433:5432 \
  -d postgres:14

# Wait for it to start
sleep 5
```

**Option B: Native PostgreSQL**

```bash
# Create database
psql -U postgres -c "CREATE DATABASE storeflow_test;"

# Or run on separate port
initdb -D /usr/local/var/postgres-test
pg_ctl -D /usr/local/var/postgres-test -o "-p 5433" start
psql -p 5433 -U postgres -c "CREATE DATABASE storeflow_test;"
```

### 4. Run Migrations

```bash
# Load test environment
export $(cat .env.test | grep -v '^#' | xargs)

# Run migrations
npx prisma migrate deploy
```

### 5. Seed Test Data

```bash
npm run db:seed:test
```

---

## Running Tests with Isolated Database

### API Integration Tests

```bash
npm test                    # Run all API tests (uses port 5433)
npm run test:watch          # Watch mode
npm run test:ui             # Visual UI mode
```

### E2E Tests

```bash
npm run test:e2e            # Run all E2E tests (uses port 5433)
npm run test:e2e:ui         # Visual debugging
npm run test:e2e:headed     # See browser
```

### Development Server (Separate)

```bash
npm run dev                 # Uses port 3001, DB port 5432
```

**Now you can run dev and tests simultaneously without conflicts!**

---

## Environment Files

### .env (Development)

```bash
DATABASE_URL="postgresql://...@localhost:5432/storeflow"
NEXTAUTH_URL="http://localhost:3001"
PORT=3001
NODE_ENV="development"
```

### .env.test (Testing)

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/storeflow_test"
NEXTAUTH_URL="http://localhost:3002"
PORT=3002
NODE_ENV="test"
DISABLE_RATE_LIMIT="true"
```

---

## Managing Test Database

### Start/Stop

```bash
# Start test database
docker start storeflow-postgres-test

# Stop test database (keeps data)
docker stop storeflow-postgres-test

# Remove test database (deletes data)
docker rm -f storeflow-postgres-test
```

### Reset Test Database

```bash
# Option 1: Recreate container
docker stop storeflow-postgres-test
docker rm storeflow-postgres-test
./scripts/setup-test-db.sh

# Option 2: Reset migrations
export $(cat .env.test | grep -v '^#' | xargs)
npx prisma migrate reset --force
npm run db:seed:test
```

### View Test Data

```bash
# Connect to test database
psql -h localhost -p 5433 -U postgres -d storeflow_test

# View all tables
\dt

# View users
SELECT email, role FROM "User";

# View products
SELECT id, name, price FROM "Product" LIMIT 10;

# Exit
\q
```

---

## Troubleshooting

### Port 5433 Already in Use

```bash
# Find what's using the port
lsof -ti:5433

# Kill it
lsof -ti:5433 | xargs kill -9
```

### Docker Not Running

```bash
# macOS
open -a Docker

# Verify Docker is running
docker info
```

### Tests Still Use Development Database

**Check that .env.test exists:**
```bash
cat .env.test
```

**Verify scripts use dotenv-cli:**
```bash
cat package.json | grep "test.*dotenv"
```

### Database Connection Errors

```bash
# Check container is running
docker ps | grep storeflow-postgres-test

# Check logs
docker logs storeflow-postgres-test

# Restart container
docker restart storeflow-postgres-test

# Verify connection
psql -h localhost -p 5433 -U postgres -d storeflow_test
```

### Migrations Fail

```bash
# Check DATABASE_URL points to test database
export $(cat .env.test | grep -v '^#' | xargs)
echo $DATABASE_URL
# Should be: postgresql://...@localhost:5433/storeflow_test

# Try running migrations again
npx prisma migrate deploy
```

---

## CI/CD Configuration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
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
        run: cp .env.test.example .env.test

      - name: Run migrations
        working-directory: api-web
        run: |
          export $(cat .env.test | xargs)
          npx prisma migrate deploy

      - name: Seed database
        working-directory: api-web
        run: npm run db:seed:test

      - name: Run API tests
        working-directory: api-web
        run: npm test

      - name: Run E2E tests
        working-directory: api-web
        run: npm run test:e2e
```

---

## Package.json Scripts

All test scripts automatically use `.env.test`:

```json
{
  "scripts": {
    "test": "dotenv -e .env.test -- vitest run",
    "test:watch": "dotenv -e .env.test -- vitest",
    "test:ui": "dotenv -e .env.test -- vitest --ui",
    "test:e2e": "dotenv -e .env.test -- playwright test",
    "test:e2e:ui": "dotenv -e .env.test -- playwright test --ui",
    "db:seed:test": "dotenv -e .env.test -- tsx prisma/seed.ts"
  }
}
```

---

## Learn More

- [Main Testing Documentation](/docs/testing/README.md)
- [API Testing Guide](/docs/testing/api-testing.md)
- [E2E Testing Guide](/docs/testing/e2e-testing/README.md)
- [Test Isolation Setup](/docs/testing/test-isolation-setup.md)

---

**Last Updated:** 2026-07-30
