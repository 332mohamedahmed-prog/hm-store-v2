import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyToken, getUserById } from "@/lib/auth";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.cookies.get("hm_token")?.value;
  if (!token) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ error: "جلسة غير صالحة" }, { status: 401 });
  const user = await getUserById(userId);
  if (!user || user.role !== "admin") return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const { id } = await params;
  // Prevent deleting self
  if (id === userId) return NextResponse.json({ error: "لا يمكنك حذف حسابك" }, { status: 400 });
  await db.delete(users).where(eq(users.id, id));
  return NextResponse.json({ ok: true });
}
