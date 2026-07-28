# Error Handling Guide

How error handling works in StoreFlow API.

## Error Response Format

All errors return this structure:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "User-friendly message",
    "details": {} // Development only
  }
}
```

## Error Codes

| Code | Status | Usage |
|------|--------|-------|
| `UNAUTHORIZED` | 401 | Not authenticated |
| `FORBIDDEN` | 403 | No permission |
| `INVALID_CREDENTIALS` | 401 | Wrong email/password |
| `VALIDATION_ERROR` | 400 | Invalid input |
| `DUPLICATE_ENTRY` | 409 | Already exists |
| `NOT_FOUND` | 404 | Resource not found |
| `INSUFFICIENT_STOCK` | 409 | Not enough inventory |
| `INTERNAL_ERROR` | 500 | Server error |
| `DATABASE_ERROR` | 500 | Database failed |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |

## Usage

### Basic Error Handling

```typescript
import { createErrorResponse, ErrorCodes } from '@/lib/error-handler';

export async function POST(request: NextRequest) {
  try {
    // Your code
  } catch (error) {
    return createErrorResponse(
      ErrorCodes.INTERNAL_ERROR,
      'Operation failed',
      error,
      500
    );
  }
}
```

### Prisma Errors

```typescript
import { handlePrismaError } from '@/lib/error-handler';

try {
  await prisma.user.create({ data: {...} });
} catch (error) {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    return handlePrismaError(error); // Auto-handles P2002, P2025, etc.
  }
  return createErrorResponse(ErrorCodes.INTERNAL_ERROR, 'Failed', error, 500);
}
```

### Auto Error Detection

```typescript
import { handleApiError } from '@/lib/error-handler';

try {
  // Your code
} catch (error) {
  return handleApiError(error); // Auto-detects error type
}
```

## Development vs Production

**Development**: Full error details + stack traces
**Production**: Generic messages only, details logged server-side

## Best Practices

❌ **Bad** - Exposes internals:
```typescript
return NextResponse.json({ error: error.message }, { status: 500 });
```

✅ **Good** - Safe for production:
```typescript
return createErrorResponse(
  ErrorCodes.INTERNAL_ERROR,
  'Operation failed',
  error,
  500
);
```

## Testing

```bash
# Development mode - shows details
npm run dev

# Production mode - hides details
NODE_ENV=production npm run dev
```

## Official Documentation

- **Next.js Error Handling**: https://nextjs.org/docs/app/building-your-application/routing/error-handling
- **Prisma Error Reference**: https://www.prisma.io/docs/reference/api-reference/error-reference
- **HTTP Status Codes**: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
- **RFC 7807**: https://datatracker.ietf.org/doc/html/rfc7807

## Related

- [Security Guide](/docs/security/SECURITY.md)
- [Testing Guide](/docs/development/TESTING.md)
