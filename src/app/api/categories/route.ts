import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET() {
  try {
    const allCategories = await db
      .select()
      .from(categories)
      .where(eq(categories.active, true))
      .orderBy(asc(categories.sortOrder));
    return NextResponse.json(allCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, slug, description, sortOrder } = await request.json();
    if (!name || !slug) {
      return NextResponse.json({ error: "الاسم والـ slug مطلوبان" }, { status: 400 });
    }
    const result = await db.insert(categories).values({
      name,
      slug,
      description: description || null,
      sortOrder: sortOrder || 0,
      active: true,
    }).returning();
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ error: "فشل في إنشاء التصنيف" }, { status: 500 });
  }
}
