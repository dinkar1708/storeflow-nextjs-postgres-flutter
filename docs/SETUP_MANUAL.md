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

```bash
# Copy environment file
cp .env.development .env
```

**Edit `.env` file** - Update DATABASE_URL with your PostgreSQL user:

```env
# Replace 'postgres:postgres' with your PostgreSQL username
# Example: If your user is 'arnav', use 'arnav@localhost'
DATABASE_URL="postgresql://YOUR_USERNAME@localhost:5432/storeflow"
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="dev-secret-change-in-production"
PORT=3001
```

**macOS/Linux:** Your username is usually your system username
**Windows:** Default is usually `postgres` with the password you set during installation

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
