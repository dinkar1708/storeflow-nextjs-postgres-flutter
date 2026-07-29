import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/error-handler';

/**
 * @swagger
 * /api/products:
 *   get:
 *     tags:
 *       - Products
 *     summary: List all active products
 *     description: Returns a list of all active products, along with their category. Public endpoint.
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       price:
 *                         type: number
 *                       stockQuantity:
 *                         type: integer
 *                       isActive:
 *                         type: boolean
 *                       images:
 *                         type: array
 *                         items:
 *                           type: string
 *                       category:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *       500:
 *         description: Failed to fetch products
 */
// GET - List all active products (Public)
export async function GET(request: NextRequest) {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        // Exclude costPrice for security - only admins should see it
        stock: true,
        sku: true,
        images: true,
        isActive: true,
        categoryId: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
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
