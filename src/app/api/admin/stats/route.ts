import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, products, users, orderItems } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { verifyToken, getUserById } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("hm_token")?.value;
  if (!token) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ error: "جلسة غير صالحة" }, { status: 401 });
  const user = await getUserById(userId);
  if (!user || user.role !== "admin") return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  // Total revenue
  const revenueResult = await db.select({ total: sql<string>`COALESCE(SUM(CAST(${orders.total} AS NUMERIC)), 0)` }).from(orders);
  const totalRevenue = parseFloat(revenueResult[0]?.total || "0");

  // Order counts by status
  const orderCounts = await db.select({
    status: orders.status,
    count: sql<number>`count(*)`,
  }).from(orders).groupBy(orders.status);

  // Total orders
  const totalOrders = orderCounts.reduce((sum, o) => sum + o.count, 0);

  // Total customers
  const customerCount = await db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.role, "customer"));

  // Total products
  const productCount = await db.select({ count: sql<number>`count(*)` }).from(products);

  // Recent orders
  const recentOrders = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(5);

  // Best selling products
  const bestSellers = await db.select({
    name: orderItems.productName,
    totalSold: sql<number>`SUM(${orderItems.quantity})`,
    revenue: sql<string>`SUM(CAST(${orderItems.price} AS NUMERIC) * ${orderItems.quantity})`,
  }).from(orderItems).groupBy(orderItems.productName).orderBy(desc(sql`SUM(${orderItems.quantity})`)).limit(5);

  return NextResponse.json({
    totalRevenue,
    totalOrders,
    orderCounts,
    totalCustomers: customerCount[0]?.count || 0,
    totalProducts: productCount[0]?.count || 0,
    recentOrders,
    bestSellers,
  });
}
