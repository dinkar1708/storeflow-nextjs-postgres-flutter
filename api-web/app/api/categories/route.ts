import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * @swagger
 * /api/categories:
 *   get:
 *     tags:
 *       - Categories
 *     summary: List all categories
 *     description: Returns a list of all product categories. Public endpoint.
 *     responses:
 *       200:
 *         description: A list of categories
 *       500:
 *         description: Server error
 */
// GET - List all categories (Public)
export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
