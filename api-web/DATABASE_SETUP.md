# Database Setup Guide

## Option 1: Local PostgreSQL (Recommended for Development)

### Install PostgreSQL on macOS

```bash
# Using Homebrew
brew install postgresql@15

# Start PostgreSQL
brew services start postgresql@15

# Create database
createdb storeflow
```

### Run Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations (creates tables)
npx prisma migrate dev --name init

# Seed demo data
npm run db:seed
```

### Verify Setup

```bash
# Open Prisma Studio to view data
npx prisma studio
```

---

## Option 2: Supabase (Free Cloud Database)

### 1. Create Account
- Go to https://supabase.com
- Sign up (free tier)

### 2. Create Project
- Create new project
- Copy the database connection string

### 3. Update .env

Replace `DATABASE_URL` in `.env`:

```
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres"
```

### 4. Run Migrations

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
```

---

## Demo Login Credentials

After seeding, use these credentials:

### Admin
- Email: admin@storeflow.com
- Password: Admin@123

### Staff
- Email: staff@storeflow.com
- Password: Staff@123

### Customer
- Email: customer@storeflow.com
- Password: Customer@123

---

## Troubleshooting

### Can't connect to database

Check if PostgreSQL is running:
```bash
brew services list
```

### Connection refused

Make sure DATABASE_URL in `.env` is correct:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/storeflow"
```

### Migration fails

Reset database:
```bash
npx prisma migrate reset
npm run db:seed
```
