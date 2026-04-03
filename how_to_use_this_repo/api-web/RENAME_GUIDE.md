# Project Rename Guide

Automated script to rename and rebrand the entire project.

## Usage

**IMPORTANT:** Run from project root, not from this folder!

```bash
# Navigate to project root first
cd ../..

# Then run the script
./how_to_use_this_repo/api-web/rename-project.sh "YourAppName" "Your App Description"
```

---

## Examples

**Bookstore:**
```bash
./rename-project.sh "BookMart" "Bookstore Management System"
```

**Pharmacy:**
```bash
./rename-project.sh "PharmaPro" "Pharmacy Inventory Management"
```

**Restaurant:**
```bash
./rename-project.sh "FoodFlow" "Restaurant Order Management"
```

**Fashion Store:**
```bash
./rename-project.sh "StyleHub" "Fashion Retail Management"
```

---

## What Gets Updated

This script updates **EVERYTHING** in the project:

### Configuration Files
✅ `api-web/package.json` - Package name and description
✅ `api-web/.env` - Database name
✅ `api-web/.env.example` - Database name
✅ `docker-compose.yml` - PostgreSQL database name
✅ `README.md` - All mentions of "TestShop"
✅ `docs/*.md` - All documentation files

### Code Files
✅ All UI components (`app/**/*.tsx`, `app/**/*.ts`)
✅ All API routes (`app/api/**/*.ts`)
✅ Library files (`lib/**/*.ts`)
✅ Context providers (`contexts/**/*.tsx`)
✅ Test files (`__tests__/**/*.test.ts`)
✅ Config files (`next.config.js`, `tsconfig.json`, `tailwind.config.js`)
✅ Layout metadata (All `layout.tsx` files)

✨ Replaces "TestShop" **everywhere** in the codebase

---

## After Running the Script

The script will provide step-by-step instructions. For detailed setup guides, see:

📖 **Setup & Run:**
- [../../docs/SETUP_WITH_DOCKER.md](../../docs/SETUP_WITH_DOCKER.md) - Docker setup (Recommended)
- [../../docs/SETUP_MANUAL.md](../../docs/SETUP_MANUAL.md) - Manual setup without Docker

📖 **Additional Documentation:**
- [../../docs/DATABASE_SETUP.md](../../docs/DATABASE_SETUP.md) - Database configuration
- [../../docs/TESTING.md](../../docs/TESTING.md) - Running tests
- [../../docs/PROD_DEPLOYMENT.md](../../docs/PROD_DEPLOYMENT.md) - Deploy to production
- [../../README.md](../../README.md) - Main project documentation

---

## Optional Customizations

### Branding
- Replace `app/favicon.ico` with your logo
- Add your images to `public/` folder
- Update brand colors in `tailwind.config.js`

### Industry-Specific Fields

**Bookstore:**
Change "Products" → "Books"
Add: Author, ISBN, Publisher

**Pharmacy:**
Change "Products" → "Medicines"
Add: Composition, Expiry Date, Prescription Required

**Restaurant:**
Change "Products" → "Menu Items"
Add: Cuisine Type, Spice Level, Ingredients

**Fashion Store:**
Change "Products" → "Apparel"
Add: Size, Color, Material, Brand

See [../../README.md](../../README.md) for complete list of 15+ supported industries.

---

## Troubleshooting

**Script won't run?**
```bash
chmod +x rename-project.sh
```

**Database connection error?**
- Check `.env` file has correct database name
- Make sure Docker is running: `docker ps`
- Restart database: `docker-compose restart`

**Package not found?**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
