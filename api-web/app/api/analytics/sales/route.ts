import { NextRequest, NextResponse } from 'next/server';
import { getApiUser } from '@/lib/api-session';
import { prisma } from '@/lib/prisma';
import { UserRole, OrderStatus } from '@/lib/enums';
import { createErrorResponse, ErrorCodes, handleApiError } from '@/lib/error-handler';

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
      return createErrorResponse(ErrorCodes.FORBIDDEN, 'Admin access required', undefined, 403);
    }

    // Define date ranges
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    // Use Prisma aggregations for summary data - much more efficient than fetching all records
    const [summaryAggregation, last30DaysOrders, last12MonthsOrders, allTimeOrders] =
      await Promise.all([
        // Summary: aggregate all delivered orders
        prisma.order.aggregate({
          where: { status: OrderStatus.DELIVERED },
          _sum: { total: true },
          _count: { id: true },
        }),
        // Last 30 days: fetch orders for daily breakdown
        prisma.order.findMany({
          where: {
            status: OrderStatus.DELIVERED,
            createdAt: { gte: thirtyDaysAgo },
          },
          select: {
            id: true,
            total: true,
            createdAt: true,
            items: {
              select: {
                quantity: true,
                price: true,
                product: { select: { costPrice: true } },
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        }),
        // Last 12 months: fetch orders for monthly breakdown
        prisma.order.findMany({
          where: {
            status: OrderStatus.DELIVERED,
            createdAt: { gte: twelveMonthsAgo },
          },
          select: {
            id: true,
            total: true,
            createdAt: true,
            items: {
              select: {
                quantity: true,
                price: true,
                product: { select: { costPrice: true } },
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        }),
        // All time: fetch all orders for yearly breakdown (only if needed)
        prisma.order.findMany({
          where: { status: OrderStatus.DELIVERED },
          select: {
            id: true,
            total: true,
            createdAt: true,
            items: {
              select: {
                quantity: true,
                price: true,
                product: { select: { costPrice: true } },
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        }),
      ]);

    // Helper function to calculate order cost and profit
    const calculateOrderMetrics = (order: {
      total: number | string;
      items: Array<{
        quantity: number;
        price: number | string;
        product: { costPrice: number | string | null };
      }>;
    }) => {
      const totalCost = order.items.reduce((sum, item) => {
        const costPrice = item.product.costPrice ? Number(item.product.costPrice) : 0;
        return sum + costPrice * item.quantity;
      }, 0);

      const revenue = Number(order.total);
      const profit = revenue - totalCost;

      return { cost: totalCost, revenue, profit };
    };

    // Calculate daily sales (last 30 days)
    const dailySales = last30DaysOrders.reduce(
      (acc, order) => {
        const date = new Date(order.createdAt).toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = { date, sales: 0, orders: 0, cost: 0, profit: 0 };
        }
        const { cost, revenue, profit } = calculateOrderMetrics(order);
        acc[date].sales += revenue;
        acc[date].cost += cost;
        acc[date].profit += profit;
        acc[date].orders += 1;
        return acc;
      },
      {} as Record<
        string,
        { date: string; sales: number; orders: number; cost: number; profit: number }
      >
    );

    // Calculate monthly sales (last 12 months)
    const monthlySales = last12MonthsOrders.reduce(
      (acc, order) => {
        const date = new Date(order.createdAt);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!acc[monthKey]) {
          acc[monthKey] = { month: monthKey, sales: 0, orders: 0, cost: 0, profit: 0 };
        }
        const { cost, revenue, profit } = calculateOrderMetrics(order);
        acc[monthKey].sales += revenue;
        acc[monthKey].cost += cost;
        acc[monthKey].profit += profit;
        acc[monthKey].orders += 1;
        return acc;
      },
      {} as Record<
        string,
        { month: string; sales: number; orders: number; cost: number; profit: number }
      >
    );

    // Calculate yearly sales
    const yearlySales = allTimeOrders.reduce(
      (acc, order) => {
        const year = new Date(order.createdAt).getFullYear().toString();
        if (!acc[year]) {
          acc[year] = { year, sales: 0, orders: 0, cost: 0, profit: 0 };
        }
        const { cost, revenue, profit } = calculateOrderMetrics(order);
        acc[year].sales += revenue;
        acc[year].cost += cost;
        acc[year].profit += profit;
        acc[year].orders += 1;
        return acc;
      },
      {} as Record<
        string,
        { year: string; sales: number; orders: number; cost: number; profit: number }
      >
    );

    // Calculate summary statistics - use aggregation for total sales
    const totalSales = Number(summaryAggregation._sum.total) || 0;
    const totalOrders = summaryAggregation._count.id;

    // For cost and profit, we need to calculate from all orders (no way to aggregate this in SQL)
    let totalCost = 0;
    let totalProfit = 0;
    for (const order of allTimeOrders) {
      const { cost, profit } = calculateOrderMetrics(order);
      totalCost += cost;
      totalProfit += profit;
    }

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
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
