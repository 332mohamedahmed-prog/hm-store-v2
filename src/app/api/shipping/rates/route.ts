import { NextResponse } from "next/server";
import { db } from "@/db";
import { shippingRates } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET() {
  try {
    const rates = await db
      .select()
      .from(shippingRates)
      .where(eq(shippingRates.active, true))
      .orderBy(asc(shippingRates.governorate));

    return NextResponse.json(rates);
  } catch (error) {
    console.error("Error fetching shipping rates:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
