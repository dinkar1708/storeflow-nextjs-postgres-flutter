import { NextRequest, NextResponse } from 'next/server';
import { getApiUser } from '@/lib/api-session';
import { prisma } from '@/lib/prisma';

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
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getApiUser(request);

    // Check if user is authenticated and is admin
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { role, isActive } = body;

    // Validate role if provided
    if (role && !['ADMIN', 'STAFF', 'CUSTOMER'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be ADMIN, STAFF, or CUSTOMER' },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: any = {};
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

    return NextResponse.json(
      {
        message: 'User updated successfully',
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating user:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
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
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getApiUser(request);

    // Check if user is authenticated and is admin
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const { id } = params;

    // Prevent admin from deleting themselves
    if (user.id === id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // Delete user
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting user:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
