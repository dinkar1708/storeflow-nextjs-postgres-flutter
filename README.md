# StoreFlow

Universal Inventory & Order Management Platform

## Project Structure

```
storeflow-nextjs-postgres-flutter/
├── api-web/           # Next.js API + Web UI
├── flutter-app/       # Flutter mobile app
└── docs/              # Documentation
```

## Getting Started

### 1. API & Web (Next.js)

```bash
cd api-web
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
```

Visit: http://localhost:3000

### 2. Flutter App (Coming Soon)

```bash
cd flutter-app
# Flutter setup instructions
```

## Documentation

- [Requirements](./docs/STOREFLOW_REQUIREMENTS.md)
- [Technical Guide](./docs/TECHNICAL_GUIDE.md)

## Tech Stack

- **API & Web**: Next.js 14, TypeScript, PostgreSQL, Prisma
- **Mobile**: Flutter (coming soon)

## License

MIT
