# Feature: User Management

**What:** Admin interface to manage users, roles, and permissions across the platform.

**Who needs it:** System administrators who need to manage user accounts, assign roles, and monitor user activity.

---

## User Story

```
As a system administrator,
I want to view, create, edit, and deactivate user accounts,
So that I can control who has access to the platform and what they can do.
```

---

## How It Works

### 1. View All Users

**Via API:**
```bash
curl -X GET http://localhost:3001/api/admin/users \
  -H "Authorization: Bearer <admin_token>"
```

**Via Web UI:**
1. Login as admin: http://localhost:3001/login
2. Navigate to: http://localhost:3001/admin/users
3. View table of all users with filters

**Result:**
```json
{
  "users": [
    {
      "id": "clx123abc",
      "email": "customer@storeflow.com",
      "name": "Customer User",
      "role": "CUSTOMER",
      "isActive": true,
      "createdAt": "2026-06-01T10:00:00Z",
      "ordersCount": 5
    }
  ],
  "total": 7
}
```

### 2. View Single User Details

**Via API:**
```bash
curl -X GET http://localhost:3001/api/admin/users/clx123abc \
  -H "Authorization: Bearer <admin_token>"
```

**Result includes:**
- User profile information
- Order history
- Activity logs
- Account status

### 3. Update User Role

**Via API:**
```bash
curl -X PUT http://localhost:3001/api/admin/users/clx123abc \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "STAFF",
    "isActive": true
  }'
```

**Use Cases:**
- Promote customer to staff member
- Grant admin privileges to staff
- Demote admin back to staff/customer

### 4. Deactivate User Account

**Via API:**
```bash
curl -X PUT http://localhost:3001/api/admin/users/clx123abc \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "isActive": false
  }'
```

**Effects:**
- User cannot login
- Active sessions are invalidated
- Orders remain in system
- Can be reactivated later

---

## Access Control

### Who Can Manage Users?

| Action | ADMIN | STAFF | CUSTOMER |
|--------|-------|-------|----------|
| View all users | ✅ | ❌ | ❌ |
| View user details | ✅ | ❌ | ❌ |
| Create users | ✅ | ❌ | ❌ |
| Update user role | ✅ | ❌ | ❌ |
| Deactivate users | ✅ | ❌ | ❌ |
| View own profile | ✅ | ✅ | ✅ |
| Update own profile | ✅ | ✅ | ✅ |

**Note:** Staff and customers can only view/update their own profiles via `/api/user/profile`.

---

## User Profile Management (Self-Service)

### View Own Profile

**Via API:**
```bash
curl -X GET http://localhost:3001/api/user/profile \
  -H "Authorization: Bearer <user_token>"
```

**Result:**
```json
{
  "id": "clx123abc",
  "email": "customer@storeflow.com",
  "name": "Customer User",
  "role": "CUSTOMER",
  "phone": "+1234567890",
  "address": "123 Main St, City, State 12345",
  "isActive": true,
  "createdAt": "2026-06-01T10:00:00Z"
}
```

### Update Own Profile

**Via API:**
```bash
curl -X PUT http://localhost:3001/api/user/profile \
  -H "Authorization: Bearer <user_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "+1234567890",
    "address": "456 New St, City, State"
  }'
```

**Allowed fields:**
- name
- phone
- address

**Restricted fields (admin only):**
- role
- email (requires email verification)
- isActive

---

## API Endpoints

| Endpoint | Method | Auth | Role | Description |
|----------|--------|------|------|-------------|
| `/api/admin/users` | GET | Yes | ADMIN | List all users |
| `/api/admin/users/:id` | GET | Yes | ADMIN | Get user details |
| `/api/admin/users/:id` | PUT | Yes | ADMIN | Update user (role, status) |
| `/api/admin/users/:id` | DELETE | Yes | ADMIN | Delete user |
| `/api/user/profile` | GET | Yes | All | Get own profile |
| `/api/user/profile` | PUT | Yes | All | Update own profile |

---

## Database Schema

```prisma
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

enum Role {
  ADMIN
  STAFF
  CUSTOMER
}
```

---

## Web UI Features

### Admin Users Dashboard (`/admin/users`)

**Features:**
- Table view with pagination
- Search by name/email
- Filter by role (ADMIN, STAFF, CUSTOMER)
- Filter by status (Active, Inactive)
- Sort by created date, name, role
- Quick actions: Edit, Deactivate, View Orders

**Columns:**
- Email
- Name
- Role (badge)
- Status (Active/Inactive)
- Orders count
- Created date
- Actions menu

### User Details Page (`/admin/users/[id]`)

**Sections:**
1. **Profile Information**
   - Email, Name, Phone, Address
   - Role badge
   - Account status
   - Created/Updated dates

2. **Order History**
   - List of all orders
   - Order status
   - Total spent

3. **Activity Log**
   - Recent logins
   - Profile updates
   - Order placements

4. **Actions**
   - Edit profile
   - Change role
   - Activate/Deactivate
   - View orders

---

## Validation Rules

### User Creation/Update

**Email:**
- Must be valid email format
- Must be unique in database
- Cannot be changed after registration (future: email verification)

**Name:**
- Required
- Min 2 characters
- Max 100 characters

**Role:**
- Must be one of: ADMIN, STAFF, CUSTOMER
- Only admins can assign roles

**Phone:**
- Optional
- Valid phone format (E.164 recommended)

**Address:**
- Optional
- Max 500 characters

---

## Security Considerations

### 1. Role Assignment Protection
- Only ADMINs can change user roles
- Staff/Customer cannot promote themselves
- API validates role in JWT token

### 2. Account Deactivation
- Soft delete (isActive flag)
- User data preserved for orders
- Can be reactivated by admin

### 3. Audit Logging
- All role changes logged to AuditLog table
- Track who made changes and when
- IP address captured

### 4. Password Changes
- Users cannot change passwords via profile endpoint
- Requires separate password reset flow (future feature)

---

## Testing

### Manual Testing Checklist

1. **Admin can view all users**
   - Login as `admin@storeflow.com`
   - Navigate to `/admin/users`
   - Verify all 7 demo users appear

2. **Admin can change user role**
   - Select a customer user
   - Change role to STAFF
   - Verify user gets STAFF dashboard access

3. **Admin can deactivate user**
   - Deactivate a test customer
   - Try logging in as that customer
   - Verify login fails

4. **Non-admin cannot access admin endpoints**
   - Login as customer
   - Try accessing `/admin/users`
   - Verify 403 Forbidden

5. **User can update own profile**
   - Login as any user
   - Navigate to profile page
   - Update name/phone/address
   - Verify changes saved

---

## Limitations & Future Plans

### Current Limitations

**User Management:**
- No bulk operations (bulk delete, bulk role change)
- No user import/export (CSV)
- No advanced search/filtering
- No user groups or teams

**Profile Features:**
- Cannot change email address
- Cannot change password via profile
- No profile picture upload
- No custom fields

**Audit:**
- Basic logging only
- No detailed activity timeline
- No change history tracking

### Planned Enhancements

**Phase 1: Enhanced User Management** (High Priority)
- [ ] Bulk user operations (delete, deactivate, role change)
- [ ] Export users to CSV
- [ ] Import users from CSV
- [ ] Advanced search and filters

**Phase 2: Profile Enhancements**
- [ ] Profile picture upload
- [ ] Email change with verification
- [ ] Password change via profile
- [ ] Two-factor authentication setup

**Phase 3: Audit & Compliance**
- [ ] Detailed activity timeline per user
- [ ] Change history tracking
- [ ] GDPR compliance (data export, deletion)
- [ ] User consent management

---

## Troubleshooting

### Cannot access `/admin/users`
- Verify logged in as ADMIN role
- Check middleware configuration
- Verify session/token is valid

### User role change not taking effect
- User must logout and login again
- Old JWT tokens contain old role
- Clear browser cookies

### User count incorrect
- Check if inactive users are filtered
- Verify database seed ran successfully
- Run: `npx prisma studio` to view raw data

### Profile update not saving
- Check validation errors in console
- Verify required fields provided
- Check database connection

---

## Next Steps

After understanding user management:
→ [Products](03-products.md) - Manage product catalog
→ [Orders](05-orders.md) - Process and track orders
→ [Audit Logging](08-audit-logging.md) - Track system changes
