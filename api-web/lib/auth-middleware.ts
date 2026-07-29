import { NextRequest, NextResponse } from 'next/server';
import { getApiUser } from './api-session';
import { createErrorResponse, ErrorCodes } from './error-handler';
import { UserRole } from './enums';

/**
 * Authorization middleware utilities for role-based access control
 */

export type AuthorizedUser = {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
};

/**
 * Require authentication - any logged-in user
 */
export async function requireAuth(request: NextRequest): Promise<NextResponse | AuthorizedUser> {
  const user = await getApiUser(request);

  if (!user) {
    return createErrorResponse(
      ErrorCodes.UNAUTHORIZED,
      'Authentication required',
      undefined,
      401
    );
  }

  if (!user.isActive) {
    return createErrorResponse(
      ErrorCodes.FORBIDDEN,
      'Account is inactive',
      undefined,
      403
    );
  }

  return user as AuthorizedUser;
}

/**
 * Require specific role(s)
 */
export async function requireRole(
  request: NextRequest,
  allowedRoles: UserRole[]
): Promise<NextResponse | AuthorizedUser> {
  const authResult = await requireAuth(request);

  // If it's an error response, return it
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const user = authResult;

  if (!allowedRoles.includes(user.role as UserRole)) {
    return createErrorResponse(
      ErrorCodes.FORBIDDEN,
      `${allowedRoles.join(' or ')} access required`,
      undefined,
      403
    );
  }

  return user;
}

/**
 * Require admin role
 */
export async function requireAdmin(request: NextRequest): Promise<NextResponse | AuthorizedUser> {
  return requireRole(request, [UserRole.ADMIN]);
}

/**
 * Require admin or staff role
 */
export async function requireStaff(request: NextRequest): Promise<NextResponse | AuthorizedUser> {
  return requireRole(request, [UserRole.ADMIN, UserRole.STAFF]);
}

/**
 * Require customer role
 */
export async function requireCustomer(request: NextRequest): Promise<NextResponse | AuthorizedUser> {
  return requireRole(request, [UserRole.CUSTOMER]);
}

/**
 * Type guard to check if result is an error response
 */
export function isErrorResponse(result: NextResponse | AuthorizedUser): result is NextResponse {
  return result instanceof NextResponse;
}
