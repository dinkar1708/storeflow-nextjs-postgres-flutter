# CSRF Protection

Cross-Site Request Forgery (CSRF) protection via Origin/Referer header verification.

## How It Works

For JWT-based APIs, CSRF protection is implemented by **verifying Origin/Referer headers** on state-changing operations (POST, PUT, PATCH, DELETE).

### Protection Flow

1. Check Origin header (primary)
2. Fallback to Referer header
3. Reject if neither matches `ALLOWED_ORIGINS`

### Why This Works

- JWT tokens in `Authorization` headers require JavaScript
- Malicious sites cannot read tokens from your domain (Same-Origin Policy)
- Origin verification ensures requests come from trusted domains

## Configuration

Uses same `ALLOWED_ORIGINS` as CORS:

```bash
# Production
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com
NODE_ENV=production

# Development (CSRF disabled for easier testing)
NODE_ENV=development
```

## Protected Methods

- ✅ POST, PUT, PATCH, DELETE
- ❌ GET, OPTIONS (safe methods)

## Frontend Usage

No special handling needed - browsers automatically add Origin header:

```javascript
fetch('https://api.example.com/api/orders', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(orderData)
  // Origin header automatically added by browser
})
```

## Error Response

```json
HTTP 403 Forbidden
{
  "success": false,
  "error": {
    "code": "CSRF_VALIDATION_FAILED",
    "message": "Invalid origin for this request"
  }
}
```

## Testing

### Valid Request (Should Succeed)
```bash
curl -X POST http://localhost:3001/api/orders \
  -H "Origin: http://localhost:3000" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"items": [...]}'
```

### Invalid Request (Fails in Production)
```bash
NODE_ENV=production curl -X POST http://localhost:3001/api/orders \
  -H "Origin: https://evil-site.com" \
  -H "Authorization: Bearer TOKEN"
# Returns: 403 CSRF_VALIDATION_FAILED
```

## Production Setup

1. Set explicit allowed origins
2. Use HTTPS
3. Keep `NODE_ENV=production`
4. Whitelist specific origins only

## Official References

- **OWASP CSRF Guide**: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
- **OWASP JWT Security**: https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html

## Related

- [CORS Configuration](/docs/security/CORS.md)
- [Security Guide](/docs/security/SECURITY.md)
