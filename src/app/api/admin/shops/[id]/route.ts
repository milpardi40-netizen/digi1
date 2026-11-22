import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { shops } from "@/db/schema";
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
  const shopId = Number(id);
  if (!Number.isFinite(shopId)) {
    return NextResponse.json({ error: "شناسه نامعتبر" }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const updates: Partial<typeof shops.$inferInsert> = {};

  if (body.verified !== undefined) updates.verified = Boolean(body.verified);
  if (body.commissionPercent !== undefined) {
    const v = body.commissionPercent;
    if (v === null) {
      updates.commissionPercent = null;
    } else {
      const n = Number(v);
      if (!Number.isFinite(n) || n < 0 || n > 90) {
        return NextResponse.json({ error: "کمیسیون اختصاصی باید بین ۰ تا ۹۰ باشد" }, { status: 400 });
      }
      updates.commissionPercent = Math.round(n);
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "تغییری ارسال نشده" }, { status: 400 });
  }

  const result = await db.update(shops).set(updates).where(eq(shops.id, shopId)).returning({ id: shops.id });
  if (result.length === 0) {
    return NextResponse.json({ error: "فروشگاه یافت نشد" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
