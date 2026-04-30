import { NextRequest, NextResponse } from 'next/server';
import { getApiUser } from '@/lib/api-session';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@/lib/enums';

/**
 * @swagger
 * /api/wishlist:
 *   get:
 *     tags:
 *       - Wishlist
 *     summary: Get the authenticated customer's wishlist
 *     description: Returns the wishlist items (with product + category) for the logged-in customer.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of wishlist items
 *       403:
 *         description: Unauthorized
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getApiUser(request);

    if (!user || user.role !== UserRole.CUSTOMER) {
      return NextResponse.json(
        { error: 'Unauthorized - Customer access required' },
        { status: 403 }
      );
    }

    const items = await prisma.wishlist.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: { category: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ items }, { status: 200 });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/wishlist:
 *   post:
 *     tags:
 *       - Wishlist
 *     summary: Add a product to the wishlist
 *     description: Adds a product to the authenticated customer's wishlist. Idempotent — duplicate adds return the existing entry.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product added to wishlist
 *       200:
 *         description: Product already in wishlist
 *       400:
 *         description: Missing productId or product not found
 *       403:
 *         description: Unauthorized
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getApiUser(request);

    if (!user || user.role !== UserRole.CUSTOMER) {
      return NextResponse.json(
        { error: 'Unauthorized - Customer access required' },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { productId } = body as { productId?: string };

    if (!productId || typeof productId !== 'string') {
      return NextResponse.json(
        { error: 'productId is required' },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.isActive) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 400 }
      );
    }

    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: { userId: user.id, productId },
      },
      include: { product: { include: { category: true } } },
    });

    if (existing) {
      return NextResponse.json(
        { message: 'Product already in wishlist', item: existing },
        { status: 200 }
      );
    }

    const item = await prisma.wishlist.create({
      data: {
        userId: user.id,
        productId,
      },
      include: { product: { include: { category: true } } },
    });

    return NextResponse.json(
      { message: 'Product added to wishlist', item },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return NextResponse.json(
      { error: 'Failed to add to wishlist' },
      { status: 500 }
    );
  }
}
