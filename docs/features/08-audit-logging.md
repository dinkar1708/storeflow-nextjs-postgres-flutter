# Feature: Audit Logging

**What:** Track all system changes and user activities for compliance and security.

**Who needs it:** Admins who need to track who did what and when for security and compliance.

---

## What Gets Logged

- User role changes
- Product creation/updates/deletions
- Order status changes
- User account modifications
- Failed login attempts

---

## Database Schema

```prisma
model AuditLog {
  id        String   @id @default(cuid())
  userId    String?
  action    String
  entity    String
  entityId  String?
  details   String?
  ipAddress String?
  createdAt DateTime @default(now())

  @@index([userId])
  @@index([entity, entityId])
  @@map("audit_logs")
}
```

---

## Example Log Entry

```json
{
  "id": "clx_log_123",
  "userId": "clx_user_admin",
  "action": "UPDATE_USER_ROLE",
  "entity": "User",
  "entityId": "clx_user_customer",
  "details": "Role changed from CUSTOMER to STAFF",
  "ipAddress": "192.168.1.100",
  "createdAt": "2026-07-20T10:00:00Z"
}
```

---

## Future Plans

- [ ] Audit log viewer UI
- [ ] Export logs to CSV
- [ ] Real-time alerts on suspicious activity
- [ ] Log retention policies
