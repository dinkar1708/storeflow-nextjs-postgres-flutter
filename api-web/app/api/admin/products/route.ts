import { NextRequest, NextResponse } from 'next/server';
import { getApiUser } from '@/lib/api-session';
import { prisma } from '@/lib/prisma';
import { createErrorResponse, ErrorCodes, handleApiError, handlePrismaError } from '@/lib/error-handler';

/**
 * @swagger
 * /api/admin/products:
 *   get:
 *     tags:
 *       - Admin
 *     summary: List all products (Admin)
 *     description: Returns a list of all products (including inactive) for admin management. Requires ADMIN role.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of products
 *       403:
 *         description: Unauthorized
 */
// GET - List all products (Admin only)
export async function GET(request: NextRequest) {
  try {
    const user = await getApiUser(request);

    if (!user || user.role !== 'ADMIN') {
      return createErrorResponse(
        ErrorCodes.FORBIDDEN,
        'Admin access required',
        undefined,
        403
      );
    }

    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * @swagger
 * /api/admin/products:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Create new product
 *     description: Creates a new product. Requires ADMIN role.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               costPrice:
 *                 type: number
 *               stock:
 *                 type: integer
 *               categoryId:
 *                 type: string
 *               sku:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation failed or SKU exists
 *       403:
 *         description: Unauthorized
 */
// POST - Create new product (Admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await getApiUser(request);

    if (!user || user.role !== 'ADMIN') {
      return createErrorResponse(
        ErrorCodes.FORBIDDEN,
        'Admin access required',
        undefined,
        403
      );
    }

    const body = await request.json();
    const { name, description, price, costPrice, stock, categoryId, sku } = body;

    // Validate required fields
    if (!name || !price || !categoryId) {
      return createErrorResponse(
        ErrorCodes.VALIDATION_ERROR,
        'Name, price, and category are required',
        undefined,
        400
      );
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        description: description || '',
        price: parseFloat(price),
        costPrice: costPrice ? parseFloat(costPrice) : null,
        stock: parseInt(stock) || 0,
        categoryId,
        sku: sku || null,
        images: [],
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(
      {
        message: 'Product created successfully',
        product,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return handlePrismaError(error);
  }
}
