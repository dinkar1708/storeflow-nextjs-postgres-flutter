import { NextRequest, NextResponse } from 'next/server';
import { getApiUser } from '@/lib/api-session';
import { prisma } from '@/lib/prisma';
import { UserRole, OrderStatus } from '@/lib/enums';
import { rateLimit, RateLimitPresets } from '@/lib/rate-limit';
import { validateRequest } from '@/lib/validate-request';
import { createOrderSchema } from '@/lib/validations';
import { handleApiError } from '@/lib/error-handler';

/**
 * @swagger
 * /api/orders:
 *   post:
 *     tags:
 *       - Orders
 *     summary: Create new order
 *     description: Places a new order. Requires CUSTOMER role.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - total
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                     price:
 *                       type: number
 *               total:
 *                 type: number
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       400:
 *         description: Order must contain at least one item
 *       403:
 *         description: Unauthorized
 */
// POST - Create new order (Customer only)
export async function POST(request: NextRequest) {
  // Apply rate limiting for order creation
  const rateLimitResponse = await rateLimit(request, RateLimitPresets.WRITE);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const user = await getApiUser(request);

    if (!user || user.role !== UserRole.CUSTOMER) {
      return createErrorResponse(ErrorCodes.FORBIDDEN, 'Customer access required', undefined, 403);
    }

    const body = await request.json();
    const { items, total: requestTotal } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return createErrorResponse(
        ErrorCodes.VALIDATION_ERROR,
        'Order must contain at least one item',
        undefined,
        400
      );
    }

    // Calculate total from items (or use provided total for backwards compatibility)
    const total =
      requestTotal || items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Use transaction to ensure atomicity and prevent race conditions
    const order = await prisma.$transaction(async (tx) => {
      // First, check stock availability for all items
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { stock: true, name: true },
        });

        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }

        if (product.stock < item.quantity) {
          throw new Error(
            `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
          );
        }
      }

      // Create order with order items
      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          orderNumber,
          total: parseFloat(total),
          status: OrderStatus.PENDING,
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: parseFloat(item.price),
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      // Update product stock atomically
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

    return NextResponse.json(
      {
        message: 'Order placed successfully',
        order,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

/**
 * @swagger
 * /api/orders:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get user's orders or all orders
 *     description: Customers see their own orders. Admin and Staff see all orders.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of orders
 *       403:
 *         description: Unauthorized
 */
// GET - Get customer's orders
export async function GET(request: NextRequest) {
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

    let orders;

    if (userRole === UserRole.CUSTOMER) {
      // Customers see only their own orders
      orders = await prisma.order.findMany({
        where: {
          userId: user.id,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else if (userRole === UserRole.ADMIN || userRole === UserRole.STAFF) {
      // Admin and Staff see all orders
      orders = await prisma.order.findMany({
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
              product: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      return createErrorResponse(ErrorCodes.FORBIDDEN, 'Invalid user role', undefined, 403);
    }

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
