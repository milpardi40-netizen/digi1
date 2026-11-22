import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/db";
import { comments, products } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "برای ثبت نظر ابتدا وارد حساب کاربری شوید" }, { status: 401 });
  }

  const { id } = await params;
  const productId = Number(id);
  if (!Number.isFinite(productId)) {
    return NextResponse.json({ error: "شناسه کالا نامعتبر است" }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const text = String(body.text ?? "").trim();
  const rating = Math.round(Number(body.rating));

  if (text.length < 3) {
    return NextResponse.json({ error: "متن نظر باید حداقل ۳ کاراکتر باشد" }, { status: 400 });
  }
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "امتیاز باید بین ۱ تا ۵ باشد" }, { status: 400 });
  }

  const [product] = await db.select({ id: products.id }).from(products).where(eq(products.id, productId)).limit(1);
  if (!product) {
    return NextResponse.json({ error: "کالا یافت نشد" }, { status: 404 });
  }

  await db.insert(comments).values({
    productId,
    userId: user.id,
    userName: user.name,
    rating,
    text: text.slice(0, 2000),
  });

  return NextResponse.json({ ok: true });
}
