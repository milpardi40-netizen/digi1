import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orderItems } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { requireSeller } from "@/lib/require-seller";

export const dynamic = "force-dynamic";

/** علامت‌گذاری قلم سفارش به «ارسال شد» توسط فروشنده */
export async function POST(request: NextRequest) {
  const ctx = await requireSeller();
  if ("error" in ctx) return ctx.error;
  const { shop } = ctx;

  const body = await request.json().catch(() => ({}));
  const itemId = Number(body.itemId);
  if (!Number.isFinite(itemId)) {
    return NextResponse.json({ error: "شناسه قلم نامعتبر" }, { status: 400 });
  }

  const result = await db
    .update(orderItems)
    .set({ sellerStatus: "shipped" })
    .where(and(eq(orderItems.id, itemId), eq(orderItems.shopId, shop.id)))
    .returning({ id: orderItems.id });

  if (result.length === 0) {
    return NextResponse.json({ error: "این قلم متعلق به فروشگاه شما نیست" }, { status: 403 });
  }
  return NextResponse.json({ ok: true });
}
