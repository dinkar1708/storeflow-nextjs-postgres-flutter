import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { rateLimit, RateLimitPresets } from '@/lib/rate-limit';
import { handlePrismaError, createErrorResponse, ErrorCodes } from '@/lib/error-handler';
import { validateRequest } from '@/lib/validate-request';
import { registerSchema } from '@/lib/validations';
import { logAuthEvent, AuditAction, getIpAddress } from '@/lib/audit-log';

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new customer
 *     description: Creates a new user with CUSTOMER role
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 description: Minimum 5 characters
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: Bad request (validation failed or email exists)
 */

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await rateLimit(request, RateLimitPresets.AUTH);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    // Validate request body with Zod
    const validation = await validateRequest(request, registerSchema);
    if (validation.error) return validation.error;

    const { email, password, name } = validation.data;

    // Check if user exists
    const exists = await prisma.user.findUnique({
      where: { email },
    });

    if (exists) {
      return createErrorResponse(
        ErrorCodes.DUPLICATE_ENTRY,
        'Email already registered',
        undefined,
        409
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'CUSTOMER',
      },
    });

    // Log registration
    const ipAddress = getIpAddress(request);
    await logAuthEvent(AuditAction.REGISTER, user.id, email, ipAddress);

    // Return user object without password
    return NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    // Handle Prisma-specific errors (e.g., duplicate email)
    if (typeof error === 'object' && error !== null && 'code' in error) {
      return handlePrismaError(error);
    }

    // Handle all other errors
    return createErrorResponse(
      ErrorCodes.INTERNAL_ERROR,
      'Registration failed. Please try again later.',
      error,
      500
    );
  }
}
