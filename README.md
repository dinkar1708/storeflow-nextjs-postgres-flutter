# StoreFlow - Universal Inventory & Order Management Platform

A production-ready, full-stack inventory and order management system built with Next.js 14, PostgreSQL, and Flutter.

## 🚀 Live Production Demo

**Visit:** **[https://storeflow-pink.vercel.app](https://storeflow-pink.vercel.app)**

**Hosted on:** Vercel (Web App) + Supabase (PostgreSQL Database)

**New users:** Register your own account to explore all features!

---

## What is StoreFlow?

Universal platform for inventory and order management that can be customized for 15+ different industries (Retail, Pharmacy, Restaurant, Warehouse, etc.).

## Current Status

**6 Modules Live** | **40 Tests Passing** | **Ready for Production**

### Completed Features

1. **Authentication & Authorization** - User registration, login with NextAuth, session management, role-based access control (Admin, Staff, Customer)

2. **User Management** - Admin can create, view, update, and deactivate users. Manage roles and permissions across the system.

3. **Role-Based Dashboards** - Separate dashboards for Admin (full system control), Staff (order fulfillment), and Customer (shopping and order tracking)

4. **Products & Inventory Management** - Product catalog with categories, product details page, inventory tracking, stock management, SKU system

5. **Order Management & Shopping Cart** - Shopping cart with quantity controls, order placement with payment method selection, order status workflow (Pending, Confirmed, Processing, Shipped, Delivered, Cancelled), customer order history, admin/staff order management interface

6. **Sales Analytics & Reporting** - Interactive sales charts with daily, monthly, and yearly views using Recharts, revenue analytics dashboard showing total sales and average order value, real-time performance metrics for today and current month, sales data based on delivered orders only

## Quick Start

**Recommended:** Use Docker for easiest setup (just 5 minutes!)

👉 **[Setup with Docker](./docs/SETUP_WITH_DOCKER.md)** - No PostgreSQL installation needed, just Docker Desktop + 4 commands

**Alternative:** [Setup without Docker](./docs/SETUP_MANUAL.md) - Manual PostgreSQL installation

**Both setups use same credentials:**
- PostgreSQL: `postgres` / `postgres`
- App runs on: `http://localhost:3001`

**Already set up?**

```bash
docker-compose up -d  # Start database (Docker only)
npm run dev           # Start app
```

Visit **http://localhost:3001**

**Mobile App**
The mobile application source code is located in the `flutter-app` directory. You can use it to run the mobile version of the platform:
```bash
cd flutter-app
flutter run
```

## Tech Stack

**Web**: Next.js 14, TypeScript, PostgreSQL, Prisma, NextAuth, Tailwind CSS
**Mobile**: Flutter (Coming Soon)
**Testing**: Vitest (40 tests, 100% passing)

## Screenshots

### Welcome Page
<img width="1476" alt="Welcome Page" src="https://github.com/user-attachments/assets/8b569f1b-a23b-45b4-b511-345d515febd2">

### Login Page
<img width="1598" alt="Login Page" src="https://github.com/user-attachments/assets/159848de-b791-4cc5-8ef7-09aa078d557b">

### Admin Dashboard
<img width="1624" alt="Admin Dashboard" src="https://github.com/user-attachments/assets/56766250-8c97-4311-96b0-96999f79fa8e">

## Documentation

**Setup Guides:**
- [Setup with Docker](./docs/SETUP_WITH_DOCKER.md) (Recommended)
- [Setup without Docker](./docs/SETUP_MANUAL.md) (Manual)

**Development:**
- [Testing Guide](./docs/TESTING.md)
- [Database Schema](./docs/DATABASE_SETUP.md)
- [Test Credentials](./api-web/TEST_LOGIN.md)

**Mobile (Flutter):**
- [API client generation](./flutter-app/README-API-GENERATION.md) — refresh OpenAPI + `build_runner` after backend API changes; commit generated code

## Testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:ui       # Interactive UI
```

**Coverage**: 40/40 tests passing (100%)
- Authentication: 24 tests
- Products & Categories: 8 tests
- Product Details: 8 tests

## Deployment

Deploy for **FREE** to production:
- **Vercel** - Web app + PostgreSQL database (Recommended)
- **Railway** - Full-stack hosting (App + Database)
- **Render + Supabase** - Free tier (with cold starts)

See **[Production Deployment Guide](./docs/PROD_DEPLOYMENT.md)** for complete step-by-step instructions.

## License

MIT

---

## DEMO

<img width="2454" height="1294" alt="Screenshot 2026-05-01 at 17 48 43" src="https://github.com/user-attachments/assets/8192a61d-e961-45a3-8f0f-d6111a6d47b7" />
<img width="2442" height="1301" alt="Screenshot 2026-05-01 at 17 48 54" src="https://github.com/user-attachments/assets/29ce58d9-8c1e-4f34-9346-004da48b2702" />
<img width="2457" height="1282" alt="Screenshot 2026-05-01 at 17 49 04" src="https://github.com/user-attachments/assets/a308fe4e-48be-4d4d-af65-307530d4062e" />
<img width="2484" height="1257" alt="Screenshot 2026-05-01 at 17 49 15" src="https://github.com/user-attachments/assets/dd889927-ee86-4e7c-9a66-f88dc6088375" />
<img width="2464" height="1302" alt="Screenshot 2026-05-01 at 17 49 28" src="https://github.com/user-attachments/assets/038dee03-d1d7-4f96-a08f-bd4c1a4b7477" />
<img width="2499" height="1286" alt="Screenshot 2026-05-01 at 17 49 42" src="https://github.com/user-attachments/assets/142bf041-07e6-4c2a-9d7b-4c220c7887cf" />

## Detailed Feature Specifications

### Module 1: Authentication (COMPLETED)

**What it does**: User registration, login, and session management

**User Registration**
- Public signup page at `/register`
- Required fields: Email, Password, Name
- Email validation (valid format check)
- Password validation:
  - Minimum 8 characters
  - At least 1 uppercase letter
  - At least 1 number
  - At least 1 special character (@$!%*?&)
- Duplicate email check
- Auto-assign CUSTOMER role by default
- Admin accounts cannot be created via public signup

**User Login**
- Login page at `/login`
- Authenticate with email and password
- NextAuth.js for secure authentication
- Session management with JWT tokens
- Auto-redirect based on role:
  - ADMIN → `/admin/dashboard`
  - STAFF → `/staff/dashboard`
  - CUSTOMER → `/customer/dashboard`

**Session Management**
- Maintain login session
- Check authentication on protected routes
- Auto-logout on session expiry
- Role stored in session for access control

**User Roles**

**ADMIN**
- Full system access
- Route prefix: `/admin/...`
- Home: `/admin/dashboard`
- Can access all features

**STAFF**
- Limited to operations
- Route prefix: `/staff/...`
- Home: `/staff/dashboard`
- Cannot access admin settings

**CUSTOMER**
- Shopping and orders only
- Route prefix: `/customer/...`
- Home: `/customer/dashboard`
- Cannot access admin or staff areas

**Route Protection**
- Middleware checks user role before page access
- Unauthorized access shows 403 Forbidden page
- Public routes: `/`, `/login`, `/register`

---

### Module 2: User Management (COMPLETED)

**What it does**: Admin can view, search, and manage all user accounts

**Access**: `/admin/users` (Admin only)

**Features**:
- View all users in table (Name, Email, Role, Status, Registration Date/Time)
- Search by name or email
- Filter by role (ALL, ADMIN, STAFF, CUSTOMER)
- Filter by status (Active, Inactive)
- Change user roles via dropdown
- Activate/Deactivate accounts
- Delete users (with confirmation)
- Admin cannot delete themselves
- Only accessible by ADMIN role

---

### Module 3: Dashboard (COMPLETED)

**What it does**: Provide role-specific home pages after login

**Admin Dashboard** (`/admin/dashboard`)
- Metrics: Total Revenue, Orders, Users, Products
- Quick Actions: Manage Users, Add Product, View Orders, Settings
- Access to all admin features

**Staff Dashboard** (`/staff/dashboard`)
- Metrics: Today's Sales, Pending Orders, Assigned Orders, Low Stock Alerts
- Quick Actions: Add Product, Process Order, Update Inventory
- Limited to operational features

**Customer Dashboard** (`/customer/dashboard`)
- Metrics: Active Orders, Order History, Wishlist Items
- Quick Actions: Browse Products, Track Order, My Profile
- Shopping and order features only

**Auto-Redirect** (`/dashboard`)
- Redirects to role-specific dashboard based on user role
- ADMIN → `/admin/dashboard`
- STAFF → `/staff/dashboard`
- CUSTOMER → `/customer/dashboard`

---

### Module 4: Product & Inventory (TODO)

**What it does**: Manage products, stock levels, and categories

**Requirements:**
- Real-time stock level tracking
- Low stock alerts (configurable threshold)
- Product categorization
- Product images (multiple per product)
- Bulk operations (CSV import/export)
- Search functionality (name, category, SKU)
- Product variants (size, color, etc.)
- Pricing tiers
- Archive/delete products
- Complete change history (audit trail)

---

### Module 5: Order Management (LIVE)

**What it does**: Handle order creation, processing, and tracking throughout the complete order lifecycle

**Completed Features:**
- Shopping cart system with add to cart, quantity adjustment, and cart persistence using localStorage
- Order placement with payment method selection (Cash on Delivery, Card, UPI, Net Banking)
- Complete order workflow with seven status stages: Pending, Confirmed, Processing, Packed, Shipped, Delivered, Cancelled
- Customer order history showing all placed orders with status tracking
- Admin and Staff order management dashboard with ability to update order status
- Role-based order actions where Staff can process daily orders and Admin has full control
- Order details including customer information, order items, quantities, and total amount
- Automatic inventory stock reduction when orders are placed
- Unique order number generation for tracking

**Future Enhancements:**
- Staff assignment to specific orders
- Advanced order history filters by date range and status
- Cancel and refund capability for admins
- Print invoice and receipt functionality
- Email or SMS notifications on status changes

---

### Module 6: Analytics & Reporting (LIVE)

**What it does**: Provide insights and reports on sales, users, and products

**Completed Features:**
- Sales charts with daily, monthly, and yearly views using Recharts library
- Line charts for revenue trends and bar charts for order counts
- Revenue analytics dashboard with real-time sales data from delivered orders
- Summary statistics including total sales, total orders, and average order value
- Performance metrics for today and current month
- Interactive chart view modes allowing users to switch between time periods
- Admin-only access with role-based authentication

**Future Enhancements:**
- Top selling products report
- User growth graphs
- Low stock alerts
- Export reports to PDF and Excel formats
- Audit logs for all system actions

---

## Data Models

### Core Entities

**Users**
- Email, password, name, role
- Contact information
- Address (for customers)
- Created date, last login

**Products**
- Name, description, price
- SKU/barcode
- Category
- Stock quantity
- Images (multiple)
- Status (active/inactive)
- Created/updated dates

**Categories**
- Name, description
- Parent category (for subcategories)

**Orders**
- Order number (auto-generated)
- Customer details
- Items with quantities
- Total amount
- Status
- Assigned staff
- Timestamps for each status change

**Audit Logs**
- Who did what, when
- IP address
- Action type

---

## API Endpoints

### Implemented

**Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/callback/credentials` - User login
- `GET /api/auth/session` - Get session

**Admin - User Management**
- `GET /api/admin/users` - Get all users
- `PATCH /api/admin/users/[id]` - Update user
- `DELETE /api/admin/users/[id]` - Delete user

### Coming Soon

**Products**
- `GET /api/products` - List products
- `POST /api/products` - Create product
- `PATCH /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

**Orders**
- `GET /api/orders` - List orders
- `POST /api/orders` - Create order
- `PATCH /api/orders/[id]` - Update status

**Categories**
- `GET /api/categories` - List categories

---

## Use Cases (15+ Industries)

### Perfect Fit (Ready to Use - 1-3 days)
Best for products/services with simple attributes:
1. **Bookstores** - Add: author, ISBN, publisher
2. **Retail Stores** - Add: expiry date, barcode
3. **Electronics Stores** - Add: brand, model, warranty
4. **Fashion Stores** - Add: size, color, material
5. **Plant Nursery** - Add: plant type, care instructions
6. **Music Stores** - Add: instrument type, brand
7. **Art Marketplace** - Add: artist, materials, dimensions

### Good Fit (Minor Changes - 3-5 days)
Requires additional fields and workflow adjustments:
8. **Restaurant/Food Delivery** - Add: cuisine, spice level, ingredients
9. **Pharmacy** - Add: composition, prescription required
10. **Gym Membership** - Change to memberships, add duration
11. **Car Rental** - Change to vehicles, add booking calendar
12. **Event Ticketing** - Change to events, add venue, date
13. **Course Platform** - Change to courses, add instructor, syllabus

### Requires Customization (Significant Changes - 5-7 days)
Requires data model changes and feature additions:
14. **Real Estate** - Change to properties, add location, bedrooms
15. **Hotel Booking** - Change to rooms, add booking calendar

---

## Platform Requirements

### Browser Compatibility
Must work flawlessly on:
- Google Chrome (latest)
- Mozilla Firefox (latest)
- Safari (macOS & iOS)
- Microsoft Edge (latest)
- Opera (latest)
- Samsung Internet (mobile)

### Device Compatibility
Must be fully responsive on:
- Mobile phones (all sizes: 320px - 480px)
- Tablets (768px - 1024px)
- Laptops (1200px - 1440px)
- Desktop monitors (1440px - 1920px)
- Ultra-wide screens (1920px+)

### Accessibility
- Keyboard navigation support
- Screen reader compatible
- High contrast mode
- Font size adjustable
- Touch-friendly (minimum 44px buttons)

---

## Security Requirements

- Passwords must be encrypted (not stored as plain text)
- Secure login with session timeout
- Protection against common attacks (SQL injection, XSS)
- Role-based access (users cannot access unauthorized pages)
- Data validation on all inputs
- Secure password reset process
- Activity logging for security audit

---

## Future Enhancements

### Security
- Two-factor authentication (2FA)
- Password reset via email
- Email verification on registration
- Failed login attempt tracking (lock account after 5 attempts)
- Activity logging for all actions
- IP address tracking
- Session timeout after inactivity
- Rate limiting on API endpoints

### Features
- Multi-language support (English & Hindi)
- Dark mode (toggle switch)
- Mobile app (Flutter)
- Real-time notifications
- Payment gateway integration
- Email notifications
- Advanced search filters
- Product recommendations
- Export to CSV/PDF

### Advanced User Management
- Bulk operations (select multiple users, bulk role change)
- Export user list to CSV
- View user activity history
- Send notification/email to user
- Reset user password (admin only)
- View orders placed by specific user
- Impersonate user (for debugging, with audit log)
- Role approval workflow (users request role upgrade, admin approves/rejects)

---

## Deployment Requirements

### Hosting
- Must be deployable for FREE (no monthly costs)
- Should support custom domain
- Automatic SSL certificate
- Global CDN for fast loading

### Database
- Relational database (PostgreSQL)
- Must support free tier (at least 500MB)
- Automatic backups
- Migration support

### Performance
- Page load time: < 2 seconds on 4G
- Mobile page load: < 3 seconds
- API response time: < 500ms
- Support at least 100 concurrent users

---

## Business Model

### For Freelancers/Agencies

**Client Pricing:**
- Setup & customization: $500 - $2,000
- Monthly maintenance: $100 - $300
- Hosting cost: $0 (free tier)
- Domain cost: $10-15/year (optional)

**Your Investment:**
- Development time: 2-7 days
- No hosting costs
- Profit margin: 80-90%

**Scalability:**
- Clone for 5 clients = $2,500 - $10,000 revenue
- Clone for 10 clients = $5,000 - $20,000 revenue

---

## Who Should Use This?

- **Freelance Developers** - Build and sell quickly
- **Development Agencies** - Rapid client delivery
- **Startups** - Launch MVP fast
- **Students** - Portfolio project for interviews
- **Entrepreneurs** - Start SaaS business with low investment

---

## Getting Started for Clients

1. Clone the repository
2. Choose your industry (from 15 options)
3. Customize data fields (2-6 hours)
4. Update branding (logo, colors) (1-2 hours)
5. Add demo data (1 hour)
6. Deploy for FREE (30 minutes)
7. Deliver to client

**Total Time**: 2-7 days depending on complexity
**Total Cost**: $0 in hosting
**Client Price**: $500 - $2,000

---

Built with Next.js 14, PostgreSQL, and Flutter - **Built for rapid deployment and maximum profit**
