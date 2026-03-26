# StoreFlow - Technical Implementation Guide

> **Next.js 14 Full-Stack Application**
> Complete technical documentation for developers

[![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0+-2D3748.svg)](https://www.prisma.io/)

---

##  Tech Stack

### Framework
- **Next.js 14** - App Router with Server Components
- **React 18** - Server & Client Components
- **TypeScript 5** - Full type safety

### Database & ORM
- **PostgreSQL 15** - Relational database
- **Prisma 5** - Type-safe ORM with migrations

### Authentication
- **NextAuth.js** - Complete authentication solution
- **JWT** - Token-based auth
- **Bcrypt** - Password hashing

### UI & Styling
- **Tailwind CSS** - Utility-first CSS
- **Shadcn UI** - Component library
- **Radix UI** - Accessible primitives

### State Management
- **React Server Components** - Server state
- **Zustand** - Client state management

### Validation
- **Zod** - Runtime type validation
- **React Hook Form** - Form handling

### i18n
- **next-intl** - Internationalization

### Testing
- **Vitest** - Unit testing
- **Playwright** - E2E testing
- **React Testing Library** - Component testing

---

##  Project Structure

```
app/
├── [locale]/                    # i18n locale wrapper
│   ├── (auth)/                  # Auth route group (no layout)
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/             # Protected route group
│   │   ├── admin/
│   │   ├── staff/
│   │   └── customer/
│   └── layout.tsx
├── api/                         # API Routes
│   ├── auth/
│   │   ├── login/route.ts
│   │   ├── register/route.ts
│   │   └── logout/route.ts
│   ├── users/
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   ├── products/
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   └── orders/
│       ├── route.ts
│       └── [id]/route.ts
├── components/
│   ├── ui/                      # Shadcn components
│   ├── forms/
│   └── shared/
├── lib/
│   ├── prisma.ts                # Prisma client
│   ├── auth.ts                  # NextAuth config
│   ├── validations/             # Zod schemas
│   └── utils.ts
├── middleware.ts                # Auth & i18n middleware
└── layout.tsx

prisma/
├── schema.prisma
├── migrations/
└── seed.ts

public/
└── locales/
    ├── en/
    └── hi/
```

---

##  Installation & Setup

### Prerequisites
- Node.js 18+ (LTS recommended)
- PostgreSQL 15+ or Supabase account
- Git

### Step 1: Clone & Install

```bash
git clone https://github.com/your-repo/storeflow.git
cd storeflow
npm install
```

### Step 2: Environment Variables

Create `.env` file:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/storeflow"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Optional: Email
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="app-password"
EMAIL_FROM="noreply@storeflow.com"
```

### Step 3: Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database
npx prisma db seed
```

### Step 4: Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

---

## 📦 Available Scripts

```bash
# Development
npm run dev                 # Start dev server

# Build
npm run build               # Production build
npm run start               # Start production server

# Database
npx prisma studio           # Open Prisma Studio
npx prisma migrate dev      # Create & run migration
npx prisma migrate deploy   # Deploy migrations (production)
npx prisma db seed          # Seed database
npx prisma generate         # Generate Prisma Client

# Testing
npm run test                # Run unit tests
npm run test:e2e            # Run E2E tests
npm run test:watch          # Watch mode

# Code Quality
npm run lint                # ESLint
npm run type-check          # TypeScript check
```

---

##  Database Schema (Prisma)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  role      Role     @default(CUSTOMER)
  orders    Order[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  ADMIN
  STAFF
  CUSTOMER
}

model Product {
  id          String   @id @default(cuid())
  name        String
  description String?
  price       Decimal
  stock       Int
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id])
  images      String[]
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Category {
  id       String    @id @default(cuid())
  name     String
  products Product[]
}

model Order {
  id         String      @id @default(cuid())
  orderNumber String     @unique
  userId     String
  user       User        @relation(fields: [userId], references: [id])
  status     OrderStatus @default(PENDING)
  total      Decimal
  items      OrderItem[]
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PROCESSING
  PACKED
  SHIPPED
  DELIVERED
  CANCELLED
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id])
  productId String
  quantity  Int
  price     Decimal
}
```

---

##  Authentication (NextAuth.js)

### Configuration: `lib/auth.ts`

```typescript
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials?.password || '',
          user.password
        );

        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};
```

### Middleware: `middleware.ts`

```typescript
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Admin only
    if (path.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    // Staff + Admin
    if (
      path.startsWith('/staff') &&
      !['ADMIN', 'STAFF'].includes(token?.role)
    ) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/admin/:path*', '/staff/:path*', '/customer/:path*'],
};
```

---

##  API Routes Examples

### GET /api/products

```typescript
// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(category && { categoryId: category }),
    },
    include: { category: true },
  });

  return NextResponse.json(products);
}
```

### POST /api/products (Protected)

```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { productSchema } from '@/lib/validations/product';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  // Check auth & role
  if (!session || !['ADMIN', 'STAFF'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await request.json();

  // Validate with Zod
  const validation = productSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.errors },
      { status: 400 }
    );
  }

  const product = await prisma.product.create({
    data: validation.data,
  });

  return NextResponse.json(product, { status: 201 });
}
```

---

## 🌍 Internationalization (i18n)

### Setup: `i18n.ts`

```typescript
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./locales/${locale}.json`)).default,
}));
```

### Translation Files

**`public/locales/en.json`**
```json
{
  "common": {
    "welcome": "Welcome",
    "logout": "Logout"
  },
  "products": {
    "addToCart": "Add to Cart",
    "outOfStock": "Out of Stock"
  }
}
```

**`public/locales/hi.json`**
```json
{
  "common": {
    "welcome": "स्वागत है",
    "logout": "लॉग आउट"
  },
  "products": {
    "addToCart": "कार्ट में जोड़ें",
    "outOfStock": "स्टॉक में नहीं"
  }
}
```

### Usage in Components

```typescript
'use client';

import { useTranslations } from 'next-intl';

export function ProductCard() {
  const t = useTranslations('products');

  return (
    <button>{t('addToCart')}</button>
  );
}
```

---

##  Testing

### Unit Test Example (Vitest)

```typescript
import { describe, it, expect } from 'vitest';
import { calculateTotal } from './utils';

describe('calculateTotal', () => {
  it('should calculate order total correctly', () => {
    const items = [
      { price: 10, quantity: 2 },
      { price: 5, quantity: 3 },
    ];

    const total = calculateTotal(items);

    expect(total).toBe(35);
  });
});
```

### E2E Test Example (Playwright)

```typescript
import { test, expect } from '@playwright/test';

test('user can login', async ({ page }) => {
  await page.goto('http://localhost:3000/login');

  await page.fill('[name=email]', 'admin@storeflow.com');
  await page.fill('[name=password]', 'Admin@123');
  await page.click('button[type=submit]');

  await expect(page).toHaveURL('/admin');
});
```

---

##  Deployment

### Option 1: Vercel (Recommended)

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

```bash
# Vercel CLI
npm install -g vercel
vercel login
vercel --prod
```

### Option 2: Railway

1. Connect GitHub repo
2. Add environment variables
3. Auto-deploy on push

### Option 3: Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t storeflow .
docker run -p 3000:3000 storeflow
```

---

##  Environment Variables Reference

### Development (.env.local)

```bash
DATABASE_URL="postgresql://localhost:5432/storeflow"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret-key"
```

### Production (.env.production)

```bash
DATABASE_URL="postgresql://user:pass@db.supabase.co:5432/postgres"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="production-secret-openssl-generated"
```

---

##  Performance Optimization

### Image Optimization

```typescript
import Image from 'next/image';

<Image
  src="/product.jpg"
  alt="Product"
  width={300}
  height={300}
  loading="lazy"
/>
```

### Code Splitting

```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
});
```

### Server Components (Default)

```typescript
// app/products/page.tsx
// This is a Server Component by default
export default async function ProductsPage() {
  const products = await prisma.product.findMany();

  return <ProductList products={products} />;
}
```

---

##  Troubleshooting

### Prisma Client Not Generated

```bash
npx prisma generate
```

### Database Connection Issues

```bash
# Test connection
npx prisma db pull
```

### NextAuth Session Issues

```bash
# Regenerate secret
openssl rand -base64 32
```

### Build Errors

```bash
# Clear cache
rm -rf .next
npm run build
```

---

##  Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn UI Components](https://ui.shadcn.com)

---

**For business requirements, see STOREFLOW_REQUIREMENTS.md**
