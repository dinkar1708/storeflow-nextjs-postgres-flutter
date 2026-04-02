import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole, OrderStatus } from '@/lib/enums';

// PATCH - Update order status (Admin/Staff only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const userRole = (session.user as any).role;

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
