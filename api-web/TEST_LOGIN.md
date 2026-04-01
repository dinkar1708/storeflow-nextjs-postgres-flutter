# Test Login Credentials

Use these credentials to test the application after running the seed script.

IMPORTANT: Admin accounts CANNOT be created via public signup. They are created only through database seeding or manual API calls.

## Admin Accounts

### Admin 1 - System Admin
- Email: `admin@storeflow.com`
- Password: `Admin@123`
- Role: ADMIN
- Name: System Admin
- Access: Full system access, user management, analytics, system settings
- Dashboard: /admin/dashboard

### Admin 2 - John Anderson
- Email: `john.admin@storeflow.com`
- Password: `JohnAdmin@456`
- Role: ADMIN
- Name: John Anderson
- Access: Full system access, user management, analytics, system settings
- Dashboard: /admin/dashboard

### Admin 3 - Sarah Wilson
- Email: `sarah.admin@storeflow.com`
- Password: `SarahAdmin@789`
- Role: ADMIN
- Name: Sarah Wilson
- Access: Full system access, user management, analytics, system settings
- Dashboard: /admin/dashboard

---

## Staff Accounts

### Staff 1 - Staff User
- Email: `staff@storeflow.com`
- Password: `Staff@123`
- Role: STAFF
- Name: Staff User
- Access: Inventory management, order processing, customer support
- Dashboard: /staff/dashboard

### Staff 2 - Mike Johnson
- Email: `mike.staff@storeflow.com`
- Password: `MikeStaff@456`
- Role: STAFF
- Name: Mike Johnson
- Access: Inventory management, order processing, customer support
- Dashboard: /staff/dashboard

---

## Customer Accounts

### Customer 1 - Customer User
- Email: `customer@storeflow.com`
- Password: `Customer@123`
- Role: CUSTOMER
- Name: Customer User
- Access: Browse products, place orders, track orders, view order history
- Dashboard: /customer/dashboard

### Customer 2 - Emma Davis
- Email: `emma.customer@storeflow.com`
- Password: `EmmaCustomer@456`
- Role: CUSTOMER
- Name: Emma Davis
- Access: Browse products, place orders, track orders, view order history
- Dashboard: /customer/dashboard

---

## Login URLs

- Main Login: http://localhost:3001/login
- After Login Redirect:
  - Admin: http://localhost:3001/admin/dashboard
  - Staff: http://localhost:3001/staff/dashboard
  - Customer: http://localhost:3001/customer/dashboard

---

## Setup Instructions

### 1. Seed Database

Run this command to create all demo users (including admin accounts):

```bash
npm run db:seed
```

This will create:
- 3 Admin accounts
- 2 Staff accounts
- 2 Customer accounts
- Demo categories (Electronics, Clothing)
- Demo products

### 2. Test Login

Visit: http://localhost:3001/login

Try logging in with any account above to test role-based redirects.

---

## Public Signup Restrictions

NOTE: Public signup page (http://localhost:3001/register) allows ONLY:
- CUSTOMER role (default)
- STAFF role (if enabled with approval)

Admin accounts CANNOT be created via public signup for security reasons.

---

## Test Products & Categories

After seeding, you'll have demo products to test:

### Categories
- Electronics
- Clothing

### Products
1. Laptop
   - Price: $999.99
   - Stock: 10 units
   - SKU: LAPTOP-001
   - Category: Electronics

2. T-Shirt
   - Price: $19.99
   - Stock: 50 units
   - SKU: TSHIRT-001
   - Category: Clothing

### Product Management URLs
- Admin Product Management: http://localhost:3001/admin/products
- Customer Product Listing: http://localhost:3001/customer/products

---

## Password Requirements

All passwords must meet these criteria:
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 number
- At least 1 special character (@$!%*?&)

Examples of valid passwords:
- Admin@123
- MyPassword1!
- SecurePass@2024

---

## Quick Test Checklist

1. Test Admin Login
   - Login as admin@storeflow.com
   - Verify redirect to /admin/dashboard
   - Check full system access

2. Test Admin Product Management
   - Login as admin@storeflow.com
   - Navigate to Products from dashboard
   - Verify you can see existing products (Laptop, T-Shirt)
   - Try adding a new product with category
   - Check product appears in the table

3. Test Customer Product Browsing
   - Login as customer@storeflow.com
   - Navigate to Products from dashboard
   - Verify you can see all active products
   - Check products display with price, stock, category

4. Test Staff Login
   - Login as staff@storeflow.com
   - Verify redirect to /staff/dashboard
   - Check limited access (no admin features)

5. Test Public Signup
   - Try to register new customer account
   - Verify customer role is assigned by default
   - Verify admin role cannot be selected

6. Test Role-Based Access
   - Try accessing /admin/dashboard as customer (should get 403)
   - Try accessing /staff/dashboard as customer (should get 403)
   - Try accessing /admin/products as customer (should get 403)
   - Verify admins can access all dashboards

---

## Troubleshooting

If login fails:
1. Verify database is seeded: `npm run db:seed`
2. Check server is running: `npm run dev`
3. Clear browser cache and cookies
4. Check console for errors

If redirect fails:
1. Verify role is correctly set in database
2. Check NextAuth session configuration
3. Verify middleware is protecting routes

---

---

## Current Setup Status

You are currently running:
- Database: Docker PostgreSQL on port 5433
- Next.js: http://localhost:3001
- Database has seeded data including:
  - 3 Admin accounts
  - 2 Staff accounts
  - 2 Customer accounts
  - 2 Categories (Electronics, Clothing)
  - 2 Products (Laptop, T-Shirt)

---

Last Updated: 2026-04-01
