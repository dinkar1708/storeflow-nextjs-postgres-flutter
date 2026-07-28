# StoreFlow Documentation

Complete documentation for StoreFlow - Next.js E-Commerce Platform.

---

## Structure

```
docs/
├── README.md                    # This file
├── features/                    # Feature guides (8 docs)
├── core/                        # Core technical docs
│   └── architecture/            # System design & database
├── interfaces/                  # How to use (TODO)
├── development/                 # For developers (TODO)
└── getting-started/             # Quick start guides (TODO)
```

---

## Quick Navigation

### Getting Started

**New user?** Choose your setup method:
1. [Setup with Docker](getting-started/SETUP_WITH_DOCKER.md) - Easiest setup (Recommended)
2. [Setup Manual](getting-started/SETUP_MANUAL.md) - Manual PostgreSQL installation
3. [Test Credentials](../api-web/TEST_LOGIN.md) - Demo account logins

---

### Core Documentation

**Architecture & Design:**
- [System Architecture](core/architecture/ARCHITECTURE.md) - Tech stack, request flow, deployment
- [Database Schema](core/architecture/DATABASE_SCHEMA.md) - Complete Prisma schema with all models

**Deployment:**
- [Production Deployment](core/deployment/PROD_DEPLOYMENT.md) - Deploy to Vercel, Railway, or Render

**Development:**
- [Testing Guide](development/TESTING.md) - Run tests with Vitest

---

### Features

What StoreFlow can do:

| # | Feature | Description |
|---|---------|-------------|
| 01 | [Authentication](features/01-authentication.md) | User login, registration, role-based access (RBAC) |
| 02 | [User Management](features/02-user-management.md) | Admin user management, profiles |
| 03 | [Products](features/03-products.md) | Product catalog, inventory, pricing, stock tracking |
| 04 | [Categories](features/04-categories.md) | Product categorization |
| 05 | [Orders](features/05-orders.md) | Order processing, status tracking, workflow |
| 06 | [Analytics](features/06-analytics.md) | Sales analytics and reporting |
| 07 | [Wishlist](features/07-wishlist.md) | Customer wishlists |
| 08 | [Audit Logging](features/08-audit-logging.md) | Activity tracking |

---

## By Role

### Store Owner / Admin
1. [Authentication](features/01-authentication.md) - Login system
2. [User Management](features/02-user-management.md) - Manage users
3. [Products](features/03-products.md) - Manage catalog
4. [Orders](features/05-orders.md) - Process orders
5. [Analytics](features/06-analytics.md) - View sales reports

### Developer
1. [Architecture](core/architecture/ARCHITECTURE.md) - System design
2. [Database Schema](core/architecture/DATABASE_SCHEMA.md) - Data models
3. [Authentication](features/01-authentication.md) - Auth implementation
4. [Products API](features/03-products.md) - API examples

### Customer
1. [Products](features/03-products.md) - Browse products
2. [Orders](features/05-orders.md) - Place orders
3. [Wishlist](features/07-wishlist.md) - Save products

---

## Tech Stack Summary

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14, React 18, TypeScript |
| **Mobile** | Flutter (separate app) |
| **Backend** | Next.js API Routes |
| **Database** | PostgreSQL 15 + Prisma ORM |
| **Auth** | NextAuth.js + JWT |
| **Styling** | Tailwind CSS |
| **Testing** | Vitest |

---

## Feature Matrix

| Feature | Web UI | API | Mobile (Flutter) | Status |
|---------|--------|-----|------------------|--------|
| Authentication | ✅ | ✅ | ✅ | Complete |
| User Management | ✅ | ✅ | 🚧 | In Progress |
| Products | ✅ | ✅ | ✅ | Complete |
| Categories | ✅ | ✅ | ✅ | Complete |
| Orders | ✅ | ✅ | 🚧 | In Progress |
| Wishlist | ✅ | ✅ | ❌ | Planned |
| Analytics | ✅ | ✅ | ❌ | Basic |
| Audit Logging | ❌ | ✅ | ❌ | Backend Only |

**Legend:**
- ✅ Complete
- 🚧 In Progress
- ❌ Not Started

---

## Quick Links

**Most Used Docs:**
- [Authentication](features/01-authentication.md) - Login & RBAC
- [Products](features/03-products.md) - Product management
- [Orders](features/05-orders.md) - Order processing
- [Architecture](core/architecture/ARCHITECTURE.md) - System design
- [Database Schema](core/architecture/DATABASE_SCHEMA.md) - DB design

---

## Contributing

Found an issue or want to improve docs?
1. Open GitHub issue with label `documentation`
2. Or submit a PR

**Questions?** See [main README](../README.md)

---

**Last Updated:** 2026-07-28
