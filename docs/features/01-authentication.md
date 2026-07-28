# Feature: Authentication & Authorization

**What:** Secure user authentication with role-based access control (RBAC) for multi-tenant e-commerce platform.

**Who needs it:** E-commerce businesses that need secure user management with different access levels (Admin, Staff, Customer).

---

## User Story

```
As an e-commerce platform owner,
I want users to securely log in with role-based permissions,
So that admins can manage the system, staff can process orders, and customers can shop safely.
```

---

## How It Works

### 1. User Registration

**Via API:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass@123",
    "name": "John Doe",
    "role": "CUSTOMER"
  }'
```

**Via Web UI:**
1. Visit http://localhost:3001/register
2. Fill in email, password, name
3. Role is automatically set to CUSTOMER (default)
4. Submit form

**Result:**
```json
{
  "user": {
    "id": "clx123abc",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "CUSTOMER",
    "isActive": true
  },
  "message": "Registration successful"
}
```

### 2. User Login

**Via NextAuth (Web):**
- Uses NextAuth.js with credential provider
- Session-based authentication with JWT tokens
- Automatic role-based redirect after login

**Via JWT API (Mobile/API clients):**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@storeflow.com",
    "password": "Admin@123"
  }'
```

**Result:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clx123abc",
    "email": "admin@storeflow.com",
    "name": "System Admin",
    "role": "ADMIN"
  }
}
```

### 3. What Happens Behind the Scenes

```
Login Request
    ↓
1. Validate email/password format (Zod validation)
    ↓
2. Find user in PostgreSQL database
    ↓
3. Compare password with bcrypt hash
    ↓
4. Generate JWT token with user role
    ↓
5. Store session in NextAuth (web) or return token (API)
    ↓
6. Redirect based on role:
   - ADMIN → /admin/dashboard
   - STAFF → /staff/dashboard
   - CUSTOMER → /customer/dashboard
```

---

## Role-Based Access Control (RBAC)

### Roles

| Role | Access Level | Dashboard | Capabilities |
|------|-------------|-----------|--------------|
| **ADMIN** | Full system access | `/admin/dashboard` | User management, analytics, system settings, all CRUD operations |
| **STAFF** | Limited operations | `/staff/dashboard` | Inventory management, order processing, customer support |
| **CUSTOMER** | Self-service only | `/customer/dashboard` | Browse products, place orders, track orders, manage profile |

### Protected Routes

**Middleware protection:**
```typescript
// middleware.ts enforces role-based access
/admin/*     → ADMIN only
/staff/*     → ADMIN + STAFF
/customer/*  → All authenticated users
```

**Route Examples:**
- `/admin/users` - ADMIN only (403 for staff/customer)
- `/staff/orders` - ADMIN + STAFF only
- `/customer/cart` - All authenticated users
- `/products` - Public (no auth required)

---

## Password Requirements

All passwords must meet these security criteria:
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 number
- At least 1 special character (@$!%*?&)

**Examples of valid passwords:**
- `Admin@123`
- `SecurePass1!`
- `MyP@ssw0rd`

**Password Storage:**
- Hashed with bcrypt (10 rounds)
- Never stored in plain text
- Salt automatically generated per password

---

## Demo Accounts

After running `npm run db:seed`, these test accounts are available:

### Admin Accounts
```
Email: admin@storeflow.com
Password: Admin@123
Access: Full system access
```

### Staff Accounts
```
Email: staff@storeflow.com
Password: Staff@123
Access: Inventory & orders
```

### Customer Accounts
```
Email: customer@storeflow.com
Password: Customer@123
Access: Shopping only
```

See [TEST_LOGIN.md](../../api-web/TEST_LOGIN.md) for all demo accounts (7 total: 3 admins, 2 staff, 2 customers).

---

## Security Features

### 1. Password Hashing
- **Algorithm:** bcrypt with 10 salt rounds
- **Implementation:** `bcryptjs` library
- Never compare plain text passwords

### 2. JWT Tokens (API)
- **Algorithm:** HS256
- **Expiry:** Configurable (default: 7 days)
- **Payload:** User ID, email, role

### 3. Session Management (Web)
- **Provider:** NextAuth.js
- **Storage:** Database sessions (PostgreSQL)
- **Security:** HTTP-only cookies, CSRF protection

### 4. Route Protection
- Middleware checks authentication on all protected routes
- Role-based authorization at API level
- 403 Forbidden for unauthorized access

---

## API Endpoints

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/api/auth/register` | POST | No | Register new user (CUSTOMER only) |
| `/api/auth/login` | POST | No | Login with JWT (for mobile/API) |
| `/api/auth/[...nextauth]` | * | No | NextAuth endpoints (web login) |
| `/api/user/profile` | GET | Yes | Get current user profile |

---

## Integration Examples

### Next.js Web (NextAuth)

```typescript
// Using NextAuth in a page
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return <div>Welcome, {session.user.name}!</div>;
}
```

### API Client (JWT)

```typescript
// Using JWT token for API calls
const response = await fetch('http://localhost:3001/api/products', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### Flutter Mobile App

```dart
// Login from Flutter app
final response = await http.post(
  Uri.parse('http://localhost:3001/api/auth/login'),
  body: json.encode({
    'email': 'customer@storeflow.com',
    'password': 'Customer@123'
  }),
);

final data = json.decode(response.body);
final token = data['token'];
// Store token for subsequent requests
```

---

## Testing

### Test Coverage
- ✅ Auth API: 100% coverage
- Tests located in: `__tests__/auth/`

### Run Tests
```bash
# Start dev server first
npm run dev

# Run auth tests
npm test -- __tests__/auth
```

### Test Scenarios Covered
- User registration with validation
- Login success and failure cases
- Password hashing verification
- JWT token generation
- Role-based access control
- Invalid credentials handling

---

## Configuration

### Environment Variables

```bash
# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# JWT Configuration (for API login)
JWT_SECRET="your-jwt-secret-key"
JWT_EXPIRES_IN="7d"

# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/storeflow"
```

**Generate secrets:**
```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate JWT_SECRET
openssl rand -base64 32
```

---

## Limitations & Future Plans

### Current Limitations

**Authentication:**
- Email/password only (no OAuth providers)
- No two-factor authentication (2FA)
- No password reset functionality
- No email verification

**Authorization:**
- Three fixed roles (ADMIN, STAFF, CUSTOMER)
- No custom permission system
- No role hierarchy or inheritance

### Planned Enhancements

**Phase 1: Enhanced Security** (High Priority)
- [ ] Password reset via email
- [ ] Email verification on registration
- [ ] Two-factor authentication (2FA)
- [ ] Account lockout after failed attempts

**Phase 2: OAuth & Social Login**
- [ ] Google OAuth
- [ ] GitHub OAuth
- [ ] Microsoft OAuth

**Phase 3: Advanced Authorization**
- [ ] Custom permissions system
- [ ] Permission groups
- [ ] Role inheritance
- [ ] Fine-grained resource access

---

## Troubleshooting

### Login fails with correct credentials
- Verify database is running: `docker ps`
- Check user exists: `npx prisma studio`
- Verify password was hashed: Check users table

### Session not persisting (web)
- Clear browser cookies
- Check NEXTAUTH_SECRET is set in `.env`
- Verify NEXTAUTH_URL matches your domain

### JWT token invalid (API)
- Check JWT_SECRET matches between requests
- Verify token hasn't expired
- Check token format: `Bearer <token>`

### 403 Forbidden on protected route
- Verify user role in database
- Check middleware configuration
- Ensure session/token is valid

---

## Next Steps

After setting up authentication:
→ [User Management](02-user-management.md) - Manage users and roles
→ [Products](03-products.md) - Product catalog management
→ [API Security](../core/security/API_SECURITY.md) - Secure your API endpoints
