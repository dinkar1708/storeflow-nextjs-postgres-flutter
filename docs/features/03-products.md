# Feature: Product Management

**What:** Complete product catalog management with images, categories, stock tracking, and pricing.

**Who needs it:** E-commerce businesses that need to manage product listings, inventory, and pricing.

---

## User Story

```
As a store owner,
I want to create and manage product listings with images, prices, and stock levels,
So that customers can browse and purchase products from my store.
```

---

## How It Works

### 1. Create Product

**Via API:**
```bash
curl -X POST http://localhost:3001/api/admin/products \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Wireless Headphones",
    "description": "Premium noise-cancelling headphones",
    "price": 199.99,
    "costPrice": 120.00,
    "stock": 50,
    "sku": "WH-001",
    "categoryId": "clx_category_electronics",
    "images": [
      "https://example.com/headphones-1.jpg",
      "https://example.com/headphones-2.jpg"
    ],
    "isActive": true
  }'
```

**Result:**
```json
{
  "id": "clx_product_123",
  "name": "Wireless Headphones",
  "description": "Premium noise-cancelling headphones",
  "price": "199.99",
  "costPrice": "120.00",
  "stock": 50,
  "sku": "WH-001",
  "categoryId": "clx_category_electronics",
  "category": {
    "id": "clx_category_electronics",
    "name": "Electronics",
    "slug": "electronics"
  },
  "images": [
    "https://example.com/headphones-1.jpg",
    "https://example.com/headphones-2.jpg"
  ],
  "isActive": true,
  "createdAt": "2026-07-20T10:00:00Z"
}
```

### 2. List Products

**Public API (no auth):**
```bash
# All active products
curl http://localhost:3001/api/products

# Filter by category
curl http://localhost:3001/api/products?category=electronics

# Search by name
curl http://localhost:3001/api/products?search=headphones
```

**Admin API (with inactive products):**
```bash
curl http://localhost:3001/api/admin/products \
  -H "Authorization: Bearer <admin_token>"
```

### 3. Update Product

**Via API:**
```bash
curl -X PUT http://localhost:3001/api/admin/products/clx_product_123 \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 179.99,
    "stock": 45
  }'
```

### 4. Delete Product

**Via API:**
```bash
curl -X DELETE http://localhost:3001/api/admin/products/clx_product_123 \
  -H "Authorization: Bearer <admin_token>"
```

**Note:** This is a hard delete. Product is removed from database along with related order items (cascade).

---

## Access Control

| Action | ADMIN | STAFF | CUSTOMER | Public |
|--------|-------|-------|----------|--------|
| View active products | ✅ | ✅ | ✅ | ✅ |
| View inactive products | ✅ | ✅ | ❌ | ❌ |
| Create product | ✅ | ❌ | ❌ | ❌ |
| Update product | ✅ | ❌ | ❌ | ❌ |
| Delete product | ✅ | ❌ | ❌ | ❌ |
| Manage stock | ✅ | ✅ | ❌ | ❌ |

---

## Database Schema

```prisma
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
```

**Key Fields:**
- **price**: Selling price (customer pays)
- **costPrice**: Cost to business (for profit calculation)
- **stock**: Available quantity
- **sku**: Stock Keeping Unit (unique identifier)
- **images**: Array of image URLs
- **isActive**: Controls product visibility

---

## Product Images

### Current Implementation

**Storage:** Array of image URLs stored in database
```json
{
  "images": [
    "https://example.com/product-1.jpg",
    "https://example.com/product-2.jpg"
  ]
}
```

**Requirements:**
- Must be valid URLs
- Recommended: Use CDN for performance
- Supported formats: JPG, PNG, WebP

### Image Upload Options

**Option 1: Upload to S3/Cloud Storage**
```bash
# 1. Upload image to S3
aws s3 cp product.jpg s3://your-bucket/products/product.jpg

# 2. Get public URL
IMAGE_URL="https://your-bucket.s3.amazonaws.com/products/product.jpg"

# 3. Add URL to product
curl -X POST http://localhost:3001/api/admin/products \
  -d '{"images": ["'$IMAGE_URL'"], ...}'
```

**Option 2: Upload to Next.js Public Folder**
```bash
# 1. Copy to public folder
cp product.jpg api-web/public/products/product.jpg

# 2. Use relative URL
curl -X POST http://localhost:3001/api/admin/products \
  -d '{"images": ["/products/product.jpg"], ...}'
```

---

## Stock Management

### Check Stock Availability

```bash
curl http://localhost:3001/api/products/clx_product_123
```

**Response:**
```json
{
  "id": "clx_product_123",
  "name": "Wireless Headphones",
  "stock": 5,
  "isActive": true
}
```

### Low Stock Alert

**Custom Logic (future feature):**
- Notify admin when stock < 10
- Automatic reorder suggestions
- Stock history tracking

### Out of Stock Handling

**Current Behavior:**
- Products with `stock: 0` can still be added to cart
- Order validation prevents checkout if stock insufficient
- Customer sees "Out of Stock" badge on UI

**Recommended:**
- Set `isActive: false` when stock reaches 0
- Re-enable when restocked

---

## Pricing

### Price Types

**1. Selling Price (`price`):**
- Customer-facing price
- Includes markup/profit margin
- Stored as Decimal(10,2) - supports up to $99,999,999.99

**2. Cost Price (`costPrice`):**
- Optional field
- Internal cost to business
- Used for profit calculations
- Not shown to customers

### Profit Margin Calculation

```typescript
// Calculate profit margin percentage
const profitMargin = ((price - costPrice) / price) * 100;

// Example:
// price: $199.99
// costPrice: $120.00
// Profit: $79.99 (40% margin)
```

### Discount Management

**Current:** No built-in discount system

**Future Plans:**
- Discount codes/coupons
- Percentage or fixed amount discounts
- Time-limited sales
- Bulk pricing

---

## API Endpoints

| Endpoint | Method | Auth | Role | Description |
|----------|--------|------|------|-------------|
| `/api/products` | GET | No | Public | List active products |
| `/api/products/:id` | GET | No | Public | Get product details |
| `/api/admin/products` | GET | Yes | ADMIN | List all products (including inactive) |
| `/api/admin/products` | POST | Yes | ADMIN | Create product |
| `/api/admin/products/:id` | PUT | Yes | ADMIN | Update product |
| `/api/admin/products/:id` | DELETE | Yes | ADMIN | Delete product |

---

## Validation Rules

### Product Creation

**Required Fields:**
- `name` (string, 2-200 chars)
- `price` (decimal, > 0)
- `categoryId` (valid category ID)

**Optional Fields:**
- `description` (string, max 2000 chars)
- `costPrice` (decimal, >= 0)
- `stock` (integer, >= 0, default: 0)
- `sku` (string, unique, alphanumeric + hyphens)
- `images` (array of URLs)
- `isActive` (boolean, default: true)

**Validation Rules:**
```typescript
// Zod schema example
const productSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().max(2000).optional(),
  price: z.number().positive(),
  costPrice: z.number().nonnegative().optional(),
  stock: z.number().int().nonnegative().default(0),
  sku: z.string().regex(/^[A-Z0-9-]+$/i).optional(),
  categoryId: z.string().cuid(),
  images: z.array(z.string().url()).default([]),
  isActive: z.boolean().default(true)
});
```

---

## Demo Products

After running `npm run db:seed`, these products are created:

**1. Laptop**
- Price: $999.99
- Stock: 10 units
- SKU: LAPTOP-001
- Category: Electronics

**2. T-Shirt**
- Price: $19.99
- Stock: 50 units
- SKU: TSHIRT-001
- Category: Clothing

---

## Web UI Features

### Customer Product Listing (`/customer/products`)

**Features:**
- Grid/list view toggle
- Filter by category
- Search by name
- Sort by: price, name, newest
- Product cards with:
  - Image
  - Name
  - Price
  - Stock status
  - Add to cart button
  - Add to wishlist button

### Admin Product Management (`/admin/products`)

**Features:**
- Table view with all products
- Create new product form
- Edit product inline
- Delete product (with confirmation)
- Filter by category, status
- Search by name, SKU
- Bulk actions (future)

**Table Columns:**
- Image thumbnail
- Name
- SKU
- Price
- Cost Price (hidden from public)
- Stock
- Category
- Status (Active/Inactive)
- Actions

---

## Testing

### Manual Test Checklist

1. **Create product as admin**
   - Login as admin
   - Navigate to `/admin/products`
   - Click "Add Product"
   - Fill form and submit
   - Verify product appears in list

2. **View products as customer**
   - Logout
   - Visit `/customer/products` (or public route)
   - Verify only active products shown
   - Verify product details display correctly

3. **Stock tracking**
   - Create product with stock: 5
   - Place order for quantity: 3
   - Verify stock reduces to 2

4. **Category filtering**
   - Create products in different categories
   - Use category filter
   - Verify only products in category shown

---

## Limitations & Future Plans

### Current Limitations

**Product Features:**
- No product variants (size, color options)
- No product reviews/ratings
- No related products suggestions
- No product bundles

**Images:**
- No built-in image upload
- Must use external URLs or public folder
- No image optimization
- No multiple image variants (thumbnail, full)

**Inventory:**
- Simple stock tracking (no locations)
- No low stock alerts
- No automatic reordering
- No stock history

**Pricing:**
- Single price per product
- No dynamic pricing
- No bulk discounts
- No promotional pricing

### Planned Enhancements

**Phase 1: Enhanced Product Features** (High Priority)
- [ ] Product variants (size, color, etc.)
- [ ] Product reviews and ratings
- [ ] Related products
- [ ] Product bundles/kits

**Phase 2: Image Management**
- [ ] Built-in image upload to S3
- [ ] Automatic image optimization
- [ ] Multiple image variants
- [ ] Image gallery on product page

**Phase 3: Advanced Inventory**
- [ ] Multi-location inventory
- [ ] Low stock alerts
- [ ] Stock history tracking
- [ ] Automatic reorder points

**Phase 4: Pricing & Promotions**
- [ ] Discount codes/coupons
- [ ] Time-based sales
- [ ] Bulk pricing tiers
- [ ] Dynamic pricing rules

---

## Next Steps

After setting up products:
→ [Categories](04-categories.md) - Organize products into categories
→ [Orders](05-orders.md) - Process customer orders
→ [Wishlist](07-wishlist.md) - Let customers save products
