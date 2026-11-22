import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { requireSeller } from "@/lib/require-seller";

export const dynamic = "force-dynamic";

/** ویرایش اثر (فقط آثار خود فروشنده) */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctx = await requireSeller();
  if ("error" in ctx) return ctx.error;
  const { shop } = ctx;

  const { id } = await params;
  const productId = Number(id);
  if (!Number.isFinite(productId)) {
    return NextResponse.json({ error: "شناسه نامعتبر" }, { status: 400 });
  }

  const [owned] = await db
    .select()
    .from(products)
    .where(and(eq(products.id, productId), eq(products.shopId, shop.id)))
    .limit(1);
  if (!owned) {
    return NextResponse.json({ error: "این اثر متعلق به شما نیست" }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const updates: Partial<typeof products.$inferInsert> = {};

  if (body.name !== undefined) {
    const name = String(body.name).trim();
    if (name.length < 5) return NextResponse.json({ error: "نام اثر خیلی کوتاه است" }, { status: 400 });
    updates.name = name;
  }
  if (body.description !== undefined) updates.description = String(body.description).trim();
  if (body.image !== undefined) {
    const image = String(body.image).trim();
    if (!image.startsWith("http")) return NextResponse.json({ error: "آدرس تصویر نامعتبر" }, { status: 400 });
    updates.image = image;
  }
  if (body.categoryId !== undefined) {
    const cid = Number(body.categoryId);
    updates.categoryId = Number.isFinite(cid) && cid > 0 ? cid : null;
  }
  if (body.price !== undefined) {
    const price = Math.max(0, Math.floor(Number(body.price) || 0));
    if (price <= 0) return NextResponse.json({ error: "قیمت نامعتبر" }, { status: 400 });
    updates.price = price;
    updates.originalPrice = Math.max(price, Math.floor(Number(body.originalPrice) || price));
  } else if (body.originalPrice !== undefined) {
    updates.originalPrice = Math.max(owned.price, Math.floor(Number(body.originalPrice) || owned.originalPrice));
  }
  if (body.stock !== undefined) updates.stock = Math.max(0, Math.floor(Number(body.stock) || 0));
  if (body.specs !== undefined && typeof body.specs === "object" && body.specs) {
    const cleanSpecs: Record<string, string> = {};
    for (const [k, v] of Object.entries(body.specs as Record<string, unknown>)) {
      const key = String(k).trim().slice(0, 60);
      const value = String(v).trim().slice(0, 200);
      if (key && value) cleanSpecs[key] = value;
    }
    updates.specs = cleanSpecs;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "تغییری ارسال نشده است" }, { status: 400 });
  }

  await db.update(products).set(updates).where(eq(products.id, productId));
  return NextResponse.json({ ok: true });
}

/** حذف اثر فروشنده */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctx = await requireSeller();
  if ("error" in ctx) return ctx.error;
  const { shop } = ctx;

  const { id } = await params;
  const productId = Number(id);
  if (!Number.isFinite(productId)) {
    return NextResponse.json({ error: "شناسه نامعتبر" }, { status: 400 });
  }

  const result = await db
    .delete(products)
    .where(and(eq(products.id, productId), eq(products.shopId, shop.id)))
    .returning({ id: products.id });

  if (result.length === 0) {
    return NextResponse.json({ error: "این اثر متعلق به شما نیست" }, { status: 403 });
  }
  return NextResponse.json({ ok: true });
}
