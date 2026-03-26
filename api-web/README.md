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

# Run dev server
npm run dev
```

Visit: http://localhost:3000

## Demo Login Credentials

### Admin User
- Email: `admin@storeflow.com`
- Password: `Admin@123`

### Staff User
- Email: `staff@storeflow.com`
- Password: `Staff@123`

### Customer User
- Email: `customer@storeflow.com`
- Password: `Customer@123`

**Login URL:** http://localhost:3000/login

## Structure

- `/app` - Next.js App Router (pages + API routes)
- `/lib` - Utilities and configurations
- `/prisma` - Database schema and migrations

## Tech Stack

- Next.js 14
- TypeScript
- PostgreSQL + Prisma
- NextAuth.js
- Tailwind CSS
