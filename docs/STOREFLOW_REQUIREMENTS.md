# StoreFlow - Project Requirements Document

> **Universal Inventory & Role Management Platform**
> Production-ready application for rapid deployment across multiple industries

---

##  Project Overview

**StoreFlow** is a versatile, ready-to-deploy platform that serves as a foundation for inventory and order management across 15+ different industries.

### Purpose
- **Client Demonstrations**: Professional portfolio piece
- **Rapid Deployment**: Clone and customize for clients in 2-7 days
- **Revenue Generation**: Sell to multiple industries with minimal changes

---

##  Core Requirements

### 1. User Roles & Permissions

**Three-tier role system:**

**Admin (Route: /admin/...)**
- Full system access and control
- User management:
  - View all users (search, filter by role, status)
  - Create new users (any role: ADMIN, STAFF, CUSTOMER)
  - Edit user details (name, email, contact)
  - Assign/change user roles (CUSTOMER to STAFF, STAFF to ADMIN, etc.)
  - Approve role change requests
  - Deactivate/activate user accounts
  - Delete users (soft delete with confirmation)
- Analytics and reporting dashboard
- System configuration
- Audit log access
- Can access all staff and customer features
- Home: /admin/dashboard

**Staff (Route: /staff/...)**
- Inventory management (add, edit, update stock)
- Order processing and fulfillment
- Customer support
- Daily reports access
- Cannot delete users or access system settings
- Cannot access admin features
- Home: /staff/dashboard

**Customer (Route: /customer/...)**
- Browse product catalog
- Search and filter products
- Place orders
- Track order status
- View order history
- Manage profile
- Cannot access admin or staff features
- Home: /customer/dashboard

**Access Control:**
- Each role has specific routes they can access
- Middleware checks user role before allowing page access
- Unauthorized access redirects to 403 Forbidden page
- Public routes: /, /products, /login, /register

### 2. Inventory Management

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

### 3. Order Management

**Order Workflow:**
1. Pending (new order received)
2. Confirmed (admin/staff verified)
3. Processing (being prepared)
4. Packed (ready to ship)
5. Shipped (in transit)
6. Delivered (completed)
7. Cancelled (if needed)

**Requirements:**
- Customer can place orders
- Staff can update order status
- Staff assignment to orders
- Order tracking for customers
- Order history with filters (date, status)
- Cancel/refund capability (admin only)
- Print invoice/receipt
- Notification on status change

### 4. User Management & Authentication

**Login & Registration:**
- Secure login/logout
- User registration (public signup page)
- Password reset functionality
- Remember me functionality
- Session management with timeout
- Failed login attempt tracking

**Public Signup Restrictions:**
- Public signup page allows registration ONLY as:
  - CUSTOMER role (default)
  - STAFF role (optional, with approval flag)
- ADMIN accounts CANNOT be created via public signup
- Admin accounts must be created manually via:
  - Database seed script
  - Direct API call
  - Admin user management panel (by existing admin)

**Admin Account Creation:**
- Method 1: Database seed script (recommended for initial setup)
  - Creates 2-3 default admin accounts
  - Credentials stored in TEST_LOGIN.md
- Method 2: API endpoint (protected, requires existing admin token)
- Method 3: Direct database insertion
- All admin credentials documented in api-web/TEST_LOGIN.md

**Role-Based Access Control:**
- Role assignment (admin only)
- Automatic role-based redirect after login:
  - ADMIN role to /admin/dashboard
  - STAFF role to /staff/dashboard
  - CUSTOMER role to /customer/dashboard
- Protected routes based on role
- 403 Forbidden page for unauthorized access

**Account Management:**
- Deactivate/reactivate accounts (admin only)
- Activity logging
- Profile editing (name, contact, address)
- Password change (logged-in users)

**Role Management & Approval System:**

Admin can manage user roles through:

1. User Management Dashboard (/admin/users)
   - View all users in searchable table
   - Filter by role (ADMIN, STAFF, CUSTOMER)
   - Filter by status (Active, Inactive, Pending Approval)
   - Search by email, name

2. Role Assignment (for ANY signed-up user)
   - Admin can assign/change ANY user's role regardless of how they signed up
   - For users who signed up via public registration:
     - Search user by email or name
     - Click "Change Role" button
     - Select new role from dropdown: ADMIN, STAFF, or CUSTOMER
     - Confirm change
   - Available role changes:
     - CUSTOMER to STAFF (promote to staff member)
     - CUSTOMER to ADMIN (promote to admin - requires extra confirmation)
     - STAFF to ADMIN (promote to admin - requires extra confirmation)
     - STAFF to CUSTOMER (demote to customer)
     - ADMIN to STAFF (demote to staff - requires extra confirmation)
     - ADMIN to CUSTOMER (demote to customer - requires extra confirmation)
   - Remove role (effectively sets to CUSTOMER as default)
   - Confirmation dialog for all role changes
   - Email notification sent to user when role changes
   - Audit log entry created for each role change with admin name, timestamp

3. Role Approval Workflow (Optional)
   - Users can request role upgrade (e.g., CUSTOMER requests STAFF role)
   - Request appears in admin dashboard with "Pending" badge
   - Admin can:
     - Approve request (changes role immediately)
     - Reject request (sends notification to user)
     - View request reason/justification
   - Notification sent to user when approved/rejected

4. Bulk Operations
   - Select multiple users
   - Bulk role assignment
   - Bulk activate/deactivate
   - Export user list to CSV

**Admin User Management Features:**
- Search users by email, name, or role
- View user details (registration date, last login, order count)
- View user activity history
- Send notification/email to user
- Reset user password (admin only)
- View orders placed by specific user
- Impersonate user (for debugging, with audit log)

### 5. Multi-Language Support

**Requirements:**
- Support for English and Hindi
- Language switcher in UI
- Remember user preference
- All UI elements translated
- Email templates in both languages
- Error messages in selected language
- Admin can add more languages (future)

### 6. Role-Based Home Pages & Dashboards

CURRENT STATUS: Single generic dashboard exists at `/dashboard` (shows same view for all roles)

REQUIRED: Three separate role-based dashboards

IMPORTANT: Each role MUST have a dedicated home page that serves as their main dashboard after login.

---

#### Admin Home Page

**Route:** `/admin/dashboard` (also accessible as `/admin/home` or `/admin`)

**Purpose:** Central control center for system administration

**What to Display:**

Key Metrics Cards:
- Total revenue (with daily, monthly, yearly breakdown)
- Total orders count (today, this week, this month)
- Total users count (by role: customers, staff, admins)
- Total products count (active vs inactive)

Analytics Section:
- Revenue chart (line/bar chart showing last 30 days)
- Top 5 selling products (with quantities sold)
- Low stock alerts (products below threshold)
- User growth graph (new registrations over time)

Recent Activity Feed:
- Last 10 system activities (user created, order placed, product updated)
- Timestamp and user who performed action

Quick Actions (Buttons):
- Add New User (create ADMIN/STAFF/CUSTOMER)
- Manage User Roles (search and assign roles)
- Add New Product
- View All Orders
- System Settings
- Generate Report

Navigation Sidebar:
- Dashboard (home icon)
- Users Management
  - All Users (view, search, filter)
  - Role Management (assign/change roles)
  - Pending Approvals (if role approval workflow enabled)
- Products Management
- Orders Management
- Categories
- Reports & Analytics
- System Settings
- Audit Logs

User Management Page Features (/admin/users):
- Search bar (search by name, email)
- Filter by role (ALL, ADMIN, STAFF, CUSTOMER)
- Filter by status (ACTIVE, INACTIVE)
- User table columns:
  - Name
  - Email
  - Role (with colored badge)
  - Status (Active/Inactive)
  - Last Login
  - Registration Date
  - Actions (dropdown):
    - Change Role (opens modal with ADMIN/STAFF/CUSTOMER options)
    - Edit Details
    - Deactivate/Activate
    - View Activity
    - Delete User
- Bulk actions checkbox (select multiple users)
- Pagination (show 25/50/100 per page)

---

#### Staff Home Page

**Route:** `/staff/dashboard` (also accessible as `/staff/home` or `/staff`)

**Purpose:** Operational workspace for daily tasks

**What to Display:**

Daily Summary Cards:
- Today's sales total
- Pending orders count (needs processing)
- My assigned orders (orders assigned to logged-in staff)
- Orders to fulfill today (packed/ready to ship)

Alerts Section:
- Inventory alerts (products with low stock - below 10 items)
- Urgent orders (placed more than 24 hours ago, still pending)
- Customer messages (if support module exists)

My Tasks Section:
- Orders assigned to me (list view with status)
- Orders I'm currently processing
- Completed orders today (count and list)

Recent Activity Feed:
- My recent actions (products I added/updated, orders I processed)
- Team activity (what other staff members are doing)

Quick Actions (Buttons):
- Add New Product
- Process Order
- Update Inventory
- View All Orders
- Mark Stock Alert Resolved

Navigation Sidebar:
- Dashboard (home icon)
- Products (inventory management)
- Orders (view and process)
- Customers (view customer list)
- My Profile
- Help & Support

---

#### Customer Home Page

**Route:** `/customer/dashboard` (also accessible as `/customer/home` or `/customer`)

**Purpose:** Personal account center for shopping and order tracking

**What to Display:**

Welcome Section:
- Personalized greeting: "Welcome back, [Customer Name]!"
- Account status (verified, loyalty tier if applicable)
- Loyalty points balance (if loyalty program exists)

Active Orders Section:
- Currently active orders (in transit, processing, packed)
- Order tracking information (status, estimated delivery)
- Quick action: Track Order button for each order

Recent Order History:
- Last 5 completed orders
- Order date, total amount, status
- Quick action: Reorder button, View Details button

Quick Access Cards:
- Browse Products (large card with featured product image)
- My Wishlist (count of items, thumbnail images)
- Saved Addresses (count, quick edit option)
- Payment Methods (if saved card feature exists)

Recommendations Section (Optional):
- Products you might like (based on order history)
- Frequently bought together
- New arrivals

Quick Actions (Buttons):
- Browse All Products
- Track My Order
- Edit Profile
- View All Orders
- Contact Support

Navigation Menu:
- Home (dashboard icon)
- Shop Products
- My Orders
- Wishlist
- Profile Settings
- Addresses
- Help & Support
- Logout

---

#### Post-Login Routing Behavior

When user successfully logs in:

1. Check user role from session/JWT token
2. Redirect based on role:
   - If role is ADMIN then redirect to `/admin/dashboard`
   - If role is STAFF then redirect to `/staff/dashboard`
   - If role is CUSTOMER then redirect to `/customer/dashboard`
3. If user tries to access unauthorized page:
   - Show 403 Forbidden page
   - Example: Customer trying to access `/admin/dashboard` gets 403
4. Allow role-based access:
   - ADMIN can access: /admin/..., /staff/..., /customer/... (all areas)
   - STAFF can access: /staff/..., /customer/... (limited areas)
   - CUSTOMER can access: /customer/... (own area only)

---

#### Home Page Navigation

Each role's home page must have:
- Logo/brand (top left)
- User profile dropdown (top right) with:
  - User name and role
  - My Profile link
  - Settings
  - Logout button
- Sidebar navigation (left side, collapsible on mobile)
- Main content area (dashboard widgets)
- Footer (privacy, terms, contact)

Mobile Responsive:
- Sidebar collapses to hamburger menu on mobile
- Dashboard cards stack vertically
- Charts become scrollable/swipeable
- Quick actions become dropdown menu

---

##  Platform Requirements

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

##  Security Requirements

- Passwords must be encrypted (not stored as plain text)
- Secure login with session timeout
- Protection against common attacks (SQL injection, XSS)
- Role-based access (users cannot access unauthorized pages)
- Data validation on all inputs
- Secure password reset process
- Activity logging for security audit

---

##  Data Requirements

### Core Data Models

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

##  Deployment Requirements

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

##  UI/UX Requirements

### Design
- Modern, clean interface
- Mobile-first responsive design
- Consistent color scheme
- Professional typography
- Loading indicators for all actions
- Success/error messages for user actions

### User Experience
- Intuitive navigation
- Search functionality on all listing pages
- Filters and sorting options
- Pagination for large datasets
- Breadcrumb navigation
- Quick actions (edit, delete) on listings
- Confirmation dialogs for destructive actions
- Form validation with clear error messages

### Themes
- Light mode (default)
- Dark mode (toggle switch)
- Theme preference saved

---

##  15+ Industry Use Cases

### Minimal Customization (1-3 days)
1. **Online Bookstore** - Add: author, ISBN, publisher
2. **Retail Store** - Add: expiry date, barcode
3. **Electronics Store** - Add: brand, model, warranty
4. **Fashion Store** - Add: size, color, material
5. **Plant Nursery** - Add: plant type, care instructions
6. **Music Store** - Add: instrument type, brand
7. **Art Marketplace** - Add: artist, materials, dimensions

### Moderate Customization (3-5 days)
8. **Restaurant/Food Delivery** - Add: cuisine, spice level, ingredients
9. **Pharmacy** - Add: composition, prescription required
10. **Gym Membership** - Change to memberships, add duration
11. **Car Rental** - Change to vehicles, add booking calendar
12. **Event Ticketing** - Change to events, add venue, date
13. **Course Platform** - Change to courses, add instructor, syllabus

### Advanced Customization (5-7 days)
14. **Real Estate** - Change to properties, add location, bedrooms
15. **Hotel Booking** - Change to rooms, add booking calendar

---

##  Business Model

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

##  Project Phases

### Phase 1 - Core Features (Completed)
-  Role-based access control
-  User authentication
-  Inventory management
-  Order processing
-  Multi-language (English & Hindi)
-  Responsive design
-  Free deployment setup

### Phase 2 - Enhanced Features (Planned)
- [ ] Advanced analytics with charts
- [ ] Email notifications
- [ ] Real-time order updates
- [ ] Payment gateway integration
- [ ] Barcode scanning
- [ ] Mobile app (Flutter)

### Phase 3 - Premium Features (Future)
- [ ] Multi-currency support
- [ ] AI product recommendations
- [ ] Voice search
- [ ] Two-factor authentication
- [ ] Social media login
- [ ] Advanced reporting (PDF/Excel export)

---

##  Use Case Quick Reference

###  **Perfect Fit** (Ready to Use - 1-3 days)
Best for products/services with simple attributes:
- Bookstores
- Retail stores
- Electronics shops
- Clothing stores
- Garden/plant stores
- Music instrument shops
- Art/craft marketplaces

###  **Good Fit** (Minor Changes - 3-5 days)
Requires additional fields and workflow adjustments:
- Restaurants/food delivery
- Pharmacies
- Gyms/fitness centers
- Vehicle rentals
- Event ticketing
- Online courses

###  **Requires Customization** (Significant Changes - 5-7 days)
Requires data model changes and feature additions:
- Real estate platforms
- Hotel booking systems
- Hospital management
- Logistics/delivery services

###  **Not Suitable**
Different architecture required:
- Social media platforms
- Real-time collaboration tools
- Video streaming services
- Banking/finance applications
- Gaming platforms

---

##  Success Criteria

### Must Have
- All 3 user roles working correctly
- Inventory can be added, edited, deleted
- Orders can be placed and tracked
- Both languages work perfectly
- Works on all browsers and devices
- FREE deployment successful
- No security vulnerabilities

### Should Have
- Fast page load times (< 2 seconds)
- Intuitive user interface
- Clear error messages
- Mobile experience as good as desktop
- Dark mode works properly

### Nice to Have
- Analytics charts
- Email notifications
- Export to CSV/PDF
- Advanced search filters
- Product recommendations

---

##  Project Information

- **Timeline**: 2-7 days per client deployment
- **Maintenance**: Minimal (updates quarterly)
- **License**: MIT (free for commercial use)
- **Support**: Documentation included
- **Scalability**: Handles 100+ concurrent users
- **Future-proof**: Easy to add new features

---

##  Getting Started

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

##  Who Should Use This?

 **Freelance Developers** - Build and sell quickly
 **Development Agencies** - Rapid client delivery
 **Startups** - Launch MVP fast
 **Students** - Portfolio project for interviews
 **Entrepreneurs** - Start SaaS business with low investment

---

**Questions? Check the technical README for implementation details.**

---

**Built for rapid deployment and maximum profit.**
