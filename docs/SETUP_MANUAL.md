# Setup without Docker (Manual)

Quick guide to run StoreFlow with manually installed PostgreSQL.

**Prefer easier setup?** See **[Setup with Docker](./SETUP_WITH_DOCKER.md)** (recommended)

---

## Prerequisites

- **Node.js v18+**: [nodejs.org](https://nodejs.org/)
- **PostgreSQL v14+**: Already installed locally

---

## Setup Steps

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/storeflow-nextjs-postgres-flutter.git
cd storeflow-nextjs-postgres-flutter/api-web
npm install
```

### 2. Create Database

```bash
# Create database (uses your current PostgreSQL user)
createdb storeflow
```

### 3. Configure Environment

Next.js loads **`.env.development` after `.env`**, so a Docker `DATABASE_URL` inside `.env.development` would override a local URL you only put in `.env`. For local PostgreSQL, use a **gitignored** override file:

```bash
# Replace YOUR_USERNAME with your OS / PostgreSQL role (see below)
cat > .env.development.local <<'EOF'
DATABASE_URL="postgresql://YOUR_USERNAME@localhost:5432/storeflow"
EOF

# Prisma CLI reads .env — keep it in sync
cp .env.example .env
# Edit .env: set DATABASE_URL to the same postgresql://…/storeflow value as above.
```

Alternatively, **edit `DATABASE_URL` directly inside `.env.development`** to your local URL (do not commit secrets).

Also set in `.env` (and match `.env.development` / `.env.development.local` for `DATABASE_URL`):

```env
DATABASE_URL="postgresql://YOUR_USERNAME@localhost:5432/storeflow"
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="dev-secret-change-in-production"
```

**macOS/Linux:** Your username is usually your system username  
**Windows:** Default is often `postgres` with the password you set during installation

**Dev server port:** Docs assume **http://localhost:3001**. The `npm run dev` script uses port 3001; if you change it, update `NEXTAUTH_URL` accordingly.

### 4. Setup Database Tables

```bash
npx prisma generate
npx prisma migrate deploy
npm run db:seed
```

### 5. Run the App

```bash
npm run dev
```

Visit: **http://localhost:3001**

**Login:**
- Email: `admin@storeflow.com`
- Password: `Admin@123`

---

## Common Issues

**Database connection failed:**
- Check PostgreSQL is running
- Verify DATABASE_URL has correct username/password
- Make sure database `storeflow` exists

**Port already in use:**
- Change PORT in `.env` to another number (e.g., 3002)

---

## Commands

```bash
# View database
npx prisma studio

# Reset database
dropdb storeflow && createdb storeflow
npx prisma migrate deploy
npm run db:seed
```

---

**Need help?** See main [README.md](../README.md)
