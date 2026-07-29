import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { createErrorResponse, ErrorCodes } from '@/lib/error-handler';
import { validateRequest } from '@/lib/validate-request';
import { loginSchema } from '@/lib/validations';
import { logAuthEvent, AuditAction, getIpAddress } from '@/lib/audit-log';

// Validate JWT secret - fail fast in production if not set
if (!process.env.NEXTAUTH_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('NEXTAUTH_SECRET environment variable is required in production');
  }
  console.warn('⚠️  WARNING: NEXTAUTH_SECRET not set, using development fallback');
}

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret-for-dev';
const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function handleJwtLogin(request: NextRequest): Promise<NextResponse> {
  try {
    // Validate request body with Zod
    const validation = await validateRequest(request, loginSchema);
    if (validation.error) return validation.error;

    const { email, password } = validation.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    const ipAddress = getIpAddress(request);

    if (!user || !user.isActive) {
      // Log failed login attempt
      await logAuthEvent(AuditAction.LOGIN_FAILED, null, email, ipAddress);

      return NextResponse.json(
        { error: 'Invalid credentials or inactive account' },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      // Log failed login attempt
      await logAuthEvent(AuditAction.LOGIN_FAILED, user.id, email, ipAddress);

      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Log successful login
    await logAuthEvent(AuditAction.LOGIN_SUCCESS, user.id, email, ipAddress);

    const token = await new SignJWT({
      id: user.id,
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d') // Reduced from 30d to 7d for better security
      .sign(secretKey);

    return NextResponse.json(
      {
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    return createErrorResponse(
      ErrorCodes.INTERNAL_ERROR,
      'Login failed. Please try again later.',
      error,
      500
    );
  }
}
