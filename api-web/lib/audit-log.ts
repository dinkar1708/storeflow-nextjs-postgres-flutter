import { prisma } from './prisma';
import type { NextRequest } from 'next/server';

/**
 * Audit Log utility for tracking security-sensitive operations
 *
 * Logs admin actions, auth events, and critical data changes for security and compliance.
 */

export enum AuditAction {
  // Authentication
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGOUT = 'LOGOUT',
  REGISTER = 'REGISTER',

  // User Management (Admin)
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',
  USER_ROLE_CHANGED = 'USER_ROLE_CHANGED',
  USER_STATUS_CHANGED = 'USER_STATUS_CHANGED',

  // Product Management (Admin/Staff)
  PRODUCT_CREATED = 'PRODUCT_CREATED',
  PRODUCT_UPDATED = 'PRODUCT_UPDATED',
  PRODUCT_DELETED = 'PRODUCT_DELETED',

  // Category Management (Admin)
  CATEGORY_CREATED = 'CATEGORY_CREATED',
  CATEGORY_UPDATED = 'CATEGORY_UPDATED',
  CATEGORY_DELETED = 'CATEGORY_DELETED',

  // Order Management
  ORDER_CREATED = 'ORDER_CREATED',
  ORDER_STATUS_CHANGED = 'ORDER_STATUS_CHANGED',
  ORDER_CANCELLED = 'ORDER_CANCELLED',
}

export enum AuditEntity {
  USER = 'User',
  PRODUCT = 'Product',
  CATEGORY = 'Category',
  ORDER = 'Order',
  AUTH = 'Auth',
}

type AuditLogData = {
  userId?: string | null;
  action: AuditAction;
  entity: AuditEntity;
  entityId?: string | null;
  details?: Record<string, unknown> | string;
  ipAddress?: string | null;
};

/**
 * Extract IP address from Next.js request
 */
export function getIpAddress(request: NextRequest): string | null {
  // Check common headers (reverse proxy, load balancer)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback (may be proxy IP in production)
  return request.ip || null;
}

/**
 * Create an audit log entry
 */
export async function createAuditLog(data: AuditLogData): Promise<void> {
  try {
    // Convert details object to JSON string if needed
    const detailsString = typeof data.details === 'string'
      ? data.details
      : data.details
        ? JSON.stringify(data.details)
        : null;

    await prisma.auditLog.create({
      data: {
        userId: data.userId || null,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId || null,
        details: detailsString,
        ipAddress: data.ipAddress || null,
      },
    });
  } catch (error) {
    // Log error but don't throw - audit logging failures shouldn't break app
    console.error('[AuditLog] Failed to create audit log:', error);
  }
}

/**
 * Log authentication events
 */
export async function logAuthEvent(
  action: AuditAction.LOGIN_SUCCESS | AuditAction.LOGIN_FAILED | AuditAction.LOGOUT | AuditAction.REGISTER,
  userId: string | null,
  email: string,
  ipAddress: string | null
): Promise<void> {
  await createAuditLog({
    userId,
    action,
    entity: AuditEntity.AUTH,
    details: { email },
    ipAddress,
  });
}

/**
 * Log user management actions (admin only)
 */
export async function logUserAction(
  action: AuditAction,
  adminUserId: string,
  targetUserId: string,
  changes: Record<string, unknown>,
  ipAddress: string | null
): Promise<void> {
  await createAuditLog({
    userId: adminUserId,
    action,
    entity: AuditEntity.USER,
    entityId: targetUserId,
    details: changes,
    ipAddress,
  });
}

/**
 * Log product management actions
 */
export async function logProductAction(
  action: AuditAction,
  userId: string,
  productId: string | null,
  details: Record<string, unknown>,
  ipAddress: string | null
): Promise<void> {
  await createAuditLog({
    userId,
    action,
    entity: AuditEntity.PRODUCT,
    entityId: productId,
    details,
    ipAddress,
  });
}

/**
 * Log order management actions
 */
export async function logOrderAction(
  action: AuditAction,
  userId: string,
  orderId: string,
  details: Record<string, unknown>,
  ipAddress: string | null
): Promise<void> {
  await createAuditLog({
    userId,
    action,
    entity: AuditEntity.ORDER,
    entityId: orderId,
    details,
    ipAddress,
  });
}
