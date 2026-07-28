# Feature: Category Management

**What:** Organize products into hierarchical categories for easy browsing and filtering.

**Who needs it:** Store owners who need to organize their product catalog into logical groups.

---

## User Story

```
As a store owner,
I want to organize products into categories like "Electronics" and "Clothing",
So that customers can easily find products by browsing specific categories.
```

---

## How It Works

### 1. Create Category

**Via API:**
```bash
curl -X POST http://localhost:3001/api/categories \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Electronics",
    "description": "Electronic devices and accessories",
    "slug": "electronics"
  }'
```

**Result:**
```json
{
  "id": "clx_cat_123",
  "name": "Electronics",
  "description": "Electronic devices and accessories",
  "slug": "electronics",
  "createdAt": "2026-07-20T10:00:00Z"
}
```

### 2. List All Categories

**Via API (Public):**
```bash
curl http://localhost:3001/api/categories
```

**Result:**
```json
{
  "categories": [
    {
      "id": "clx_cat_123",
      "name": "Electronics",
      "slug": "electronics",
      "productCount": 15
    },
    {
      "id": "clx_cat_456",
      "name": "Clothing",
      "slug": "clothing",
      "productCount": 23
    }
  ]
}
```

---

## Database Schema

```prisma
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
```

---

## Demo Categories

After running `npm run db:seed`:

1. **Electronics**
   - Slug: `electronics`
   - Products: Laptop

2. **Clothing**
   - Slug: `clothing`
   - Products: T-Shirt

---

## API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/categories` | GET | No | List all categories |
| `/api/categories` | POST | Yes (ADMIN) | Create category |

---

## Next Steps

→ [Products](03-products.md) - Assign products to categories
→ [Orders](05-orders.md) - Process customer orders
