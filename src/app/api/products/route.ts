import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq, and, or, asc, desc, gte, lte, like, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category");
    const isBestSeller = searchParams.get("bestSeller") === "true";
    const isNewArrival = searchParams.get("newArrival") === "true";
    const sort = searchParams.get("sort") || "newest";
    const search = searchParams.get("search") || "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sizeFilter = searchParams.get("size");
    const colorFilter = searchParams.get("color");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const conditions = [eq(products.active, true)];

    if (isBestSeller) conditions.push(eq(products.isBestSeller, true));
    if (isNewArrival) conditions.push(eq(products.isNewArrival, true));

    // Category filter
    if (categorySlug) {
      const categoryRows = await db
        .select({ id: categories.id })
        .from(categories)
        .where(eq(categories.slug, categorySlug))
        .limit(1);
      if (categoryRows.length > 0) {
        conditions.push(eq(products.categoryId, categoryRows[0].id));
      }
    }

    // Search by name
    if (search.trim()) {
      conditions.push(sql`LOWER(${products.name}) LIKE LOWER(${`%${search.trim()}%`})`);
    }

    // Price range filter (using SQL for numeric comparison on text column)
    if (minPrice) {
      conditions.push(sql`CAST(${products.price} AS NUMERIC) >= ${parseFloat(minPrice)}`);
    }
    if (maxPrice) {
      conditions.push(sql`CAST(${products.price} AS NUMERIC) <= ${parseFloat(maxPrice)}`);
    }

    // Size filter (JSONB contains)
    if (sizeFilter) {
      conditions.push(sql`${products.sizes} @> ${JSON.stringify([sizeFilter])}::jsonb`);
    }

    // Color filter (JSONB contains)
    if (colorFilter) {
      conditions.push(sql`${products.colors} @> ${JSON.stringify([colorFilter])}::jsonb`);
    }

    // Determine sort order
    let orderBy;
    switch (sort) {
      case "price-asc":
        orderBy = asc(sql`CAST(${products.price} AS NUMERIC)`);
        break;
      case "price-desc":
        orderBy = desc(sql`CAST(${products.price} AS NUMERIC)`);
        break;
      case "best-seller":
        orderBy = desc(products.isBestSeller);
        break;
      case "new-arrival":
        orderBy = desc(products.isNewArrival);
        break;
      case "newest":
      default:
        orderBy = desc(products.createdAt);
        break;
    }

    const result = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        price: products.price,
        comparePrice: products.comparePrice,
        images: products.images,
        sizes: products.sizes,
        colors: products.colors,
        material: products.material,
        isBestSeller: products.isBestSeller,
        isNewArrival: products.isNewArrival,
        avgRating: products.avgRating,
        reviewCount: products.reviewCount,
        categoryId: products.categoryId,
        categoryName: categories.name,
        categorySlug: categories.slug,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(...conditions))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(and(...conditions));

    const formatted = result.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      price: row.price,
      comparePrice: row.comparePrice,
      images: row.images ?? [],
      sizes: row.sizes ?? [],
      colors: row.colors ?? [],
      material: row.material,
      isBestSeller: row.isBestSeller,
      isNewArrival: row.isNewArrival,
      avgRating: row.avgRating ?? "0",
      reviewCount: row.reviewCount ?? 0,
      category: row.categoryName
        ? { name: row.categoryName, slug: row.categorySlug }
        : null,
    }));

    return NextResponse.json({
      products: formatted,
      total: Number(countResult[0]?.count ?? 0),
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
