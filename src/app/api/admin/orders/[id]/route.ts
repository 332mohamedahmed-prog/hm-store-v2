import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq } from "drizzle-orm";
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

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await checkAdmin(request);
  if (!admin) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const { id } = await params;
  const order = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (!order.length) return NextResponse.json({ error: "غير موجود" }, { status: 404 });
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
  return NextResponse.json({ ...order[0], items });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await checkAdmin(request);
  if (!admin) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const { id } = await params;
  const body = await request.json();

  const updateData: Record<string, unknown> = { updatedAt: new Date() };
  if (body.status) updateData.status = body.status;
  if (body.paymentStatus) updateData.paymentStatus = body.paymentStatus;
  if (body.notes !== undefined) updateData.notes = body.notes;

  const result = await db.update(orders).set(updateData).where(eq(orders.id, id)).returning();
  return NextResponse.json(result[0]);
}
