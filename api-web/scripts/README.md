# Setup Scripts

Utility scripts for setting up test environment.

## Test Database Setup

**Script:** `setup-test-db.sh`

**Purpose:** Set up isolated PostgreSQL test database on port 5433

**Usage:**
```bash
cd api-web
./scripts/setup-test-db.sh
```

**What it does:**
1. Starts PostgreSQL Docker container on port 5433
2. Creates `storeflow_test` database
3. Runs database migrations
4. Seeds test data
5. Verifies setup

**Result:**
- Test database running on port 5433
- Test users created
- Ready to run tests

## Manual Setup (Alternative)

If you prefer manual setup:

```bash
# 1. Start test database
docker run --name storeflow-postgres-test \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=storeflow_test \
  -p 5433:5432 \
  -d postgres:14

# 2. Wait for it to start
sleep 5

# 3. Run migrations
export $(cat .env.test | grep -v '^#' | xargs)
npx prisma migrate deploy

# 4. Seed test data
npm run db:seed:test
```

## Verify Setup

```bash
# Check database is running
psql -h localhost -p 5433 -U postgres -d storeflow_test

# List test users
psql -h localhost -p 5433 -U postgres -d storeflow_test -c \
  "SELECT email, role FROM \"User\" WHERE email LIKE '%@storeflow.com';"
```

## Stopping Test Database

```bash
# Stop (keeps data)
docker stop storeflow-postgres-test

# Start again
docker start storeflow-postgres-test

# Remove (deletes data)
docker rm -f storeflow-postgres-test
```

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

# Or install Docker Desktop
brew install --cask docker
```

### Database Connection Fails

```bash
# Check container is running
docker ps | grep storeflow-postgres-test

# Check logs
docker logs storeflow-postgres-test

# Restart container
docker restart storeflow-postgres-test
```
