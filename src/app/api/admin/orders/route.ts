import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems, users } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { verifyToken, getUserById } from "@/lib/auth";

async function checkAdmin(request: NextRequest) {
  const token = request.cookies.get("hm_token")?.value;
  if (!token) return null;
  const userId = verifyToken(token);
  if (!userId) return null;
  const user = await getUserById(userId);
  if (!user || user.role !== "admin") return null;
  return user;
}

// GET all orders
export async function GET(request: NextRequest) {
  const admin = await checkAdmin(request);
  if (!admin) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
  const withItems = await Promise.all(allOrders.map(async (o) => {
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, o.id));
    return { ...o, items };
  }));
  return NextResponse.json(withItems);
}
