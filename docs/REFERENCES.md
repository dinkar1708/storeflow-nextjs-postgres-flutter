# Official References & Best Practices

This document lists official documentation and best practices we follow for building StoreFlow.

---

## Authentication & Security

1. **OWASP Top 10**
   - https://owasp.org/www-project-top-ten/
   - **Why:** Security vulnerabilities to protect against

2. **OWASP API Security**
   - https://owasp.org/www-project-api-security/
   - **Why:** API-specific security best practices

3. **NextAuth.js Documentation**
   - https://next-auth.js.org
   - **Why:** Session-based authentication

4. **jose JWT Library**
   - https://github.com/panva/jose
   - **Why:** JWT token generation and validation

---

## Core Framework

5. **Next.js 14 Documentation**
   - https://nextjs.org/docs
   - **Why:** App Router, API routes, and middleware patterns

6. **React Documentation**
   - https://react.dev
   - **Why:** UI component fundamentals

7. **TypeScript Handbook**
   - https://www.typescriptlang.org/docs/handbook/
   - **Why:** Type system and best practices

---

## Database & ORM

8. **Prisma Documentation**
   - https://www.prisma.io/docs
   - **Why:** Database ORM, schema, and queries

9. **Prisma Error Reference**
   - https://www.prisma.io/docs/reference/api-reference/error-reference
   - **Why:** Database error handling (P2002, P2025, etc.)

10. **PostgreSQL Documentation**
    - https://www.postgresql.org/docs/
    - **Why:** Database fundamentals and SQL

---

## Validation & Standards

11. **Zod Documentation**
    - https://zod.dev
    - **Why:** Type-safe schema validation

12. **HTTP Status Codes**
    - https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    - **Why:** Proper status code usage

13. **REST API Best Practices**
    - https://restfulapi.net
    - **Why:** RESTful API design patterns

---

## Testing

14. **Vitest Documentation**
    - https://vitest.dev
    - **Why:** Testing framework (Vite-native)

15. **Supertest**
    - https://github.com/ladjs/supertest
    - **Why:** HTTP API endpoint testing

---

## Styling

16. **Tailwind CSS**
    - https://tailwindcss.com/docs
    - **Why:** Utility-first CSS framework

---

## Deployment

17. **Next.js Deployment**
    - https://nextjs.org/docs/deployment
    - **Why:** Production deployment guide

18. **Docker Best Practices**
    - https://docs.docker.com/build/building/best-practices/
    - **Why:** Container optimization

---

## Mobile (Flutter)

19. **Flutter Documentation**
    - https://docs.flutter.dev
    - **Why:** Mobile app framework

20. **Dart Language Guide**
    - https://dart.dev/guides
    - **Why:** Dart language fundamentals

---

## How We Apply These

### API Development
- Follow **REST best practices** (resource-based URLs)
- Use **Next.js API routes** for server endpoints
- Return **proper HTTP status codes**
- Handle **Prisma errors** correctly (P2002 = duplicate, P2025 = not found)

### Security
- Follow **OWASP Top 10** guidelines
- Hash passwords with **bcryptjs** (12 rounds)
- Use **JWT authentication** with jose library
- Apply **rate limiting** on sensitive endpoints
- Validate all inputs

### Database
- Use **Prisma ORM** for all database access
- Apply **transactions** for atomic operations (order creation)
- Add **indexes** for frequently queried fields

### Testing
- Use **Vitest** for all tests
- Test API endpoints with **Supertest**
- Target **80%+ code coverage**

### Code Quality
- Use **TypeScript** for type safety
- Validate inputs with **Zod**
- Style with **Tailwind CSS**

---

## Quick Reference

**When adding an API endpoint:**
1. Use Next.js API route patterns
2. Validate input with Zod
3. Use Prisma for database queries
4. Return proper HTTP status codes
5. Write tests with Vitest

**When handling errors:**
1. Use standardized error handler (`/lib/error-handler.ts`)
2. Check Prisma error reference for database errors
3. Return generic messages in production
4. Log details server-side only

**When deploying:**
1. Set strong `NEXTAUTH_SECRET`
2. Configure PostgreSQL with SSL
3. Enable rate limiting
4. Follow Docker best practices

---

## Project Documentation

- [Security Guide](/docs/security/SECURITY.md)
- [Error Handling Guide](/docs/development/ERROR_HANDLING.md)
- [Setup with Docker](/docs/getting-started/SETUP_WITH_DOCKER.md)
- [Production Deployment](/docs/core/deployment/PROD_DEPLOYMENT.md)

---

**Last Updated**: 2026-07-28

**Note:** Update this document when adopting new tools or finding broken links.
