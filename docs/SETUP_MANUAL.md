# Setup without Docker (Manual Installation)

Complete step-by-step guide to set up StoreFlow by manually installing all dependencies.

**Prefer easier setup?** See **[Setup with Docker](./SETUP_WITH_DOCKER.md)** (recommended)

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### 1. Node.js (v18 or higher)

**Check if installed:**
```bash
node --version
```

**Install Node.js:**

- **macOS** (using Homebrew):
  ```bash
  brew install node
  ```

- **Windows**:
  - Download from [nodejs.org](https://nodejs.org/)
  - Run the installer
  - Choose "Automatically install necessary tools" option

- **Linux (Ubuntu/Debian)**:
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```

**Verify installation:**
```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show npm version
```

---

### 2. PostgreSQL Database (v14 or higher)

**Check if installed:**
```bash
psql --version
```

**Install PostgreSQL:**

**macOS** (using Homebrew):
```bash
# Install PostgreSQL
brew install postgresql@14

# Start PostgreSQL service
brew services start postgresql@14

# Verify installation
psql --version
```

**Windows**:
1. Download PostgreSQL from [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
2. Run the installer
3. Remember the password you set for the `postgres` user
4. Default port: 5432 (keep it as is)
5. Install pgAdmin (included in installer) for GUI management

**Linux (Ubuntu/Debian)**:
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify installation
psql --version
```

---

### 3. Git

**Check if installed:**
```bash
git --version
```

**Install Git:**

- **macOS**: `brew install git`
- **Windows**: Download from [git-scm.com](https://git-scm.com/download/win)
- **Linux**: `sudo apt install git`

---

## Database Setup

### Step 1: Create PostgreSQL Database

**macOS/Linux:**
```bash
# Connect to PostgreSQL
psql postgres

# Or if that doesn't work:
sudo -u postgres psql
```

**Windows:**
- Open pgAdmin or use Command Prompt:
```bash
psql -U postgres
```

### Step 2: Create Database and User

Once connected to PostgreSQL, run these commands:

```sql
-- Create database
CREATE DATABASE storeflow;

-- Create user (optional, if you want a dedicated user)
CREATE USER storeflow_user WITH PASSWORD 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE storeflow TO storeflow_user;

-- Exit psql
\q
```

**Alternative: Use default postgres user**

If you prefer to use the default `postgres` user, you only need to create the database:

```sql
CREATE DATABASE storeflow;
\q
```

---

## Project Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/storeflow-nextjs-postgres-flutter.git
cd storeflow-nextjs-postgres-flutter/api-web
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

```bash
# Copy example environment file
cp .env.example .env
```

**Edit `.env` file:**

Open `.env` in your text editor and update the database connection string:

**If using dedicated user:**
```env
DATABASE_URL="postgresql://storeflow_user:your_secure_password@localhost:5432/storeflow"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

**If using postgres user:**
```env
DATABASE_URL="postgresql://postgres:your_postgres_password@localhost:5432/storeflow"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

**Generate NEXTAUTH_SECRET:**
```bash
# Generate a random secret
openssl rand -base64 32
```

Copy the output and paste it as your `NEXTAUTH_SECRET` value.

---

### Step 4: Database Migration

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations (creates tables)
npx prisma migrate dev

# Seed the database with demo data
npm run db:seed
```

**What this does:**
- `prisma generate`: Creates TypeScript types from your database schema
- `prisma migrate dev`: Creates all database tables according to schema
- `db:seed`: Adds demo users and sample data

---

### Step 5: Run the Development Server

```bash
npm run dev
```

**Output should show:**
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

---

## Verify Installation

### 1. Open the Application

Visit: [http://localhost:3000](http://localhost:3000)

You should see the StoreFlow welcome page.

### 2. Test Login

Demo accounts are available at `api-web/TEST_LOGIN.md`

**Quick Test:**
- Email: `admin@storeflow.com`
- Password: `Admin@123`

---

## Common Issues & Solutions

### Issue 1: Port 3000 Already in Use

**Error:**
```
Port 3000 is already in use
```

**Solution:**
```bash
# Find and kill process using port 3000
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

Or run on different port:
```bash
PORT=3001 npm run dev
```

---

### Issue 2: PostgreSQL Connection Failed

**Error:**
```
Can't reach database server at localhost:5432
```

**Solution:**

1. Check if PostgreSQL is running:
   ```bash
   # macOS:
   brew services list | grep postgresql

   # Linux:
   sudo systemctl status postgresql

   # Windows (check services in Task Manager)
   ```

2. Start PostgreSQL if not running:
   ```bash
   # macOS:
   brew services start postgresql@14

   # Linux:
   sudo systemctl start postgresql

   # Windows: Start from Services or pgAdmin
   ```

3. Verify connection string in `.env` file matches your setup

---

### Issue 3: Prisma Migration Errors

**Error:**
```
Migration failed
```

**Solution:**

Reset the database and start fresh:
```bash
# WARNING: This deletes all data
npx prisma migrate reset

# Then seed again
npm run db:seed
```

---

### Issue 4: Node Version Too Old

**Error:**
```
Node version not supported
```

**Solution:**

Update Node.js to v18 or higher:
```bash
# Using nvm (recommended):
nvm install 18
nvm use 18

# Or download from nodejs.org
```

---

## Development Tools (Optional)

### 1. Prisma Studio (Database GUI)

View and edit database records visually:
```bash
npx prisma studio
```

Opens at: [http://localhost:5555](http://localhost:5555)

### 2. VS Code Extensions (Recommended)

- **Prisma** - Syntax highlighting for Prisma schema
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Tailwind CSS IntelliSense** - Tailwind autocomplete

### 3. PostgreSQL GUI Clients

- **pgAdmin** (included with PostgreSQL installer)
- **TablePlus** (macOS/Windows) - [tableplus.com](https://tableplus.com/)
- **DBeaver** (Cross-platform) - [dbeaver.io](https://dbeaver.io/)

---

## Testing Setup

Run tests to verify everything works:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# View test UI
npm run test:ui
```

**Expected output:**
```
✓ 24/24 tests passing
```

---

## Next Steps

1. ✅ Environment setup complete
2. ✅ Database running and seeded
3. ✅ Application running on localhost:3000
4. ✅ Tests passing

**You're ready to start development!**

### Recommended Reading:

- [Testing Guide](./TESTING.md) - How tests work
- [Database Setup](./DATABASE_SETUP.md) - Database schema details
- [Test Credentials](../api-web/TEST_LOGIN.md) - Demo account logins

---

## Quick Reference

**Start development:**
```bash
cd api-web
npm run dev
```

**Database commands:**
```bash
npx prisma studio          # Open database GUI
npx prisma migrate dev     # Run migrations
npm run db:seed            # Seed demo data
npx prisma migrate reset   # Reset database (WARNING: deletes data)
```

**Testing:**
```bash
npm test                   # Run all tests
npm run test:watch         # Watch mode
npm run test:ui            # Interactive UI
```

---

**Need help?** Check the main [README.md](../README.md) for more information.
