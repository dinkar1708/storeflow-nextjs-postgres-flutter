import { NextRequest, NextResponse } from 'next/server';
import { getApiUser } from '@/lib/api-session';
import { prisma } from '@/lib/prisma';

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
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
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
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
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
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, description, price, costPrice, stock, categoryId, sku } = body;

    // Validate required fields
    if (!name || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Name, price, and category are required' },
        { status: 400 }
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
    console.error('Error creating product:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'SKU already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
