import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { verifyToken } from "@/lib/auth";

// GET orders for current user
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("hm_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "غير مسجل الدخول" }, { status: 401 });
    }

    const userId = verifyToken(token);
    if (!userId) {
      return NextResponse.json({ error: "جلسة غير صالحة" }, { status: 401 });
    }

    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));

    const ordersWithItems = await Promise.all(
      userOrders.map(async (order) => {
        const items = await db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id));
        return { ...order, items };
      })
    );

    return NextResponse.json(ordersWithItems);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// POST create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      shippingName,
      shippingPhone,
      shippingAddress,
      shippingCity,
      shippingGovernorate,
      subtotal,
      shippingCost,
      discountPercent,
      discountAmount,
      total,
      paymentMethod,
      couponCode,
      items,
      userId,
    } = body;

    if (!shippingName || !shippingPhone || !shippingAddress || !shippingGovernorate) {
      return NextResponse.json({ error: "بيانات الشحن غير مكتملة" }, { status: 400 });
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "السلة فارغة" }, { status: 400 });
    }

    // Generate order number
    const now = new Date();
    const dateStr = now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, "0") +
      now.getDate().toString().padStart(2, "0");
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderNumber = `HM-${dateStr}-${rand}`;

    // Create order
    const newOrder = await db
      .insert(orders)
      .values({
        orderNumber,
        userId: userId || null,
        shippingName: String(shippingName),
        shippingPhone: String(shippingPhone),
        shippingAddress: String(shippingAddress),
        shippingCity: String(shippingCity || ""),
        shippingGovernorate: String(shippingGovernorate),
        subtotal: String(Number(subtotal)),
        shippingCost: String(Number(shippingCost || 0)),
        discountPercent: Number(discountPercent || 0),
        discountAmount: String(Number(discountAmount || 0)),
        total: String(Number(total)),
        paymentMethod: String(paymentMethod),
        paymentStatus: String(paymentMethod) === "cod" ? "pending" : "pending",
        couponCode: couponCode || null,
        status: "pending",
      })
      .returning();

    const orderId = newOrder[0].id;

    // Create order items
    // Helper: check if a string is a valid UUID
    const isUUID = (s: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);

    const orderItemsData = items.map((item: Record<string, unknown>) => ({
      orderId,
      productId: (item.productId && isUUID(String(item.productId))) ? String(item.productId) : null,
      productName: String(item.name),
      productImage: (item.image as string) || null,
      price: String(Number(item.price)),
      size: (item.size as string) || null,
      color: (item.color as string) || null,
      quantity: Number(item.quantity),
    }));

    await db.insert(orderItems).values(orderItemsData);

    return NextResponse.json({
      order: {
        ...newOrder[0],
        items: orderItemsData,
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "فشل في إنشاء الطلب", details: String(error) },
      { status: 500 }
    );
  }
}
