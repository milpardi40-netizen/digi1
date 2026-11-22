import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { promoCodes } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const code = String(body.code ?? "").trim().toUpperCase();

  if (!code) {
    return NextResponse.json({ error: "کد تخفیف را وارد کنید" }, { status: 400 });
  }

  const [promo] = await db
    .select()
    .from(promoCodes)
    .where(eq(promoCodes.code, code))
    .limit(1);

  if (!promo || !promo.active) {
    return NextResponse.json({ error: "کد تخفیف نامعتبر است یا منقضی شده" }, { status: 404 });
  }

  return NextResponse.json({
    code: promo.code,
    percent: promo.percent,
    maxDiscount: promo.maxDiscount,
  });
}
