import { NextRequest, NextResponse } from 'next/server';
import { getApiUser } from '@/lib/api-session';
import { prisma } from '@/lib/prisma';
import { UserRole, OrderStatus } from '@/lib/enums';
import { createErrorResponse, ErrorCodes, handleApiError } from '@/lib/error-handler';
import { validateRequest } from '@/lib/validate-request';
import { updateOrderStatusSchema } from '@/lib/validations';

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Fetch single order
 *     description: Returns a specific order. Customers can only view their own.
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
 *         description: Order fetched successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: Order not found
 */
// GET - Fetch single order by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getApiUser(request);

    if (!user) {
      return createErrorResponse(
        ErrorCodes.UNAUTHORIZED,
        'Authentication required',
        undefined,
        401
      );
    }

    const { id } = params;
    const userRole = user.role;
    const userId = user.id;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
                price: true,
                costPrice: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return createErrorResponse(ErrorCodes.NOT_FOUND, 'Order not found', undefined, 404);
    }

    // Customers can only view their own orders
    if (userRole === UserRole.CUSTOMER && order.user.id !== userId) {
      return createErrorResponse(
        ErrorCodes.FORBIDDEN,
        'Access denied to this order',
        undefined,
        403
      );
    }

    return NextResponse.json({ order }, { status: 200 });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

/**
 * @swagger
 * /api/orders/{id}:
 *   patch:
 *     tags:
 *       - Orders
 *     summary: Update order status
 *     description: Updates the status of an existing order. Requires Admin/Staff role.
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
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Invalid order status
 *       403:
 *         description: Unauthorized
 */
// PATCH - Update order status (Admin/Staff only)
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getApiUser(request);

    if (!user) {
      return createErrorResponse(
        ErrorCodes.UNAUTHORIZED,
        'Authentication required',
        undefined,
        401
      );
    }

    const userRole = user.role;

    if (userRole !== UserRole.ADMIN && userRole !== UserRole.STAFF) {
      return createErrorResponse(
        ErrorCodes.FORBIDDEN,
        'Admin or Staff access required',
        undefined,
        403
      );
    }

    const { id } = params;

    // Validate request body with Zod
    const validation = await validateRequest(request, updateOrderStatusSchema);
    if (validation.error) return validation.error;

    const { status } = validation.data;

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: 'Order status updated successfully',
        order,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
