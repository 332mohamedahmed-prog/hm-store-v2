import { NextRequest, NextResponse } from "next/server";
import { verifyToken, updateUser } from "@/lib/auth";

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("hm_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "غير مسجل الدخول" }, { status: 401 });
    }

    const userId = verifyToken(token);
    if (!userId) {
      return NextResponse.json({ error: "جلسة غير صالحة" }, { status: 401 });
    }

    const data = await request.json();
    const updated = await updateUser(userId, {
      name: data.name,
      phone: data.phone,
      address: data.address,
      city: data.city,
      governorate: data.governorate,
    });

    return NextResponse.json({
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        address: updated.address,
        city: updated.city,
        governorate: updated.governorate,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
