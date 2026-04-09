import { NextRequest, NextResponse } from 'next/server';
import { getApiUser } from '@/lib/api-session';
import { prisma } from '@/lib/prisma';

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all users
 *     description: Returns a list of all users in the system. Requires ADMIN role.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       email:
 *                         type: string
 *                       name:
 *                         type: string
 *                       role:
 *                         type: string
 *                       isActive:
 *                         type: boolean
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       403:
 *         description: Unauthorized - Admin access required
 *       500:
 *         description: Failed to fetch users
 */
// GET - Get all users (Admin only)
export async function GET(request: NextRequest) {
  try {
    const user = await getApiUser(request);

    // Check if user is authenticated and is admin
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
