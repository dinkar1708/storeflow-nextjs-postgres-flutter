# Production Deployment Guide

Deploy StoreFlow for **FREE** to production.

---

## How Production Works

**Local Development:**
- Docker runs PostgreSQL locally (`docker-compose.yml`)
- Database URL: `postgresql://postgres:postgres@localhost:5432/storeflow`

**Production:**
- Platform provides managed PostgreSQL (no Docker needed)
- Platform sets `DATABASE_URL` automatically in environment variables
- Your code reads `DATABASE_URL` from environment (already configured in your code)
- **Same code, different database** - it just works!

**What makes it work:**
- `prisma/schema.prisma` → Uses `env("DATABASE_URL")` to connect
- `.env` (local) → Points to Docker database
- Platform environment variables (production) → Points to platform database
- Your Next.js code doesn't change at all!

---

## Platform Comparison

| Platform | Free Tier | Database Size | Best For |
|----------|-----------|---------------|----------|
| **Vercel + Vercel Postgres** | Yes | 256 MB | Demos, small projects |
| **Railway** | $5/month credit | 1 GB | Production apps |
| **Render + Supabase** | Yes (100%) | 500 MB | Free hosting, no credit card |

---

## Option 1: Vercel (Recommended)

**What you get:** Web hosting + PostgreSQL database, auto-deploy from GitHub

### Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/storeflow.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project" → Select your repo
   - Root Directory: `api-web`
   - Click "Deploy"

3. **Add PostgreSQL**
   - Project → Storage → Create Database → Postgres
   - Choose "Hobby" (free)

4. **Set Environment Variables**
   - Settings → Environment Variables:
   ```
   NEXTAUTH_SECRET=<run: openssl rand -base64 32>
   NEXTAUTH_URL=https://your-app.vercel.app
   ```

5. **Run Migrations**
   ```bash
   npm i -g vercel
   vercel login
   vercel link
   vercel env pull .env.production
   npx prisma migrate deploy
   npx prisma db seed  # Optional: demo data
   ```

**Done!** Visit `https://your-app.vercel.app`

---

## Option 2: Railway

**What you get:** Full-stack hosting (App + Database)

### Steps

1. **Push to GitHub** (same as Option 1)

2. **Create Railway Project**
   - Go to [railway.app](https://railway.app)
   - New Project → Deploy from GitHub → Select repo

3. **Add PostgreSQL**
   - In project → + New → Database → PostgreSQL
   - Railway auto-links `DATABASE_URL`

4. **Configure Service**
   - Click web service → Settings:
   - Root Directory: `api-web`
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npm start`

5. **Set Environment Variables**
   - Variables tab:
   ```
   NEXTAUTH_SECRET=<run: openssl rand -base64 32>
   NEXTAUTH_URL=https://your-app.railway.app
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   ```

6. **Run Migrations**
   ```bash
   npm i -g @railway/cli
   railway login
   railway link
   railway run npx prisma migrate deploy
   ```

**Done!** Visit your Railway URL

---

## Option 3: Render + Supabase

**What you get:** 100% free hosting (no credit card)

### Steps

1. **Create Supabase Database**
   - Go to [supabase.com](https://supabase.com) → New Project
   - Save the connection string from Settings → Database

2. **Deploy to Render**
   - Go to [render.com](https://render.com)
   - New + → Web Service → Connect GitHub repo
   - Root Directory: `api-web`
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npm start`

3. **Set Environment Variables**
   ```
   DATABASE_URL=<supabase-connection-string>
   NEXTAUTH_SECRET=<run: openssl rand -base64 32>
   NEXTAUTH_URL=https://your-app.onrender.com
   ```

4. **Run Migrations**
   - In Render → Shell tab:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

**Done!** Visit your Render URL

**Note:** Free tier sleeps after 15 min inactivity (30s wake-up time)

---

## Post-Deployment Checklist

✅ Homepage loads
✅ Login works (test all 3 roles)
✅ Admin dashboard accessible
✅ User management works
✅ Database queries working

---

## Environment Variables

Required for all platforms:

```env
DATABASE_URL="postgresql://..."           # Auto-provided by platform
NEXTAUTH_SECRET="<generate-random>"       # Run: openssl rand -base64 32
NEXTAUTH_URL="https://your-app-url.com"  # Your deployed URL
NODE_ENV="production"                     # Optional
```

---

## Troubleshooting

### Database Connection Failed
- Verify `DATABASE_URL` is set in platform environment variables
- Check database is running in platform dashboard

### Prisma Client Error
- Update build command: `npm install && npx prisma generate && npm run build`

### Migrations Not Applied
- Run manually: `npx prisma migrate deploy`

### 404 on Routes
- Ensure Root Directory is set to `api-web` in platform settings

---

## Auto-Deploy with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy and Migrate

on:
  push:
    branches: [main]

jobs:
  migrate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: cd api-web && npm install
      - run: cd api-web && npx prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

Add `DATABASE_URL` secret in GitHub repo → Settings → Secrets

---

## Custom Domain (Optional)

**Vercel:** Project → Settings → Domains → Add domain → Update DNS
**Railway:** Service → Settings → Domains → Add custom domain
**Render:** Service → Settings → Custom Domain

All platforms provide free SSL automatically.

---

## Recommended Setup

**Demos/Portfolio:** Vercel (easiest, free)
**Production:** Railway ($5/month, better limits)
**100% Free:** Render + Supabase (cold starts)

---

**Questions?** Check main [README.md](../README.md) or platform documentation.
