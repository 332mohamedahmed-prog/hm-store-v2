import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { coupons } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyToken, getUserById } from "@/lib/auth";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.cookies.get("hm_token")?.value;
  if (!token) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ error: "جلسة غير صالحة" }, { status: 401 });
  const user = await getUserById(userId);
  if (!user || user.role !== "admin") return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const { id } = await params;
  const body = await request.json();
  const result = await db.update(coupons).set(body).where(eq(coupons.id, id)).returning();
  return NextResponse.json(result[0]);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.cookies.get("hm_token")?.value;
  if (!token) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ error: "جلسة غير صالحة" }, { status: 401 });
  const user = await getUserById(userId);
  if (!user || user.role !== "admin") return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const { id } = await params;
  await db.delete(coupons).where(eq(coupons.id, id));
  return NextResponse.json({ ok: true });
}
