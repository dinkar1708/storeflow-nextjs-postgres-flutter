# Feature: Wishlist

**What:** Allow customers to save products for later purchase.

**Who needs it:** Customers who want to bookmark products they're interested in.

---

## How It Works

### Add to Wishlist

```bash
curl -X POST http://localhost:3001/api/wishlist \
  -H "Authorization: Bearer <customer_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "clx_prod_123"
  }'
```

### View Wishlist

```bash
curl http://localhost:3001/api/wishlist \
  -H "Authorization: Bearer <customer_token>"
```

### Remove from Wishlist

```bash
curl -X DELETE http://localhost:3001/api/wishlist/clx_prod_123 \
  -H "Authorization: Bearer <customer_token>"
```

---

## Database Schema

```prisma
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
```

---

## Next Steps

→ [Products](03-products.md) - Browse products to add to wishlist
