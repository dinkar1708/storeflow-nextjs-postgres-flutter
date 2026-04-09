import { NextRequest, NextResponse } from 'next/server';
import { getApiUser } from '@/lib/api-session';
import { prisma } from '@/lib/prisma';
import { UserRole, OrderStatus } from '@/lib/enums';

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
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getApiUser(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
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
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Customers can only view their own orders
    if (userRole === UserRole.CUSTOMER && order.user.id !== userId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    return NextResponse.json({ order }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
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
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getApiUser(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const userRole = user.role;

    if (userRole !== UserRole.ADMIN && userRole !== UserRole.STAFF) {
      return NextResponse.json(
        { error: 'Admin or Staff access required' },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { status } = body;

    const validStatuses = Object.values(OrderStatus);

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid order status' },
        { status: 400 }
      );
    }

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
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
