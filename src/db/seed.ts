import { db } from "@/db";
import { categories, products, users, coupons, shippingRates } from "@/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

const IMG = {
  abayaBlack:   "https://images.pexels.com/photos/13791268/pexels-photo-13791268.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  abayaWhite:   "https://images.pexels.com/photos/32347431/pexels-photo-32347431.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  nightgown:    "https://images.pexels.com/photos/19543039/pexels-photo-19543039.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  lingerie:     "https://images.pexels.com/photos/14192241/pexels-photo-14192241.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  bag:          "https://images.pexels.com/photos/31929486/pexels-photo-31929486.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  kidsDress:    "https://images.pexels.com/photos/8384421/pexels-photo-8384421.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  carpet:       "https://images.pexels.com/photos/35134989/pexels-photo-35134989.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  backpack:     "https://images.pexels.com/photos/8423896/pexels-photo-8423896.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  bikini:       "https://images.pexels.com/photos/30471967/pexels-photo-30471967.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  heroBg:       "https://images.pexels.com/photos/7816722/pexels-photo-7816722.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  categoriesBg: "https://images.pexels.com/photos/8711176/pexels-photo-8711176.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
};

export async function seedAll() {
  console.log("Starting HM store seeding...");

  // 1. Categories
  const categoryData = [
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

  const categoryIds: Record<string, string> = {};

  for (const cat of categoryData) {
    const existing = await db.select({ id: categories.id }).from(categories).where(eq(categories.slug, cat.slug)).limit(1);
    if (existing.length > 0) {
      categoryIds[cat.slug] = existing[0].id;
    } else {
      const result = await db.insert(categories).values({ ...cat, active: true }).returning();
      categoryIds[cat.slug] = result[0].id;
      console.log("  Category: " + cat.name);
    }
  }

  // 2. Products
  const productData = [
    {
      name: "عباية سوداء فاخرة", slug: "abaya-black-luxury",
      description: "عباية سوداء فاخرة من أجود الخامات مع تطريز ذهبي على الأكمام والصدر",
      material: "كريب ياباني", price: "850.00", comparePrice: "1200.00",
      categoryId: categoryIds.abayat, images: [IMG.abayaBlack],
      sizes: ["S", "M", "L", "XL", "XXL"], colors: ["أسود", "بيج", "كحلي"],
      isBestSeller: true, isNewArrival: true,
    },
    {
      name: "عباية بيضاء كلاسيك", slug: "abaya-white-classic",
      description: "عباية بيضاء كلاسيكية بتصميم بسيط وأنيق مناسب لكل المناسبات",
      material: "شيفون", price: "650.00", comparePrice: null,
      categoryId: categoryIds.abayat, images: [IMG.abayaWhite],
      sizes: ["M", "L", "XL"], colors: ["أبيض", "أوف وايت"],
      isBestSeller: false, isNewArrival: true,
    },
    {
      name: "قميص نوم ساتان", slug: "satin-nightgown",
      description: "قميص نوم من الساتان الفاخر بقصة مريحة وتطريز دقيق",
      material: "ساتان", price: "350.00", comparePrice: "450.00",
      categoryId: categoryIds.nightwear, images: [IMG.nightgown],
      sizes: ["S", "M", "L"], colors: ["أسود", "وردي", "بنفسجي"],
      isBestSeller: true, isNewArrival: false,
    },
    {
      name: "حمالة صدر دانتيل", slug: "lace-bra",
      description: "حمالة صدر من الدانتيل الفاخر بتصميم أنيق ودعم مريح",
      material: "دانتيل", price: "180.00", comparePrice: null,
      categoryId: categoryIds.lingerie, images: [IMG.lingerie],
      sizes: ["S", "M", "L", "XL"], colors: ["أسود", "بيج", "أبيض"],
      isBestSeller: true, isNewArrival: true,
    },
    {
      name: "شنطة جلد فاخرة", slug: "luxury-leather-bag",
      description: "شنطة جلد طبيعي بتصميم كلاسيكي وتطريز ذهبي",
      material: "جلد طبيعي", price: "950.00", comparePrice: "1300.00",
      categoryId: categoryIds.bags, images: [IMG.bag],
      sizes: ["متوسط"], colors: ["أسود", "بني"],
      isBestSeller: true, isNewArrival: false,
    },
    {
      name: "فستان بناتي فلور", slug: "girls-floral-dress",
      description: "فستان بناتي بألوان فلورية بهجة وتصميم مريح",
      material: "قطن", price: "220.00", comparePrice: null,
      categoryId: categoryIds.kids, images: [IMG.kidsDress],
      sizes: ["2-3", "4-5", "6-7", "8-9"], colors: ["وردي", "أزرق"],
      isBestSeller: false, isNewArrival: true,
    },
    {
      name: "سجادة إيرانية", slug: "iranian-carpet",
      description: "سجادة إيرانية صناعية بزخرفة إسلامية وألوان دافئة",
      material: "بوليستر", price: "1500.00", comparePrice: "2000.00",
      categoryId: categoryIds.carpets, images: [IMG.carpet],
      sizes: ["200x300", "150x250"], colors: ["أحمر", "بيج"],
      isBestSeller: false, isNewArrival: false,
    },
    {
      name: "حقيبة ظهر مدرسية", slug: "school-backpack-blue",
      description: "حقيبة ظهر مدرسية متينة بتصميم عصري وأقسام متعددة",
      material: "نايلون", price: "180.00", comparePrice: null,
      categoryId: categoryIds["school-bags"], images: [IMG.backpack],
      sizes: ["متوسط"], colors: ["أزرق", "أسود", "وردي"],
      isBestSeller: false, isNewArrival: true,
    },
    {
      name: "مايوه بيكيني", slug: "bikini-set",
      description: "مايوه بيكيني بقطعتين بتصميم عصري وقصة مريحة",
      material: "لايكرا", price: "250.00", comparePrice: null,
      categoryId: categoryIds.swimwear, images: [IMG.bikini],
      sizes: ["S", "M", "L"], colors: ["أسود", "أبيض", "مرسى"],
      isBestSeller: true, isNewArrival: true,
    },
  ];

  for (const p of productData) {
    const existing = await db.select({ id: products.id }).from(products).where(eq(products.slug, p.slug)).limit(1);
    if (existing.length === 0) {
      await db.insert(products).values({
        name: p.name, slug: p.slug, description: p.description,
        material: p.material, price: p.price, comparePrice: p.comparePrice,
        categoryId: p.categoryId, images: p.images, sizes: p.sizes, colors: p.colors,
        isBestSeller: p.isBestSeller, isNewArrival: p.isNewArrival, active: true,
        avgRating: "4.5", reviewCount: 10,
      });
      console.log("  Product: " + p.name);
    }
  }

  // 3. Admin user
  const adminEmail = "admin@hm-store.com";
  const existingAdmin = await db.select({ id: users.id }).from(users).where(eq(users.email, adminEmail)).limit(1);

  const hash = bcrypt.hashSync("admin123", 10);
  if (existingAdmin.length === 0) {
    await db.insert(users).values({
      name: "أدمن", email: adminEmail, phone: "201214871459",
      password: hash, role: "admin", active: true,
    });
    console.log("  Admin user created");
  } else {
    await db.update(users).set({ password: hash, role: "admin" }).where(eq(users.email, adminEmail));
    console.log("  Admin user verified");
  }

  // 4. Coupon
  const existingCoupon = await db.select({ id: coupons.id }).from(coupons).where(eq(coupons.code, "HM20")).limit(1);
  if (existingCoupon.length === 0) {
    await db.insert(coupons).values({
      code: "HM20", discountPercent: 20, minOrderAmount: "200.00", active: true,
    });
    console.log("  Coupon HM20 created");
  }

  // 5. Shipping rates
  const rates = [
    { governorate: "القاهرة", rate: "50.00", freeAbove: "500.00" },
    { governorate: "الجيزة", rate: "50.00", freeAbove: "500.00" },
    { governorate: "الإسكندرية", rate: "60.00", freeAbove: "500.00" },
    { governorate: "الشرقية", rate: "65.00", freeAbove: "600.00" },
    { governorate: "الدقهلية", rate: "65.00", freeAbove: "600.00" },
    { governorate: "البحيرة", rate: "65.00", freeAbove: "600.00" },
    { governorate: "الغربية", rate: "65.00", freeAbove: "600.00" },
    { governorate: "المنوفية", rate: "65.00", freeAbove: "600.00" },
    { governorate: "القليوبية", rate: "60.00", freeAbove: "500.00" },
    { governorate: "الفيوم", rate: "70.00", freeAbove: "700.00" },
    { governorate: "بني سويف", rate: "70.00", freeAbove: "700.00" },
    { governorate: "المنيا", rate: "75.00", freeAbove: "700.00" },
    { governorate: "سوهاج", rate: "80.00", freeAbove: "800.00" },
    { governorate: "أسيوط", rate: "80.00", freeAbove: "800.00" },
    { governorate: "قنا", rate: "80.00", freeAbove: "800.00" },
    { governorate: "الأقصر", rate: "80.00", freeAbove: "800.00" },
    { governorate: "أسوان", rate: "85.00", freeAbove: "800.00" },
    { governorate: "الوادي الجديد", rate: "90.00", freeAbove: "900.00" },
    { governorate: "مطروح", rate: "90.00", freeAbove: "900.00" },
    { governorate: "البحر الأحمر", rate: "95.00", freeAbove: "900.00" },
    { governorate: "بورسعيد", rate: "60.00", freeAbove: "500.00" },
    { governorate: "السويس", rate: "60.00", freeAbove: "500.00" },
    { governorate: "الإسماعيلية", rate: "60.00", freeAbove: "500.00" },
    { governorate: "دمياط", rate: "65.00", freeAbove: "600.00" },
    { governorate: "كفر الشيخ", rate: "65.00", freeAbove: "600.00" },
    { governorate: "شمال سيناء", rate: "95.00", freeAbove: "900.00" },
    { governorate: "جنوب سيناء", rate: "95.00", freeAbove: "900.00" },
  ];

  for (const r of rates) {
    const existing = await db.select({ id: shippingRates.id }).from(shippingRates).where(eq(shippingRates.governorate, r.governorate)).limit(1);
    if (existing.length === 0) {
      await db.insert(shippingRates).values({ ...r, active: true });
    }
  }
  console.log("  Shipping rates: " + rates.length + " governorates");

  console.log("Seeding complete!");
}

seedAll().catch(console.error);
