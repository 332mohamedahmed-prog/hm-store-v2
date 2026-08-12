import { NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";

const seedCategories = [
  { name: "عبايات", slug: "abayat", sortOrder: 1 },
  { name: "هدوم داخلية", slug: "lingerie", sortOrder: 2 },
  { name: "قمصان نوم", slug: "nightwear", sortOrder: 3 },
  { name: "شنط", slug: "bags", sortOrder: 4 },
  { name: "هدوم أطفال", slug: "kids", sortOrder: 5 },
  { name: "سجاد", slug: "carpets", sortOrder: 6 },
  { name: "شنط مدارس", slug: "school-bags", sortOrder: 7 },
  { name: "ملابس مدارس", slug: "school-wear", sortOrder: 8 },
  { name: "مايوهات", slug: "swimwear", sortOrder: 9 },
];

export async function POST() {
  try {
    let created = 0;
    let skipped = 0;

    for (const cat of seedCategories) {
      const existing = await db
        .select({ id: categories.id })
        .from(categories)
        .where(eq(categories.slug, cat.slug))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(categories).values({
          name: cat.name,
          slug: cat.slug,
          sortOrder: cat.sortOrder,
          active: true,
        });
        created++;
      } else {
        skipped++;
      }
    }

    return NextResponse.json({
      message: "Categories seeded successfully",
      created,
      skipped,
    });
  } catch (error) {
    console.error("Error seeding categories:", error);
    return NextResponse.json(
      { error: "Failed to seed categories" },
      { status: 500 }
    );
  }
}
