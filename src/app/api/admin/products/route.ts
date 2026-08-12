import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq, desc, asc, and, sql } from "drizzle-orm";
import { verifyToken } from "@/lib/auth";

async function checkAdmin(request: NextRequest) {
  const token = request.cookies.get("hm_token")?.value;
  if (!token) return null;
  const userId = verifyToken(token);
  if (!userId) return null;
  const { getUserById } = await import("@/lib/auth");
  const user = await getUserById(userId);
  if (!user || user.role !== "admin") return null;
  return user;
}

// GET all products (admin sees inactive too)
export async function GET(request: NextRequest) {
  const admin = await checkAdmin(request);
  if (!admin) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const result = await db
    .select({
      id: products.id, name: products.name, slug: products.slug,
      price: products.price, comparePrice: products.comparePrice,
      images: products.images, sizes: products.sizes, colors: products.colors,
      material: products.material, isBestSeller: products.isBestSeller,
      isNewArrival: products.isNewArrival, active: products.active,
      categoryId: products.categoryId, categoryName: categories.name,
      createdAt: products.createdAt,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(desc(products.createdAt));

  return NextResponse.json(result);
}

// POST create product
export async function POST(request: NextRequest) {
  const admin = await checkAdmin(request);
  if (!admin) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const body = await request.json();
  const { name, description, material, price, comparePrice, categoryId, images, sizes, colors, isBestSeller, isNewArrival, active } = body;

  if (!name || !price) return NextResponse.json({ error: "الاسم والسعر مطلوبان" }, { status: 400 });

  const slug = name.toLowerCase().replace(/[^\u0621-\u064Aa-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-") + "-" + Math.random().toString(36).substring(2, 6);

  const result = await db.insert(products).values({
    name, slug, description: description || null, material: material || null,
    price: String(price), comparePrice: comparePrice ? String(comparePrice) : null,
    categoryId: categoryId || null,
    images: images || [], sizes: sizes || [], colors: colors || [],
    isBestSeller: !!isBestSeller, isNewArrival: !!isNewArrival, active: active !== false,
  }).returning();

  return NextResponse.json(result[0], { status: 201 });
}
