import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createErrorResponse, ErrorCodes, handlePrismaError } from '@/lib/error-handler';
import { logUserAction, AuditAction, getIpAddress } from '@/lib/audit-log';
import { requireAdmin, isErrorResponse } from '@/lib/auth-middleware';

/**
 * @swagger
 * /api/admin/users/{id}:
 *   patch:
 *     tags:
 *       - Admin
 *     summary: Update user role or status
 *     description: Update a user's role or active status. Requires ADMIN role.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [ADMIN, STAFF, CUSTOMER]
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid role requested
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
// PATCH - Update user role or status (Admin only)
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Require admin authentication
    const authResult = await requireAdmin(request);
    if (isErrorResponse(authResult)) return authResult;
    const user = authResult;

    const { id } = params;
    const body = await request.json();
    const { role, isActive } = body;

    // Validate role if provided
    if (role && !['ADMIN', 'STAFF', 'CUSTOMER'].includes(role)) {
      return createErrorResponse(
        ErrorCodes.VALIDATION_ERROR,
        'Invalid role. Must be ADMIN, STAFF, or CUSTOMER',
        undefined,
        400
      );
    }

    // Build update data
    const updateData: { role?: string; isActive?: boolean } = {};
    if (role !== undefined) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Log user update
    const ipAddress = getIpAddress(request);
    const action = role !== undefined ? AuditAction.USER_ROLE_CHANGED : AuditAction.USER_UPDATED;
    await logUserAction(action, user.id, id, updateData, ipAddress);

    return NextResponse.json(
      {
        message: 'User updated successfully',
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    return handlePrismaError(error);
  }
}

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Delete a user
 *     description: Deletes a user from the system. Requires ADMIN role.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Cannot delete your own account
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
// DELETE - Delete user (Admin only)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Require admin authentication
    const authResult = await requireAdmin(request);
    if (isErrorResponse(authResult)) return authResult;
    const user = authResult;

    const { id } = params;

    // Prevent admin from deleting themselves
    if (user.id === id) {
      return createErrorResponse(
        ErrorCodes.VALIDATION_ERROR,
        'Cannot delete your own account',
        undefined,
        400
      );
    }

    // Delete user
    const deletedUser = await prisma.user.delete({
      where: { id },
      select: { email: true, name: true, role: true },
    });

    // Log user deletion
    const ipAddress = getIpAddress(request);
    await logUserAction(
      AuditAction.USER_DELETED,
      user.id,
      id,
      { email: deletedUser.email, name: deletedUser.name },
      ipAddress
    );

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error: unknown) {
    return handlePrismaError(error);
  }
}
