import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
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
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  if (!result.length) return NextResponse.json({ error: "غير موجود" }, { status: 404 });
  return NextResponse.json(result[0]);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await checkAdmin(request);
  if (!admin) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const { id } = await params;
  const body = await request.json();

  const updateData: Record<string, unknown> = { updatedAt: new Date() };
  const allowedFields = ["name","description","material","price","comparePrice","categoryId","images","sizes","colors","isBestSeller","isNewArrival","active"];
  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      if (field === "price" || field === "comparePrice") {
        updateData[field] = body[field] ? String(body[field]) : null;
      } else {
        updateData[field] = body[field];
      }
    }
  }

  if (body.name) {
    updateData.slug = body.name.toLowerCase().replace(/[^\u0621-\u064Aa-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-") + "-" + Math.random().toString(36).substring(2, 6);
  }

  const result = await db.update(products).set(updateData).where(eq(products.id, id)).returning();
  if (!result.length) return NextResponse.json({ error: "غير موجود" }, { status: 404 });
  return NextResponse.json(result[0]);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await checkAdmin(request);
  if (!admin) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const { id } = await params;
  await db.delete(products).where(eq(products.id, id));
  return NextResponse.json({ ok: true });
}
