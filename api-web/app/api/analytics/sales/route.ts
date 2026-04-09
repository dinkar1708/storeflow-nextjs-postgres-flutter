import { NextRequest, NextResponse } from 'next/server';
import { getApiUser } from '@/lib/api-session';
import { prisma } from '@/lib/prisma';
import { UserRole, OrderStatus } from '@/lib/enums';

/**
 * @swagger
 * /api/analytics/sales:
 *   get:
 *     tags:
 *       - Analytics
 *     summary: Get sales analytics
 *     description: Returns detailed sales analytics including summary, daily, monthly, and yearly data. Requires ADMIN role.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics data fetched successfully
 *       403:
 *         description: Unauthorized
 */
// GET - Get sales analytics data (Admin only)
export async function GET(request: NextRequest) {
  try {
    const user = await getApiUser(request);

    if (!user || user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    // Get all DELIVERED orders with items and product cost prices
    const deliveredOrders = await prisma.order.findMany({
      where: {
        status: OrderStatus.DELIVERED,
      },
      select: {
        id: true,
        total: true,
        createdAt: true,
        orderNumber: true,
        items: {
          select: {
            quantity: true,
            price: true,
            product: {
              select: {
                costPrice: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Calculate cost and profit for each order
    const ordersWithProfit = deliveredOrders.map(order => {
      const totalCost = order.items.reduce((sum, item) => {
        const costPrice = item.product.costPrice ? Number(item.product.costPrice) : 0;
        return sum + (costPrice * item.quantity);
      }, 0);

      const revenue = Number(order.total);
      const profit = revenue - totalCost;

      return {
        ...order,
        cost: totalCost,
        profit: profit,
      };
    });

    // Calculate daily sales (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailySales = ordersWithProfit
      .filter(order => new Date(order.createdAt) >= thirtyDaysAgo)
      .reduce((acc, order) => {
        const date = new Date(order.createdAt).toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = { date, sales: 0, orders: 0, cost: 0, profit: 0 };
        }
        acc[date].sales += Number(order.total);
        acc[date].cost += order.cost;
        acc[date].profit += order.profit;
        acc[date].orders += 1;
        return acc;
      }, {} as Record<string, { date: string; sales: number; orders: number; cost: number; profit: number }>);

    // Calculate monthly sales (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const monthlySales = ordersWithProfit
      .filter(order => new Date(order.createdAt) >= twelveMonthsAgo)
      .reduce((acc, order) => {
        const date = new Date(order.createdAt);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!acc[monthKey]) {
          acc[monthKey] = { month: monthKey, sales: 0, orders: 0, cost: 0, profit: 0 };
        }
        acc[monthKey].sales += Number(order.total);
        acc[monthKey].cost += order.cost;
        acc[monthKey].profit += order.profit;
        acc[monthKey].orders += 1;
        return acc;
      }, {} as Record<string, { month: string; sales: number; orders: number; cost: number; profit: number }>);

    // Calculate yearly sales
    const yearlySales = ordersWithProfit.reduce((acc, order) => {
      const year = new Date(order.createdAt).getFullYear().toString();
      if (!acc[year]) {
        acc[year] = { year, sales: 0, orders: 0, cost: 0, profit: 0 };
      }
      acc[year].sales += Number(order.total);
      acc[year].cost += order.cost;
      acc[year].profit += order.profit;
      acc[year].orders += 1;
      return acc;
    }, {} as Record<string, { year: string; sales: number; orders: number; cost: number; profit: number }>);

    // Calculate summary statistics
    const totalSales = ordersWithProfit.reduce((sum, order) => sum + Number(order.total), 0);
    const totalCost = ordersWithProfit.reduce((sum, order) => sum + order.cost, 0);
    const totalProfit = ordersWithProfit.reduce((sum, order) => sum + order.profit, 0);
    const totalOrders = ordersWithProfit.length;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
    const profitMargin = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;

    // Get today's sales
    const today = new Date().toISOString().split('T')[0];
    const todaySales = dailySales[today] || { sales: 0, orders: 0, cost: 0, profit: 0 };

    // Get this month's sales
    const thisMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
    const thisMonthSales = monthlySales[thisMonth] || { sales: 0, orders: 0, cost: 0, profit: 0 };

    return NextResponse.json(
      {
        summary: {
          totalSales,
          totalCost,
          totalProfit,
          profitMargin,
          totalOrders,
          averageOrderValue,
          todaySales: todaySales.sales,
          todayCost: todaySales.cost,
          todayProfit: todaySales.profit,
          todayOrders: todaySales.orders,
          thisMonthSales: thisMonthSales.sales,
          thisMonthCost: thisMonthSales.cost,
          thisMonthProfit: thisMonthSales.profit,
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
