# StoreFlow - API & Web Application

Next.js 14 full-stack application (API + Web UI)

## Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Setup database
npx prisma generate
npx prisma migrate dev

# Seed demo data
npm run db:seed

# Run dev server
npm run dev
```

Visit: http://localhost:3000

## Testing

This project uses Vitest for testing, following industry-standard patterns recommended by:
- Vitest Official Documentation: https://vitest.dev/
- Testing Pyramid - Martin Fowler: https://martinfowler.com/articles/practical-test-pyramid.html
- Kent C. Dodds - Testing Best Practices: https://kentcdodds.com/blog/write-tests

Quick Start:
```bash
# Start dev server first
npm run dev

# Run tests (in another terminal)
npm test

# Watch mode
npm run test:watch

# Interactive UI
npm run test:ui
```

Test Results:
Results are automatically saved to `docs/test-result/` after each test run:
- test-results.json - JSON format
- index.html - Interactive HTML report

Complete Testing Guide:
See `docs/TESTING.md` for:
- Testing strategy and approach
- Writing new tests
- Standard patterns (beforeEach, afterEach, etc.)
- Future roadmap (Unit tests, E2E tests)
- Official documentation links

Test Coverage:
- Auth API: 100% (register, login)
- Products API: TODO
- Orders API: TODO

### Demo Credentials

For test login credentials, see `TEST_LOGIN.md`

## Structure

- `/app` - Next.js App Router (pages + API routes)
  - `/admin/dashboard` - Admin home page (full system access)
  - `/staff/dashboard` - Staff home page (inventory and orders)
  - `/customer/dashboard` - Customer home page (shopping and orders)
  - `/dashboard` - Generic dashboard (redirects to role-specific page)
  - `/403` - Forbidden page (unauthorized access)
- `/lib` - Utilities and configurations
- `/prisma` - Database schema and migrations
- `/__tests__` - API test files

## Tech Stack

- Next.js 14
- TypeScript
- PostgreSQL + Prisma
- NextAuth.js
- Tailwind CSS
