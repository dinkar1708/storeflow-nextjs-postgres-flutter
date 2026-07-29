import { NextRequest, NextResponse } from 'next/server';
import { getApiUser } from '@/lib/api-session';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@/lib/enums';
import { createErrorResponse, ErrorCodes, handleApiError } from '@/lib/error-handler';

/**
 * @swagger
 * /api/wishlist/{productId}:
 *   delete:
 *     tags:
 *       - Wishlist
 *     summary: Remove a product from the wishlist
 *     description: Removes the given product from the authenticated customer's wishlist.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Removed from wishlist
 *       404:
 *         description: Wishlist entry not found
 *       403:
 *         description: Unauthorized
 */
export async function DELETE(request: NextRequest, { params }: { params: { productId: string } }) {
  try {
    const user = await getApiUser(request);

    if (!user || user.role !== UserRole.CUSTOMER) {
      return createErrorResponse(ErrorCodes.FORBIDDEN, 'Customer access required', undefined, 403);
    }

    const { productId } = params;

    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: { userId: user.id, productId },
      },
    });

    if (!existing) {
      return createErrorResponse(ErrorCodes.NOT_FOUND, 'Wishlist entry not found', undefined, 404);
    }

    await prisma.wishlist.delete({
      where: { id: existing.id },
    });

    return NextResponse.json({ message: 'Removed from wishlist' }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
