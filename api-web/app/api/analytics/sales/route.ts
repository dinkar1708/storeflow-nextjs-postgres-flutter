import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole, OrderStatus } from '@/lib/enums';

// GET - Get sales analytics data (Admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    // Get all DELIVERED orders
    const deliveredOrders = await prisma.order.findMany({
      where: {
        status: OrderStatus.DELIVERED,
      },
      select: {
        id: true,
        total: true,
        createdAt: true,
        orderNumber: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Calculate daily sales (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailySales = deliveredOrders
      .filter(order => new Date(order.createdAt) >= thirtyDaysAgo)
      .reduce((acc, order) => {
        const date = new Date(order.createdAt).toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = { date, sales: 0, orders: 0 };
        }
        acc[date].sales += Number(order.total);
        acc[date].orders += 1;
        return acc;
      }, {} as Record<string, { date: string; sales: number; orders: number }>);

    // Calculate monthly sales (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const monthlySales = deliveredOrders
      .filter(order => new Date(order.createdAt) >= twelveMonthsAgo)
      .reduce((acc, order) => {
        const date = new Date(order.createdAt);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!acc[monthKey]) {
          acc[monthKey] = { month: monthKey, sales: 0, orders: 0 };
        }
        acc[monthKey].sales += Number(order.total);
        acc[monthKey].orders += 1;
        return acc;
      }, {} as Record<string, { month: string; sales: number; orders: number }>);

    // Calculate yearly sales
    const yearlySales = deliveredOrders.reduce((acc, order) => {
      const year = new Date(order.createdAt).getFullYear().toString();
      if (!acc[year]) {
        acc[year] = { year, sales: 0, orders: 0 };
      }
      acc[year].sales += Number(order.total);
      acc[year].orders += 1;
      return acc;
    }, {} as Record<string, { year: string; sales: number; orders: number }>);

    // Calculate summary statistics
    const totalSales = deliveredOrders.reduce((sum, order) => sum + Number(order.total), 0);
    const totalOrders = deliveredOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    // Get today's sales
    const today = new Date().toISOString().split('T')[0];
    const todaySales = dailySales[today] || { sales: 0, orders: 0 };

    // Get this month's sales
    const thisMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
    const thisMonthSales = monthlySales[thisMonth] || { sales: 0, orders: 0 };

    return NextResponse.json(
      {
        summary: {
          totalSales,
          totalOrders,
          averageOrderValue,
          todaySales: todaySales.sales,
          todayOrders: todaySales.orders,
          thisMonthSales: thisMonthSales.sales,
          thisMonthOrders: thisMonthSales.orders,
        },
        daily: Object.values(dailySales).sort((a, b) => a.date.localeCompare(b.date)),
        monthly: Object.values(monthlySales).sort((a, b) => a.month.localeCompare(b.month)),
        yearly: Object.values(yearlySales).sort((a, b) => a.year.localeCompare(b.year)),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
