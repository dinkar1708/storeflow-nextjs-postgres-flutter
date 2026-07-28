# Database Schema

Complete database schema for StoreFlow, managed by Prisma ORM with PostgreSQL.

---

## Entity Relationship Diagram

```
User (1) ───── (N) Order
  │                  │
  │                  │
  └──── (N) Wishlist │
           │         │
           │         └──── (N) OrderItem ───── (1) Product
           │                                         │
           └─────────────────────────────────────────┘
                                                     │
                                                     └──── (1) Category
```

---

## Complete Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  ADMIN
  STAFF
  CUSTOMER
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

model User {
  id        String     @id @default(cuid())
  email     String     @unique
  password  String
  name      String
  role      Role       @default(CUSTOMER)
  phone     String?
  address   String?
  isActive  Boolean    @default(true)
  orders    Order[]
  wishlist  Wishlist[]
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  @@index([email])
  @@map("users")
}

model Category {
  id          String    @id @default(cuid())
  name        String
  description String?
  slug        String    @unique
  products    Product[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@map("categories")
}

model Product {
  id           String      @id @default(cuid())
  name         String
  description  String?
  price        Decimal     @db.Decimal(10, 2)
  costPrice    Decimal?    @db.Decimal(10, 2)
  stock        Int         @default(0)
  sku          String?     @unique
  images       String[]
  categoryId   String
  category     Category    @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  isActive     Boolean     @default(true)
  orderItems   OrderItem[]
  wishlistedBy Wishlist[]
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt

  @@index([categoryId])
  @@index([sku])
  @@map("products")
}

model Order {
  id              String      @id @default(cuid())
  orderNumber     String      @unique
  userId          String
  user            User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  status          OrderStatus @default(PENDING)
  total           Decimal     @db.Decimal(10, 2)
  items           OrderItem[]
  shippingAddress String?
  notes           String?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  @@index([userId])
  @@index([orderNumber])
  @@map("orders")
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  quantity  Int
  price     Decimal @db.Decimal(10, 2)

  @@index([orderId])
  @@index([productId])
  @@map("order_items")
}

model Wishlist {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@unique([userId, productId])
  @@index([userId])
  @@index([productId])
  @@map("wishlists")
}

model AuditLog {
  id        String   @id @default(cuid())
  userId    String?
  action    String
  entity    String
  entityId  String?
  details   String?
  ipAddress String?
  createdAt DateTime @default(now())

  @@index([userId])
  @@index([entity, entityId])
  @@map("audit_logs")
}
```

---

## Table Details

### Users Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | String | PK | CUID identifier |
| email | String | UNIQUE, INDEXED | User email (login) |
| password | String | | bcrypt hashed password |
| name | String | | Full name |
| role | Enum | DEFAULT: CUSTOMER | Access level |
| phone | String | NULLABLE | Contact number |
| address | String | NULLABLE | Shipping address |
| isActive | Boolean | DEFAULT: true | Account status |
| createdAt | DateTime | | Account creation |
| updatedAt | DateTime | AUTO | Last update |

### Products Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | String | PK | CUID identifier |
| name | String | | Product name |
| description | String | NULLABLE | Product details |
| price | Decimal(10,2) | | Selling price |
| costPrice | Decimal(10,2) | NULLABLE | Business cost |
| stock | Int | DEFAULT: 0 | Available quantity |
| sku | String | UNIQUE, INDEXED, NULLABLE | Stock keeping unit |
| images | String[] | | Array of image URLs |
| categoryId | String | FK → Category | Product category |
| isActive | Boolean | DEFAULT: true | Visibility status |
| createdAt | DateTime | | Creation timestamp |
| updatedAt | DateTime | AUTO | Last update |

---

## Indexes

**Performance-critical indexes:**
- `users.email` - Login queries
- `products.sku` - Inventory lookups
- `products.categoryId` - Category filtering
- `orders.userId` - User order history
- `orders.orderNumber` - Order tracking

---

## Cascade Deletion Rules

**When User deleted:**
- Orders → CASCADE (delete)
- Wishlist → CASCADE (delete)

**When Category deleted:**
- Products → CASCADE (delete products in category)

**When Product deleted:**
- OrderItems → CASCADE (delete from order history)
- Wishlist → CASCADE (remove from wishlists)

**When Order deleted:**
- OrderItems → CASCADE (delete line items)

---

## Migrations

```bash
# Create new migration
npx prisma migrate dev --name add_user_phone

# Apply migrations (production)
npx prisma migrate deploy

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

---

## Seed Data

```bash
# Load demo data
npm run db:seed
```

**Creates:**
- 3 Admin users
- 2 Staff users
- 2 Customer users
- 2 Categories (Electronics, Clothing)
- 2 Products (Laptop, T-Shirt)

---

## Next Steps

→ [Architecture](ARCHITECTURE.md) - System architecture
→ [API Documentation](API.md) - API endpoints
