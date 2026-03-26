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

For demo login credentials, see `TEST_LOGIN.md`

Run API tests:
```bash
node __tests__/run-all-tests.js
```

## Structure

- `/app` - Next.js App Router (pages + API routes)
- `/lib` - Utilities and configurations
- `/prisma` - Database schema and migrations
- `/__tests__` - API test files

## Tech Stack

- Next.js 14
- TypeScript
- PostgreSQL + Prisma
- NextAuth.js
- Tailwind CSS
