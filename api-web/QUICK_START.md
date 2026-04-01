# Quick Start Guide - Run with Docker

Follow these steps to run StoreFlow locally using Docker.

**What runs where:**
- 🐳 **Docker**: PostgreSQL database only (port 5433)
- 💻 **Local**: Next.js application (port 3001)

---

## Step 1: Start Docker Desktop

**macOS:**
- Open Docker Desktop application from Applications folder
- Wait for Docker icon to show "running" status in menu bar (green/whale icon)

**Windows:**
- Open Docker Desktop from Start menu
- Wait for Docker to fully start

**Linux:**
- Docker runs automatically as a service
- Verify: `sudo systemctl status docker`

---

## Step 2: Start PostgreSQL Database

```bash
cd api-web

# Start PostgreSQL in Docker
docker-compose up -d
```

**Verify database is running:**
```bash
docker ps
```

You should see `storeflow-postgres` container running.

---

## Step 3: Setup Environment

```bash
# Copy development environment file
cp .env.development .env

# Install dependencies (if not already done)
npm install
```

---

## Step 4: Setup Database Tables

```bash
# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma migrate deploy

# Add demo data (7 users: 3 admins, 2 staff, 2 customers)
npm run db:seed
```

---

## Step 5: Start Next.js Development Server

```bash
npm run dev
```

This runs the Next.js app locally (not in Docker).

**Visit:** http://localhost:3001

---

## Login with Demo Accounts

**Admin:**
- Email: `admin@storeflow.com`
- Password: `Admin@123`

**Staff:**
- Email: `staff@storeflow.com`
- Password: `Staff@123`

**Customer:**
- Email: `customer@storeflow.com`
- Password: `Customer@123`

See `TEST_LOGIN.md` for all demo accounts.

---

## Useful Commands

**Database:**
```bash
# View database in GUI
npx prisma studio

# Stop database
docker-compose down

# Restart database
docker-compose restart

# View database logs
docker logs storeflow-postgres

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
npm run db:seed
```

**Development:**
```bash
# Start dev server
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Build for production
npm run build
```

---

## Stopping Everything

```bash
# Stop dev server: Ctrl+C

# Stop database
docker-compose down
```

---

## Troubleshooting

### Docker not running
- Start Docker Desktop application
- Wait for it to fully start before running commands

### Port 5432 already in use
- Another PostgreSQL is running
- Stop it: `brew services stop postgresql` (macOS)
- Or change port in `docker-compose.yml`

### Database connection failed
- Ensure Docker container is running: `docker ps`
- Restart: `docker-compose restart`

### Tables don't exist
- Run migrations: `npx prisma migrate dev`
- Seed data: `npm run db:seed`

---

## Next Steps

✅ Project running locally
✅ Ready to develop!

**See also:**
- [Setup with Docker](../docs/SETUP_WITH_DOCKER.md) - Full setup guide
- [Testing Guide](../docs/TESTING.md) - Run tests
- [Production Deployment](../docs/PROD_DEPLOYMENT.md) - Deploy to production
