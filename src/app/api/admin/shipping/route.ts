import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { shippingRates } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
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
  const result = await db.select().from(shippingRates).orderBy(asc(shippingRates.governorate));
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const admin = await checkAdmin(request);
  if (!admin) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const body = await request.json();
  const { governorate, rate, freeAbove } = body;
  if (!governorate || !rate) return NextResponse.json({ error: "المحافظة والسعر مطلوبان" }, { status: 400 });
  const result = await db.insert(shippingRates).values({
    governorate, rate: String(rate), freeAbove: freeAbove ? String(freeAbove) : null, active: true,
  }).returning();
  return NextResponse.json(result[0], { status: 201 });
}
