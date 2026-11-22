import { NextResponse } from "next/server";
import { db } from "@/db";
import { payoutRequests } from "@/db/schema";
import { requireSeller } from "@/lib/require-seller";
import { getShopStats } from "@/lib/marketplace";

export const dynamic = "force-dynamic";

/** ثبت درخواست تسویه برای کل مانده قابل برداشت */
export async function POST() {
  const ctx = await requireSeller();
  if ("error" in ctx) return ctx.error;
  const { shop } = ctx;

  const stats = await getShopStats(shop.id);
  const amount = stats.availableForPayout;

  if (amount <= 0) {
    return NextResponse.json(
      { error: "مانده قابل تسویه‌ای ندارید (سفارش‌ها باید تحویل داده شده و تسویه‌های قبلی کسر می‌شود)" },
      { status: 400 }
    );
  }

  const [created] = await db
    .insert(payoutRequests)
    .values({ shopId: shop.id, amount, status: "pending" })
    .returning();

  return NextResponse.json({ ok: true, payout: created });
}
