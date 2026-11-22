import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { payoutRequests } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/marketplace";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "دسترسی فقط برای مدیر" }, { status: 403 });

  const { id } = await params;
  const payoutId = Number(id);
  if (!Number.isFinite(payoutId)) {
    return NextResponse.json({ error: "شناسه نامعتبر" }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  if (body.status !== "paid") {
    return NextResponse.json({ error: "فقط علامت‌گذاری «پرداخت شد» مجاز است" }, { status: 400 });
  }

  const result = await db
    .update(payoutRequests)
    .set({ status: "paid", paidAt: new Date() })
    .where(eq(payoutRequests.id, payoutId))
    .returning({ id: payoutRequests.id });

  if (result.length === 0) {
    return NextResponse.json({ error: "درخواست تسویه یافت نشد" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
