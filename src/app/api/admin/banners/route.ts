import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { banners } from "@/db/schema";
import { eq, desc, asc } from "drizzle-orm";
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
  const result = await db.select().from(banners).orderBy(asc(banners.sortOrder));
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const admin = await checkAdmin(request);
  if (!admin) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const body = await request.json();
  const { title, subtitle, image, link, sortOrder } = body;
  if (!title) return NextResponse.json({ error: "العنوان مطلوب" }, { status: 400 });
  const result = await db.insert(banners).values({
    title, subtitle: subtitle || null, image: image || null,
    link: link || null, sortOrder: sortOrder || 0, active: true,
  }).returning();
  return NextResponse.json(result[0], { status: 201 });
}
