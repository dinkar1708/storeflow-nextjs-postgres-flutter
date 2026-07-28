# Security Guide

This document explains the security features implemented in StoreFlow and how to configure them properly.

## Overview

StoreFlow implements multiple layers of security to protect user data, prevent unauthorized access, and ensure system integrity. All security features are enabled by default in production.

## Core Security Features

### 1. Authentication & Authorization

#### Password Security
**What it does**: Enforces strong passwords to prevent unauthorized access

**Requirements**:
- Minimum 8 characters
- At least 1 uppercase letter (A-Z)
- At least 1 lowercase letter (a-z)
- At least 1 number (0-9)
- At least 1 special character (@$!%*?&#)
- Passwords hashed with bcrypt (12 rounds)
- Never stored in plain text

**Example valid passwords**:
- `MyP@ssw0rd`
- `Secure#2024`
- `Admin@123`

#### Session Management
- JWT tokens for API authentication
- NextAuth.js for web sessions
- Secure httpOnly cookies
- Configurable session timeout

#### Role-Based Access Control
- Three roles: ADMIN, STAFF, CUSTOMER
- Route-level protection
- API endpoint authorization
- Middleware-enforced access rules

### 2. Rate Limiting

**What it does**: Prevents brute force attacks, credential stuffing, and API abuse

**Default Limits**:
```typescript
Authentication Endpoints (login, register):
  • 5 attempts per 15 minutes per IP address

Order Creation:
  • 30 requests per minute per IP address

Other Endpoints:
  • 100 requests per minute per IP address
```

**How it works**:
- Tracks requests by IP address + endpoint
- Returns HTTP 429 (Too Many Requests) when limit exceeded
- Includes `Retry-After` header telling clients when to retry
- Automatic cleanup of expired rate limit data

**For Testing**:
Add to your `.env` file:
```bash
DISABLE_RATE_LIMIT="true"
```
⚠️ **Never use this in production!**

### 3. Transaction Safety

**What it does**: Prevents data inconsistency and race conditions

**Order Processing**:
All order creation operations are atomic:
```typescript
1. Check inventory availability
2. Create order record
3. Update product stock

→ All steps succeed together or all fail
→ No partial updates
→ No overselling inventory
```

**Benefits**:
- Prevents inventory overselling during high traffic
- Ensures data consistency
- Handles concurrent orders safely
- Clear error messages when stock unavailable

### 4. Environment Security

**What it does**: Validates critical configuration at startup

**Required Variables** (Production):
```bash
DATABASE_URL          # PostgreSQL connection
NEXTAUTH_SECRET       # JWT signing key (min 32 chars)
NEXTAUTH_URL          # Your app URL
NODE_ENV="production" # Environment indicator
```

**Validation**:
- App fails immediately if `NEXTAUTH_SECRET` missing in production
- Shows warning in development
- Prevents accidental weak configurations

**Generate secure secret**:
```bash
openssl rand -base64 32
```

## Authentication & Authorization

### Password Security
- Passwords hashed with bcrypt (12 rounds)
- Never stored in plain text
- Strong complexity requirements enforced
- Password change requires current password verification

### Session Management
- JWT tokens for API authentication
- NextAuth.js for web session management
- Secure session cookies with httpOnly flag
- Role-based access control (ADMIN, STAFF, CUSTOMER)

### Rate Limiting
All authentication endpoints are rate-limited to prevent:
- Brute force attacks
- Credential stuffing
- DDoS attacks
- Account enumeration

**Configuration:**
```typescript
AUTH_ENDPOINTS: {
  max: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
}

WRITE_ENDPOINTS: {
  max: 30,
  windowMs: 60 * 1000, // 1 minute
}
```

**Disable for Testing:**
Set `DISABLE_RATE_LIMIT="true"` in your `.env` file.

## Data Protection

### SQL Injection Prevention
- Prisma ORM with parameterized queries
- No raw SQL queries without proper escaping
- Input validation on all endpoints

### XSS Prevention
- Next.js built-in sanitization
- Content Security Policy headers
- Output encoding for user-generated content

### CSRF Protection
- SameSite cookies
- CSRF token validation (via NextAuth)
- Origin/Referer header validation

## Transaction Safety

### Order Processing
Order creation uses atomic database transactions:
```typescript
await prisma.$transaction(async (tx) => {
  // 1. Verify stock availability
  // 2. Create order
  // 3. Update inventory
  // All or nothing - prevents data inconsistency
});
```

### Benefits:
- Prevents overselling inventory
- Ensures data consistency
- Handles concurrent operations safely
- Provides clear error messages

## Environment Security

### Required Environment Variables
```bash
DATABASE_URL          # PostgreSQL connection string
NEXTAUTH_SECRET       # JWT signing secret (min 32 chars)
NEXTAUTH_URL          # Application URL
NODE_ENV             # production | development | test
```

### Production Checklist
- [ ] NEXTAUTH_SECRET set to strong random value (`openssl rand -base64 32`)
- [ ] DATABASE_URL uses secure connection (SSL enabled)
- [ ] NODE_ENV set to "production"
- [ ] Rate limiting enabled (DISABLE_RATE_LIMIT not set)
- [ ] .env file not committed to Git
- [ ] Regular dependency updates scheduled

## API Security

### Authentication
All protected API endpoints require:
- Valid JWT token in Authorization header, OR
- Valid NextAuth session cookie

Example:
```bash
curl -H "Authorization: Bearer <your-jwt-token>" \
  http://localhost:3001/api/orders
```

### Error Handling
- Generic error messages returned to clients
- Detailed errors logged server-side only
- No stack traces exposed in production
- Proper HTTP status codes

## Monitoring & Logging

### Security Events (Planned)
- Failed login attempts
- Password change requests
- Role modifications
- Sensitive data access
- Rate limit violations

### Audit Log
AuditLog model is defined in schema and ready for implementation.

## Reporting Security Issues

If you discover a security vulnerability:
1. **Do NOT** open a public GitHub issue
2. Email security concerns privately
3. Provide detailed reproduction steps
4. Allow reasonable time for fixes before disclosure

## Security Best Practices for Deployment

### Database
- Use connection pooling
- Enable SSL/TLS for database connections
- Regular backups
- Principle of least privilege for database users

### Application
- Keep dependencies updated
- Run `npm audit` regularly
- Use HTTPS in production
- Set security headers (CSP, HSTS, X-Frame-Options)
- Implement logging and monitoring

### Infrastructure
- Use environment variables for secrets (never hardcode)
- Enable firewall rules
- Regular security updates for OS
- Use a Web Application Firewall (WAF) if possible

## Testing Security

Run security-focused tests:
```bash
npm test                    # Includes security validation tests
npm audit                   # Check for vulnerable dependencies
npm run build              # Verify production build succeeds
```

## Configuration Guide

### Production Deployment Checklist

Before deploying to production:

- [ ] **Environment Variables**
  - [ ] `NEXTAUTH_SECRET` set to strong random value (`openssl rand -base64 32`)
  - [ ] `NEXTAUTH_URL` set to production URL
  - [ ] `NODE_ENV="production"`
  - [ ] `DISABLE_RATE_LIMIT` NOT set (or set to `"false"`)

- [ ] **Database Security**
  - [ ] Connection uses SSL/TLS
  - [ ] Strong database password
  - [ ] Firewall rules configured
  - [ ] Regular backups enabled

- [ ] **Application Security**
  - [ ] Latest dependencies installed (`npm audit fix`)
  - [ ] No `.env` file committed to Git
  - [ ] HTTPS enabled
  - [ ] Security headers configured

### Testing Security Features

#### Test Rate Limiting
```bash
# Try logging in 6 times with wrong password
# The 6th attempt should return HTTP 429

curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"wrong"}' \
  # Repeat 6 times...
```

#### Test Password Requirements
```bash
# This should fail (password too weak)
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"weak","name":"Test"}'

# This should succeed
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Strong@123","name":"Test"}'
```

#### Test Transaction Safety
```bash
# Run automated test suite
npm test
# Look for: "Order creation uses atomic transactions"
```

## Important Notes

### For Existing Deployments

If you're upgrading from an earlier version:

1. **Password Requirements Changed**
   - Old minimum: 5 characters
   - New minimum: 8 characters with complexity
   - Action: Users with weak passwords will need to reset

2. **Rate Limiting Added**
   - New feature, enabled by default
   - Action: Monitor logs for legitimate users hitting limits
   - Adjust limits in `/api-web/lib/rate-limit.ts` if needed

3. **Environment Validation**
   - Production now requires `NEXTAUTH_SECRET`
   - Action: Set this variable before deploying

### Rate Limit Customization

Edit `/api-web/lib/rate-limit.ts`:

```typescript
export const RateLimitPresets = {
  AUTH: {
    max: 5,              // ← Change this
    windowMs: 15 * 60 * 1000,  // ← Or this
  },
  // ... other presets
};
```

## Support & Questions

### Documentation
- **Setup**: See `/docs/getting-started/`
- **Testing**: See `/docs/development/TESTING.md`
- **Deployment**: See `/docs/core/deployment/PROD_DEPLOYMENT.md`

### Security Testing
All security features are verified in the test suite. See main README for current test status.

