import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { createErrorResponse, ErrorCodes, handleApiError } from '@/lib/error-handler';
import { validateRequest } from '@/lib/validate-request';
import { updateProfileSchema } from '@/lib/validations';

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     tags:
 *       - User Profile
 *     summary: Get current user profile
 *     description: Returns the logged-in user's profile information
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return createErrorResponse(
        ErrorCodes.UNAUTHORIZED,
        'Authentication required',
        undefined,
        401
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return createErrorResponse(ErrorCodes.NOT_FOUND, 'User not found', undefined, 404);
    }

    return NextResponse.json({ user });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * @swagger
 * /api/user/profile:
 *   patch:
 *     tags:
 *       - User Profile
 *     summary: Update current user profile
 *     description: Updates the logged-in user's profile information
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               currentPassword:
 *                 type: string
 *                 description: Required only if changing password
 *               newPassword:
 *                 type: string
 *                 description: New password (minimum 5 characters)
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return createErrorResponse(
        ErrorCodes.UNAUTHORIZED,
        'Authentication required',
        undefined,
        401
      );
    }

    // Validate request body with Zod
    const validation = await validateRequest(request, updateProfileSchema);
    if (validation.error) return validation.error;

    const { name, email, currentPassword, newPassword } = validation.data;

    // Get current user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return createErrorResponse(ErrorCodes.NOT_FOUND, 'User not found', undefined, 404);
    }

    // Prepare update data
    const updateData: any = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;

    // Handle password change (validation already handled by Zod schema)
    if (newPassword && currentPassword) {
      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return createErrorResponse(
          ErrorCodes.INVALID_CREDENTIALS,
          'Current password is incorrect',
          undefined,
          400
        );
      }

      // Hash new password
      updateData.password = await bcrypt.hash(newPassword, 12);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        role: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
