import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, categories, reviews } from "@/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";

interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  price: string;
  comparePrice: string | null;
  images: string[];
  avgRating: string;
  reviewCount: number;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const result = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        description: products.description,
        material: products.material,
        price: products.price,
        comparePrice: products.comparePrice,
        images: products.images,
        sizes: products.sizes,
        colors: products.colors,
        isBestSeller: products.isBestSeller,
        isNewArrival: products.isNewArrival,
        avgRating: products.avgRating,
        reviewCount: products.reviewCount,
        categoryId: products.categoryId,
        categoryName: categories.name,
        categorySlug: categories.slug,
        createdAt: products.createdAt,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(eq(products.slug, slug), eq(products.active, true)))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const row = result[0];

    // Fetch reviews for this product
    const productReviews = await db
      .select({
        id: reviews.id,
        customerName: reviews.customerName,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
      })
      .from(reviews)
      .where(and(eq(reviews.productId, row.id), eq(reviews.active, true)))
      .orderBy(desc(reviews.createdAt));

    // Fetch related products (same category, different product)
    let related: RelatedProduct[] = [];
    if (row.categoryId) {
      const relatedRows = await db
        .select({
          id: products.id,
          name: products.name,
          slug: products.slug,
          price: products.price,
          comparePrice: products.comparePrice,
          images: products.images,
          avgRating: products.avgRating,
          reviewCount: products.reviewCount,
        })
        .from(products)
        .where(
          and(
            eq(products.categoryId, row.categoryId),
            eq(products.active, true),
            sql`${products.id} != ${row.id}`
          )
        )
        .orderBy(desc(products.isBestSeller))
        .limit(4);

      related = relatedRows.map((r) => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        price: r.price,
        comparePrice: r.comparePrice,
        images: r.images ?? [],
        avgRating: r.avgRating ?? "0",
        reviewCount: r.reviewCount ?? 0,
      }));
    }

    const formatted = {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      material: row.material,
      price: row.price,
      comparePrice: row.comparePrice,
      images: row.images ?? [],
      sizes: row.sizes ?? [],
      colors: row.colors ?? [],
      isBestSeller: row.isBestSeller,
      isNewArrival: row.isNewArrival,
      avgRating: row.avgRating ?? "0",
      reviewCount: row.reviewCount ?? 0,
      category: row.categoryName
        ? { name: row.categoryName, slug: row.categorySlug }
        : null,
      createdAt: row.createdAt,
    };

    return NextResponse.json({
      product: formatted,
      reviews: productReviews,
      related,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
