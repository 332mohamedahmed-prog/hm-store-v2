import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { eq, and, asc, desc } from "drizzle-orm";
import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import ProductsSection from "@/components/home/ProductsSection";
import WhyChooseUsSection from "@/components/home/WhyChooseUsSection";

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  price: string;
  comparePrice: string | null;
  images: string[] | null;
  isBestSeller: boolean | null;
  isNewArrival: boolean | null;
  categoryName: string | null;
  categorySlug: string | null;
}

function formatProduct(row: ProductRow) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    price: row.price,
    comparePrice: row.comparePrice,
    images: row.images ?? [],
    category: row.categoryName
      ? { name: row.categoryName, slug: row.categorySlug! }
      : null,
  };
}

export default async function HomePage() {
  // Fetch categories from DB
  let dbCategories: { id: string; name: string; slug: string }[] = [];
  try {
    dbCategories = await db
      .select({ id: categories.id, name: categories.name, slug: categories.slug })
      .from(categories)
      .where(eq(categories.active, true))
      .orderBy(asc(categories.sortOrder));
  } catch {
    // Table might not exist yet — will be seeded after first push
  }

  // Fetch best sellers
  let bestSellers: ReturnType<typeof formatProduct>[] = [];
  try {
    const rows = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        price: products.price,
        comparePrice: products.comparePrice,
        images: products.images,
        isBestSeller: products.isBestSeller,
        isNewArrival: products.isNewArrival,
        categoryName: categories.name,
        categorySlug: categories.slug,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(eq(products.active, true), eq(products.isBestSeller, true)))
      .orderBy(desc(products.createdAt))
      .limit(8);

    bestSellers = rows.map(formatProduct);
  } catch {
    // Table might not exist yet
  }

  // Fetch new arrivals
  let newArrivals: ReturnType<typeof formatProduct>[] = [];
  try {
    const rows = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        price: products.price,
        comparePrice: products.comparePrice,
        images: products.images,
        isBestSeller: products.isBestSeller,
        isNewArrival: products.isNewArrival,
        categoryName: categories.name,
        categorySlug: categories.slug,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(eq(products.active, true), eq(products.isNewArrival, true)))
      .orderBy(desc(products.createdAt))
      .limit(8);

    newArrivals = rows.map(formatProduct);
  } catch {
    // Table might not exist yet
  }

  return (
    <main>
      <HeroSection />
      <CategoriesSection categories={dbCategories} />
      <ProductsSection
        title="الأكثر مبيعاً"
        subtitle="الأكثر طلباً"
        products={bestSellers}
        viewAllHref="/products?sort=best-seller"
      />
      <ProductsSection
        title="وصل حديثاً"
        subtitle="جديد هذا الأسبوع"
        products={newArrivals}
        viewAllHref="/products?sort=new-arrival"
      />
      <WhyChooseUsSection />
    </main>
  );
}
