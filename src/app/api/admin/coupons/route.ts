import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { coupons } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
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

export async function GET(request: NextRequest) {
  const admin = await checkAdmin(request);
  if (!admin) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const result = await db.select().from(coupons).orderBy(desc(coupons.createdAt));
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const admin = await checkAdmin(request);
  if (!admin) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const body = await request.json();
  const { code, discountPercent, minOrderAmount, expiresAt } = body;
  if (!code || !discountPercent) return NextResponse.json({ error: "الكود ونسبة الخصم مطلوبان" }, { status: 400 });
  const result = await db.insert(coupons).values({
    code: code.toUpperCase(), discountPercent: Number(discountPercent),
    minOrderAmount: minOrderAmount ? String(minOrderAmount) : "0",
    expiresAt: expiresAt ? new Date(expiresAt) : null, active: true,
  }).returning();
  return NextResponse.json(result[0], { status: 201 });
}
