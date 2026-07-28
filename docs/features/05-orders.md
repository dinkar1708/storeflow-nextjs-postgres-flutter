# Feature: Order Management

**What:** Complete order processing system with status tracking, order items, and customer history.

**Who needs it:** E-commerce businesses that need to process customer orders and track fulfillment.

---

## User Story

```
As a customer,
I want to place orders for products and track their status,
So that I know when my order will be delivered.

As a staff member,
I want to process orders and update their status,
So that customers receive their products on time.
```

---

## How It Works

### 1. Create Order

**Via API:**
```bash
curl -X POST http://localhost:3001/api/orders \
  -H "Authorization: Bearer <customer_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": "clx_prod_123",
        "quantity": 2
      },
      {
        "productId": "clx_prod_456",
        "quantity": 1
      }
    ],
    "shippingAddress": "123 Main St, City, State 12345",
    "notes": "Please deliver after 5 PM"
  }'
```

**Result:**
```json
{
  "id": "clx_order_789",
  "orderNumber": "ORD-20260720-0001",
  "userId": "clx_user_123",
  "status": "PENDING",
  "total": "1019.97",
  "items": [
    {
      "id": "clx_item_1",
      "productId": "clx_prod_123",
      "product": {
        "name": "Laptop",
        "price": "999.99"
      },
      "quantity": 2,
      "price": "999.99"
    },
    {
      "id": "clx_item_2",
      "productId": "clx_prod_456",
      "product": {
        "name": "T-Shirt",
        "price": "19.99"
      },
      "quantity": 1,
      "price": "19.99"
    }
  ],
  "shippingAddress": "123 Main St, City, State 12345",
  "notes": "Please deliver after 5 PM",
  "createdAt": "2026-07-20T10:00:00Z"
}
```

### 2. View Orders

**Customer - View Own Orders:**
```bash
curl http://localhost:3001/api/orders \
  -H "Authorization: Bearer <customer_token>"
```

**Admin/Staff - View All Orders:**
```bash
curl http://localhost:3001/api/admin/orders \
  -H "Authorization: Bearer <admin_token>"
```

### 3. Update Order Status

**Via API (Admin/Staff only):**
```bash
curl -X PUT http://localhost:3001/api/orders/clx_order_789 \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "SHIPPED"
  }'
```

---

## Order Status Workflow

```
PENDING → Order created, awaiting confirmation
   ↓
CONFIRMED → Payment verified, ready for processing
   ↓
PROCESSING → Being prepared for shipment
   ↓
PACKED → Packaged and ready to ship
   ↓
SHIPPED → In transit to customer
   ↓
DELIVERED → Successfully delivered
```

**Alternative Path:**
```
PENDING → CANCELLED (by customer or admin)
CONFIRMED → CANCELLED (before processing)
```

### Status Definitions

| Status | Description | Who Can Set | Customer Action |
|--------|-------------|-------------|-----------------|
| **PENDING** | Just created, awaiting payment | System | Can cancel |
| **CONFIRMED** | Payment received | Admin/Staff | Can request cancel |
| **PROCESSING** | Being prepared | Admin/Staff | Cannot cancel |
| **PACKED** | Ready to ship | Admin/Staff | Cannot cancel |
| **SHIPPED** | In transit | Admin/Staff | Track shipment |
| **DELIVERED** | Completed | Admin/Staff | Rate/Review |
| **CANCELLED** | Cancelled | Customer/Admin | View refund |

---

## Database Schema

```prisma
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

enum OrderStatus {
  PENDING
  CONFIRMED
  PROCESSING
  PACKED
  SHIPPED
  DELIVERED
  CANCELLED
}
```

---

## Order Number Generation

**Format:** `ORD-YYYYMMDD-NNNN`

**Example:** `ORD-20260720-0001`

**Components:**
- `ORD-` prefix
- Date: YYYYMMDD
- Sequential number: 0001, 0002, etc.

**Implementation:**
```typescript
// Auto-generated on order creation
const date = new Date().toISOString().slice(0,10).replace(/-/g,'');
const count = await getOrderCountForToday();
const orderNumber = `ORD-${date}-${String(count + 1).padStart(4, '0')}`;
```

---

## Access Control

| Action | ADMIN | STAFF | CUSTOMER |
|--------|-------|-------|----------|
| Create order | ✅ | ✅ | ✅ |
| View own orders | ✅ | ✅ | ✅ |
| View all orders | ✅ | ✅ | ❌ |
| Update order status | ✅ | ✅ | ❌ |
| Cancel order (PENDING) | ✅ | ✅ | ✅ |
| Cancel order (CONFIRMED) | ✅ | ✅ | ❌ |

---

## Stock Management Integration

### On Order Creation:
1. Validate stock availability
2. Reserve stock (reduce quantity)
3. Create order

**Example:**
```typescript
// Before order creation
const product = await prisma.product.findUnique({
  where: { id: productId }
});

if (product.stock < quantity) {
  throw new Error('Insufficient stock');
}

// Reduce stock
await prisma.product.update({
  where: { id: productId },
  data: { stock: { decrement: quantity } }
});
```

### On Order Cancellation:
1. Update order status to CANCELLED
2. Restore stock (add quantity back)

---

## API Endpoints

| Endpoint | Method | Auth | Role | Description |
|----------|--------|------|------|-------------|
| `/api/orders` | GET | Yes | All | List own orders (or all for admin) |
| `/api/orders` | POST | Yes | All | Create order |
| `/api/orders/:id` | GET | Yes | All | Get order details |
| `/api/orders/:id` | PUT | Yes | ADMIN/STAFF | Update order status |
| `/api/orders/:id` | DELETE | Yes | ADMIN | Delete order |

---

## Web UI Features

### Customer Order History (`/customer/orders`)

**Features:**
- List all orders with status badges
- Filter by status
- Search by order number
- Sort by date
- View order details
- Track shipment (if shipped)
- Cancel pending orders

**Order Card:**
- Order number
- Date
- Status badge
- Total amount
- Items preview
- View details button

### Staff Order Management (`/staff/orders`)

**Features:**
- View all orders
- Filter by status
- Search by order number or customer
- Update order status
- View customer details
- Process refunds

### Admin Orders Dashboard (`/admin/orders`)

**Features:**
- All staff features
- Delete orders
- View analytics
- Export orders to CSV
- Bulk status updates

---

## Validation Rules

### Order Creation

**Required:**
- `items` (array, min 1 item)
- Each item: `productId`, `quantity` (> 0)

**Optional:**
- `shippingAddress` (string)
- `notes` (string, max 500 chars)

**Business Rules:**
- Product must exist and be active
- Sufficient stock available
- Valid quantities (positive integers)
- Total calculated from current product prices

---

## Testing

### Manual Test Checklist

1. **Create order as customer**
   - Login as customer
   - Add products to cart
   - Checkout
   - Verify order created with PENDING status

2. **Update order status as staff**
   - Login as staff
   - Navigate to orders
   - Update order to CONFIRMED
   - Verify status changes

3. **View order history**
   - Login as customer
   - Navigate to order history
   - Verify all orders shown
   - Click order to view details

4. **Stock reduction**
   - Note product stock before order
   - Create order with quantity 2
   - Verify stock reduced by 2

---

## Limitations & Future Plans

### Current Limitations

**Order Features:**
- No payment processing integration
- No shipping calculation
- No email notifications
- No invoice generation

**Tracking:**
- No real-time shipment tracking
- No estimated delivery dates
- No carrier integration

**Returns:**
- No return/refund process
- No RMA system

### Planned Enhancements

**Phase 1: Payment & Notifications** (High Priority)
- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Email notifications on status change
- [ ] Order invoice generation (PDF)
- [ ] SMS notifications

**Phase 2: Shipping & Tracking**
- [ ] Shipping cost calculation
- [ ] Carrier integration (FedEx, UPS)
- [ ] Real-time tracking
- [ ] Delivery estimates

**Phase 3: Returns & Refunds**
- [ ] Return request system
- [ ] RMA workflow
- [ ] Refund processing
- [ ] Store credit option

---

## Next Steps

After understanding orders:
→ [Analytics](06-analytics.md) - View sales analytics
→ [Wishlist](07-wishlist.md) - Customer wishlists
→ [Audit Logging](08-audit-logging.md) - Track order changes
