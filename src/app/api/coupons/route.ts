import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { coupons } from "@/db/schema";
import { eq, and, gte } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { code, cartTotal } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "الكود مطلوب" }, { status: 400 });
    }

    const result = await db
      .select()
      .from(coupons)
      .where(
        and(
          eq(coupons.code, code.toUpperCase()),
          eq(coupons.active, true)
        )
      )
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json({ error: "كوبون الخصم غير صالح" }, { status: 404 });
    }

    const coupon = result[0];

    // Check expiry
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ error: "انتهت صلاحية هذا الكوبون" }, { status: 400 });
    }

    // Check minimum order amount
    if (coupon.minOrderAmount && cartTotal < parseFloat(coupon.minOrderAmount)) {
      return NextResponse.json({
        error: `الحد الأدنى للطلب ${coupon.minOrderAmount} ج.م`,
      }, { status: 400 });
    }

    return NextResponse.json({
      valid: true,
      discountPercent: coupon.discountPercent,
      code: coupon.code,
    });
  } catch (error) {
    console.error("Error validating coupon:", error);
    return NextResponse.json({ error: "Failed to validate coupon" }, { status: 500 });
  }
}
