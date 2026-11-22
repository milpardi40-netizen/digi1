import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/marketplace";

export const dynamic = "force-dynamic";

const ALLOWED = new Set(["processing", "shipped", "delivered", "cancelled"]);

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "دسترسی فقط برای مدیر" }, { status: 403 });

  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isFinite(orderId)) {
    return NextResponse.json({ error: "شناسه نامعتبر" }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const status = String(body.status ?? "");
  if (!ALLOWED.has(status)) {
    return NextResponse.json({ error: "وضعیت نامعتبر است" }, { status: 400 });
  }

  const result = await db.update(orders).set({ status }).where(eq(orders.id, orderId)).returning({ id: orders.id });
  if (result.length === 0) {
    return NextResponse.json({ error: "سفارش یافت نشد" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
