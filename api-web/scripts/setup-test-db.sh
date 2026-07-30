#!/bin/bash
set -e

echo "🚀 Setting up isolated test database..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running. Please start Docker first."
    exit 1
fi

# Stop and remove existing test database container if it exists
if docker ps -a | grep -q storeflow-postgres-test; then
    echo "${YELLOW}⚠️  Existing test database found. Removing...${NC}"
    docker stop storeflow-postgres-test 2>/dev/null || true
    docker rm storeflow-postgres-test 2>/dev/null || true
fi

# Start test PostgreSQL container
echo "${GREEN}✓${NC} Starting PostgreSQL test database on port 5434..."
docker run --name storeflow-postgres-test \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=storeflow_test \
  -p 5434:5432 \
  -d postgres:14

# Wait for PostgreSQL to be ready
echo "${YELLOW}⏳${NC} Waiting for database to be ready..."
sleep 5

# Check if database is ready
until docker exec storeflow-postgres-test pg_isready -U postgres > /dev/null 2>&1; do
  echo "${YELLOW}⏳${NC} Still waiting for database..."
  sleep 2
done

echo "${GREEN}✓${NC} Database is ready!"

# Run migrations on test database
echo "${GREEN}✓${NC} Running database migrations..."
export $(cat .env.test | grep -v '^#' | xargs)
npx prisma migrate deploy

# Seed test database
echo "${GREEN}✓${NC} Seeding test database..."
npm run db:seed:test

echo ""
echo "${GREEN}✅ Test database setup complete!${NC}"
echo ""
echo "Test database details:"
echo "  Database: storeflow_test"
echo "  Port: 5434"
echo "  Container: storeflow-postgres-test"
echo ""
echo "To verify:"
echo "  psql -h localhost -p 5434 -U postgres -d storeflow_test"
echo ""
echo "To run tests:"
echo "  npm test              # API integration tests"
echo "  npm run test:e2e      # E2E tests"
echo ""
