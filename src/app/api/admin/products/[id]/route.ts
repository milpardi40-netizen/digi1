import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
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
  const productId = Number(id);
  if (!Number.isFinite(productId)) {
    return NextResponse.json({ error: "شناسه نامعتبر" }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const updates: Partial<typeof products.$inferInsert> = {};
  if (body.isFeatured !== undefined) updates.isFeatured = Boolean(body.isFeatured);

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "تغییری ارسال نشده" }, { status: 400 });
  }

  const result = await db.update(products).set(updates).where(eq(products.id, productId)).returning({ id: products.id });
  if (result.length === 0) {
    return NextResponse.json({ error: "اثر یافت نشد" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "دسترسی فقط برای مدیر" }, { status: 403 });

  const { id } = await params;
  const productId = Number(id);
  if (!Number.isFinite(productId)) {
    return NextResponse.json({ error: "شناسه نامعتبر" }, { status: 400 });
  }

  const result = await db.delete(products).where(eq(products.id, productId)).returning({ id: products.id });
  if (result.length === 0) {
    return NextResponse.json({ error: "اثر یافت نشد" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
