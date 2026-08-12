import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { verifyToken, getUserById } from "@/lib/auth";

async function checkAdmin(request: NextRequest) {
  const token = request.cookies.get("hm_token")?.value;
  if (!token) return null;
  const userId = verifyToken(token);
  if (!userId) return null;
  const user = await getUserById(userId);
  if (!user || user.role !== "admin") return null;
  return user;
}

// GET all customers
export async function GET(request: NextRequest) {
  const admin = await checkAdmin(request);
  if (!admin) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const result = await db.select({
    id: users.id, name: users.name, email: users.email,
    phone: users.phone, role: users.role, active: users.active,
    createdAt: users.createdAt,
  }).from(users).orderBy(desc(users.createdAt));
  return NextResponse.json(result);
}
