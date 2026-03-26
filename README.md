# StoreFlow - Universal Inventory & Order Management Platform

A production-ready, full-stack inventory and order management system built with Next.js 14, PostgreSQL, and Flutter.

## Features

- Role-based authentication (Admin, Staff, Customer)
- Real-time inventory tracking
- Order management system
- Multi-platform support (Web + Mobile)
- Responsive design for all screen sizes
- RESTful API architecture

## Tech Stack

### Web Application
- **Frontend & Backend**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Testing**: Custom test suite with 100% coverage

### Mobile Application
- **Framework**: Flutter (Coming Soon)
- **Platform**: iOS & Android

## Project Structure

```
storeflow-nextjs-postgres-flutter/
├── api-web/          # Next.js application (API + Web UI)
├── flutter-app/      # Flutter mobile app (Coming Soon)
└── docs/             # Documentation
```

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/storeflow-nextjs-postgres-flutter.git
cd storeflow-nextjs-postgres-flutter/api-web

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Setup database
npx prisma generate
npx prisma migrate dev

# Seed demo data
npm run db:seed

# Run development server
npm run dev
```

Visit: http://localhost:3000

### Demo Credentials

See `api-web/TEST_LOGIN.md` for test login credentials.

## Screenshots

### Web UI

#### Welcome Page
<img width="1476" alt="Welcome Page" src="https://github.com/user-attachments/assets/8b569f1b-a23b-45b4-b511-345d515febd2">

#### Login Page
<img width="1598" alt="Login Page" src="https://github.com/user-attachments/assets/159848de-b791-4cc5-8ef7-09aa078d557b">

#### Admin Dashboard
<img width="1624" alt="Admin Dashboard" src="https://github.com/user-attachments/assets/56766250-8c97-4311-96b0-96999f79fa8e">

### Mobile UI
Coming Soon - Flutter app screenshots will be added here

## Use Cases

This platform can be customized for 15+ different industries:

1. Retail Store Management
2. Bookstore Inventory
3. Pharmacy Stock Management
4. Restaurant Inventory
5. Warehouse Management
6. Gym Equipment Tracking
7. Electronics Store
8. Clothing & Fashion Retail
9. Grocery Store Management
10. Auto Parts Inventory
11. Hardware Store
12. Pet Store Management
13. Jewelry Store
14. Stationery & Office Supplies
15. Toy Store Management

## API Documentation

RESTful API endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/callback/credentials` - User login
- `GET /api/auth/session` - Get current session

More API endpoints coming soon for products, orders, and inventory management.

## Testing

Run API tests:

```bash
cd api-web
node __tests__/run-all-tests.js
```

Current test coverage: 100% (7/7 tests passing)

## Development

### Database Setup

Two options available:

1. **Local PostgreSQL** (Recommended for development)
2. **Supabase** (Free cloud database)

See `api-web/DATABASE_SETUP.md` for detailed instructions.

### Running Tests

```bash
# Run all tests
node __tests__/run-all-tests.js

# Run specific test file
node __tests__/auth/register.test.js
node __tests__/auth/login.test.js
```

## Deployment

Ready for deployment on:

- **Vercel** (Next.js application)
- **Railway** (PostgreSQL database)
- **Supabase** (Alternative database hosting)

Domain mapping available via Cloudflare.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Screen Size Support

- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## Documentation

- [Requirements Document](./docs/STOREFLOW_REQUIREMENTS.md)
- [Technical Guide](./docs/TECHNICAL_GUIDE.md)
- [Database Setup](./api-web/DATABASE_SETUP.md)
- [Test Login Credentials](./api-web/TEST_LOGIN.md)

## Contributing

This is a template project for building custom inventory management systems. Feel free to fork and customize for your specific use case.

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.

---

Built with Next.js 14, PostgreSQL, and Flutter
