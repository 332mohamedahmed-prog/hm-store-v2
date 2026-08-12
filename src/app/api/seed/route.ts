import { NextResponse } from "next/server";
import { seedAll } from "@/db/seed";

export async function POST() {
  try {
    await seedAll();
    return NextResponse.json({ message: "Store seeded successfully" });
  } catch (error) {
    console.error("Error seeding:", error);
    return NextResponse.json(
      { error: "Failed to seed store" },
      { status: 500 }
    );
  }
}
