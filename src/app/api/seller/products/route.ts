import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { requireSeller } from "@/lib/require-seller";
import { randomBytes } from "crypto";

export const dynamic = "force-dynamic";

function slugify(name: string): string {
  const base = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\u0600-\u06FFa-z0-9-]/g, "")
    .slice(0, 80);
  return `${base || "asar"}-${randomBytes(2).toString("hex")}`;
}

/** ثبت اثر جدید توسط فروشنده */
export async function POST(request: NextRequest) {
  const ctx = await requireSeller();
  if ("error" in ctx) return ctx.error;
  const { shop } = ctx;

  const body = await request.json().catch(() => ({}));
  const name = String(body.name ?? "").trim();
  const description = String(body.description ?? "").trim();
  const image = String(body.image ?? "").trim();
  const categoryId = body.categoryId ? Number(body.categoryId) : null;
  const price = Math.max(0, Math.floor(Number(body.price) || 0));
  const originalPrice = Math.max(price, Math.floor(Number(body.originalPrice) || 0));
  const stock = Math.max(0, Math.floor(Number(body.stock) || 0));
  const specs = typeof body.specs === "object" && body.specs ? (body.specs as Record<string, string>) : {};

  if (name.length < 5) {
    return NextResponse.json({ error: "نام اثر باید حداقل ۵ کاراکتر باشد" }, { status: 400 });
  }
  if (!image.startsWith("http")) {
    return NextResponse.json({ error: "آدرس تصویر معتبر وارد کنید (http/https)" }, { status: 400 });
  }
  if (price <= 0) {
    return NextResponse.json({ error: "قیمت اثر را مشخص کنید" }, { status: 400 });
  }

  const cleanSpecs: Record<string, string> = {};
  for (const [k, v] of Object.entries(specs)) {
    const key = String(k).trim().slice(0, 60);
    const value = String(v).trim().slice(0, 200);
    if (key && value) cleanSpecs[key] = value;
  }

  const [created] = await db
    .insert(products)
    .values({
      name,
      slug: slugify(name),
      shopId: shop.id,
      categoryId: categoryId && Number.isFinite(categoryId) ? categoryId : null,
      price,
      originalPrice,
      stock,
      image,
      description,
      specs: cleanSpecs,
      rating: "5.0",
      ratingsCount: 0,
      salesCount: 0,
    })
    .returning({ id: products.id, slug: products.slug });

  return NextResponse.json({ ok: true, product: created });
}
