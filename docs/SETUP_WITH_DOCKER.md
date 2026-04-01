# Setup with Docker (Recommended - Easiest)

The fastest way to get StoreFlow running. No need to install PostgreSQL manually.

---

## What Docker Does

**Docker is only for the database:**
- ✅ Docker runs PostgreSQL database in a container
- ✅ Next.js application runs locally on your machine (npm run dev)
- ✅ This gives you easy database setup + fast development experience

**Architecture:**
```
┌─────────────────────┐         ┌──────────────────────┐
│  Docker Container   │         │   Your Machine       │
│                     │         │                      │
│  PostgreSQL DB      │◄────────│  Next.js App         │
│  Port: 5433         │         │  Port: 3001          │
└─────────────────────┘         └──────────────────────┘
```

---

## Prerequisites

Only need to install:

1. **Docker Desktop**
   - **macOS**: Download from [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/)
   - **Windows**: Download from [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/)
   - **Linux**:
     ```bash
     sudo apt-get update
     sudo apt-get install docker.io docker-compose
     ```

2. **Node.js v18+** (for running the Next.js app)
   - Download from [nodejs.org](https://nodejs.org/)

**Verify installations:**
```bash
docker --version
docker-compose --version
node --version
```

---

## Setup Steps

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/storeflow-nextjs-postgres-flutter.git
cd storeflow-nextjs-postgres-flutter/api-web
```

### 2. Start Docker Database

```bash
# Start PostgreSQL in Docker
docker-compose up -d
```

This will:
- Download PostgreSQL image (first time only)
- Create and start PostgreSQL container
- Expose database on `localhost:5433` (port 5433 to avoid conflict with local PostgreSQL if installed)

**Verify database is running:**
```bash
docker ps
```

You should see a container named `storeflow-postgres` running.

**Note:** Docker only runs the database. Your Next.js app runs locally with `npm run dev`.

---

### 3. Setup Environment

```bash
# Install dependencies
npm install

# Use development environment file (already configured for Docker)
cp .env.development .env
```

The `.env.development` file is pre-configured for Docker database:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/storeflow"
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="dev-secret-change-in-production-use-openssl-rand-base64-32"
PORT=3001
```

**Note:** Port 5433 (database) and 3001 (app) are used to avoid conflicts with other services.

**For production:** Use `.env.production` as template (see [Production Deployment](./PROD_DEPLOYMENT.md))

---

### 4. Setup Database Tables

```bash
# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma migrate deploy

# Add demo data (7 users: 3 admins, 2 staff, 2 customers)
npm run db:seed
```

---

### 5. Start the Next.js Application

```bash
npm run dev
```

This starts the Next.js development server locally (not in Docker).

**Visit:** http://localhost:3001

---

## Demo Login

Test with demo accounts from `api-web/TEST_LOGIN.md`:

**Admin:**
- Email: `admin@storeflow.com`
- Password: `Admin@123`

**Staff:**
- Email: `staff@storeflow.com`
- Password: `Staff@123`

**Customer:**
- Email: `customer@storeflow.com`
- Password: `Customer@123`

---

## Useful Docker Commands

```bash
# Start database
docker-compose up -d

# Stop database
docker-compose down

# View database logs
docker logs storeflow-postgres

# Access database shell
docker exec -it storeflow-postgres psql -U postgres -d storeflow

# Stop and remove everything (WARNING: deletes data)
docker-compose down -v
```

---

## Development Workflow

**Daily workflow:**

```bash
# 1. Start Docker database (only PostgreSQL)
docker-compose up -d

# 2. Start Next.js dev server (runs locally on your machine)
npm run dev

# 3. When done, stop database (optional)
docker-compose down
```

**What runs where:**
- 🐳 **Docker Container**: PostgreSQL database only (port 5433)
- 💻 **Your Machine**: Next.js application (port 3001)

**Database management:**

```bash
# View database in GUI
npx prisma studio

# Reset database (deletes all data)
npx prisma migrate reset
npm run db:seed
```

---

## Common Issues

### Issue 1: Port Already in Use

**Error:** `port is already allocated`

**Solution:** We use port 5433 by default (not 5432) to avoid conflicts with local PostgreSQL.

If 5433 is also in use, you can change it in `docker-compose.yml`:
```yaml
ports:
  - "5434:5432"  # Use 5434 instead
```

Then update `.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5434/storeflow"
```

---

### Issue 2: Docker Not Running

**Error:** `Cannot connect to the Docker daemon`

**Solution:**
- Start Docker Desktop application
- Wait for Docker to fully start (icon should be green/running)

---

### Issue 3: Database Connection Failed

**Check if container is running:**
```bash
docker ps
```

**Restart the container:**
```bash
docker-compose down
docker-compose up -d
```

---

## Why Use Docker for Database?

✅ **No manual PostgreSQL installation** - Just install Docker Desktop
✅ **Consistent environment** - Same database version for all developers
✅ **Easy to reset/clean** - `docker-compose down -v` removes everything
✅ **Fast development** - Next.js runs locally with hot-reload
✅ **Isolated** - Database runs separately, won't interfere with system

**Best of both worlds:**
- Database in Docker (consistent, isolated)
- App runs locally (fast development, easy debugging)

---

## Next Steps

1. ✅ Docker database running
2. ✅ Application running on localhost:3000
3. ✅ Ready to develop!

**See also:**
- [Testing Guide](./TESTING.md) - Run tests
- [Manual Setup Guide](./SETUP_MANUAL.md) - Setup without Docker
- [Database Schema](./DATABASE_SETUP.md) - Database details

---

**Need help?** Check the main [README.md](../README.md)
