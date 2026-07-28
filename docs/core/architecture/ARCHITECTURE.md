# System Architecture

**StoreFlow** is a full-stack e-commerce platform built with Next.js 14, following modern web architecture patterns.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Clients                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │ Web UI   │  │ Flutter  │  │ API      │                  │
│  │ (Next.js)│  │ Mobile   │  │ Clients  │                  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘                  │
└───────┼─────────────┼─────────────┼────────────────────────┘
        │             │             │
        └─────────────┼─────────────┘
                      │
        ┌─────────────▼─────────────┐
        │     Next.js 14 Server     │
        │   (App Router + API)      │
        ├───────────────────────────┤
        │  • Server Components      │
        │  • API Routes             │
        │  • NextAuth.js            │
        │  • Middleware (RBAC)      │
        └─────────────┬─────────────┘
                      │
        ┌─────────────▼─────────────┐
        │      Prisma ORM           │
        │   (Type-safe queries)     │
        └─────────────┬─────────────┘
                      │
        ┌─────────────▼─────────────┐
        │   PostgreSQL Database     │
        │   (Docker container)      │
        └───────────────────────────┘
```

---

## Component Breakdown

### 1. Frontend Layer

**Web UI (Next.js)**
- Server Components for initial render
- Client Components for interactivity
- Tailwind CSS for styling
- Route-based code splitting

**Mobile App (Flutter)**
- Native iOS/Android apps
- Consumes REST API
- JWT authentication

### 2. API Layer

**Next.js API Routes** (`/app/api`)
- RESTful endpoints
- JSON responses
- Route handlers for CRUD operations

**Authentication**
- NextAuth.js for web sessions
- JWT tokens for API/mobile clients
- bcrypt for password hashing

**Middleware**
- Role-based access control (RBAC)
- Session validation
- Request logging

### 3. Data Layer

**Prisma ORM**
- Type-safe database client
- Schema migrations
- Query building

**PostgreSQL Database**
- Relational data storage
- ACID transactions
- Indexes for performance

---

## Request Flow

### 1. Web Request (Server Component)

```
User visits /admin/products
    ↓
Next.js Server Component
    ↓
getServerSession() validates auth
    ↓
Prisma query to PostgreSQL
    ↓
Server renders HTML with data
    ↓
Client receives rendered page
```

### 2. API Request (Mobile/Client)

```
Mobile app → POST /api/auth/login
    ↓
API route handler validates credentials
    ↓
Prisma finds user in database
    ↓
bcrypt compares password hash
    ↓
JWT token generated
    ↓
Token returned to client
    ↓
Client stores token
    ↓
Future requests include: Authorization: Bearer <token>
```

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend (Web)** | Next.js 14, React 18, TypeScript | Server + Client Components |
| **Frontend (Mobile)** | Flutter | Native mobile apps |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **API** | Next.js API Routes | RESTful endpoints |
| **Authentication** | NextAuth.js + JWT | Session + token auth |
| **ORM** | Prisma 5 | Type-safe database client |
| **Database** | PostgreSQL 15 | Relational database |
| **Validation** | Zod | Runtime validation |
| **Testing** | Vitest | Unit testing |

---

## Database Schema

See [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) for complete schema documentation.

**Key Models:**
- User (authentication + profile)
- Product (catalog)
- Category (organization)
- Order (transactions)
- OrderItem (line items)
- Wishlist (saved items)
- AuditLog (system tracking)

---

## Authentication Flow

### Web (NextAuth.js)

```
1. User submits login form
2. NextAuth credential provider validates
3. Session created in database
4. HTTP-only cookie set
5. User redirected to role-specific dashboard
```

### API (JWT)

```
1. Client sends POST /api/auth/login
2. Server validates credentials
3. JWT token generated with user data
4. Token returned in response
5. Client includes token in Authorization header
```

---

## Authorization (RBAC)

**Roles:**
- ADMIN: Full system access
- STAFF: Inventory + orders
- CUSTOMER: Shopping only

**Implementation:**
```typescript
// middleware.ts
export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (path.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/403', req.url));
    }
    // ... more role checks
  }
);
```

---

## Deployment Architecture

### Development
```
Local Machine
├── Next.js dev server (port 3001)
└── PostgreSQL Docker container (port 5433)
```

### Production (Recommended: Vercel)
```
Vercel Edge Network
├── Next.js app (serverless)
├── Static assets (CDN)
└── Environment variables
        ↓
Supabase/Railway
└── PostgreSQL database (managed)
```

See [deployment guide](../deployment/DEPLOYMENT.md) for details.

---

## Security Architecture

**Data Protection:**
- Passwords hashed with bcrypt (10 rounds)
- JWT secrets in environment variables
- SQL injection prevention (Prisma ORM)
- XSS protection (React auto-escaping)

**Authentication:**
- Session-based (web)
- Token-based (API)
- HTTP-only cookies
- CSRF protection

**Authorization:**
- Role-based access control
- Middleware route protection
- API endpoint validation

See [security documentation](../security/README.md) for details.

---

## Performance Optimizations

**Next.js Features:**
- Server Components (reduce client JS)
- Route-based code splitting
- Image optimization
- Static page caching

**Database:**
- Indexed fields (email, sku, orderNumber)
- Connection pooling (Prisma)
- Query optimization

---

## Scalability Considerations

**Current Scale:**
- Supports 100-1000 concurrent users
- Database: 1-10GB
- Single server deployment

**Future Scaling:**
- Redis for session storage
- CDN for static assets
- Database read replicas
- Queue for background jobs

---

## Folder Structure

```
api-web/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── admin/             # Admin pages
│   ├── staff/             # Staff pages
│   ├── customer/          # Customer pages
│   └── layout.tsx         # Root layout
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── migrations/        # DB migrations
├── lib/                   # Utilities
│   ├── auth.ts           # NextAuth config
│   ├── prisma.ts         # DB client
│   └── validations/      # Zod schemas
├── middleware.ts          # Auth middleware
└── .env                   # Environment config
```

---

## Next Steps

→ [Database Schema](DATABASE_SCHEMA.md) - Database design
→ [API Documentation](API.md) - API endpoints reference
→ [Security](../security/README.md) - Security best practices
