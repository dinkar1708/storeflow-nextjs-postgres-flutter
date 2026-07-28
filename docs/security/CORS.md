# CORS Configuration

Cross-Origin Resource Sharing (CORS) configuration for the StoreFlow API.

## Overview

The API implements CORS to control which frontend applications can access the API endpoints. This is configured in `/api-web/middleware.ts`.

## Configuration

### Environment Variables

Set allowed origins via the `ALLOWED_ORIGINS` environment variable:

```bash
# Single origin
ALLOWED_ORIGINS=https://yourdomain.com

# Multiple origins (comma-separated)
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com,https://admin.yourdomain.com
```

### Default Allowed Origins

If `ALLOWED_ORIGINS` is not set, these defaults are used:
- `http://localhost:3000`
- `http://localhost:3001`
- `http://localhost:3002`

### Development Mode

In development (`NODE_ENV=development`), all localhost origins are automatically allowed for easier testing.

## CORS Headers

The middleware sets the following headers:

| Header | Value | Purpose |
|--------|-------|---------|
| `Access-Control-Allow-Origin` | Requesting origin (if allowed) | Specifies which origin can access |
| `Access-Control-Allow-Credentials` | `true` | Allows cookies/auth headers |
| `Access-Control-Allow-Methods` | `GET, POST, PUT, PATCH, DELETE, OPTIONS` | Allowed HTTP methods |
| `Access-Control-Allow-Headers` | `Content-Type, Authorization, ...` | Allowed request headers |
| `Access-Control-Max-Age` | `86400` | Cache preflight for 24 hours |

## Allowed Methods

- `GET` - Read resources
- `POST` - Create resources
- `PUT` - Replace resources
- `PATCH` - Update resources
- `DELETE` - Remove resources
- `OPTIONS` - Preflight requests

## Allowed Headers

- `Content-Type` - Request body type
- `Authorization` - JWT tokens
- `X-Requested-With` - AJAX identification
- `Accept` - Response format
- `Origin` - Request origin

## Preflight Requests

The middleware handles OPTIONS preflight requests automatically:

```javascript
// Browser sends OPTIONS request first
OPTIONS /api/products
Origin: https://yourdomain.com

// Server responds with CORS headers
204 No Content
Access-Control-Allow-Origin: https://yourdomain.com
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Max-Age: 86400
```

## Testing CORS

### Test from Browser Console

```javascript
// Test from allowed origin
fetch('http://localhost:3001/api/products', {
  credentials: 'include'
})
  .then(res => res.json())
  .then(data => console.log(data));
```

### Test with curl

```bash
# Test preflight
curl -X OPTIONS http://localhost:3001/api/products \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -v

# Test actual request
curl http://localhost:3001/api/products \
  -H "Origin: http://localhost:3000" \
  -v
```

## Production Setup

1. **Set explicit origins** in production:
```bash
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com
```

2. **Never use wildcard** (`*`) for `Access-Control-Allow-Origin` with credentials

3. **Use HTTPS** for all production origins

4. **Whitelist specific domains** - don't allow all subdomains

## Security Considerations

✅ **Good Practices:**
- Explicitly list allowed origins
- Use HTTPS in production
- Enable credentials only when needed
- Cache preflight responses (24h)
- Validate origin server-side

❌ **Avoid:**
- Wildcard origins with credentials
- Allowing all origins in production
- HTTP origins in production
- Overly permissive headers

## Troubleshooting

### CORS Error: "No 'Access-Control-Allow-Origin' header"

**Cause**: Origin not in allowed list

**Solution**: Add origin to `ALLOWED_ORIGINS`:
```bash
ALLOWED_ORIGINS=https://yourdomain.com,https://newdomain.com
```

### CORS Error: "Method not allowed"

**Cause**: HTTP method not in ALLOWED_METHODS

**Solution**: Method is supported. Check if preflight is working.

### Credentials not being sent

**Cause**: Frontend not sending credentials

**Solution**: Add to fetch:
```javascript
fetch(url, {
  credentials: 'include'  // Important!
})
```

## Official Documentation

- **MDN CORS**: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
- **Next.js Middleware**: https://nextjs.org/docs/app/building-your-application/routing/middleware
- **OWASP CORS**: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Origin_Resource_Sharing_Cheat_Sheet.html

## Related

- [Security Guide](/docs/security/SECURITY.md)
- [Middleware Configuration](/api-web/middleware.ts)
