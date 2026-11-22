import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/db";
import { addresses } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "وارد نشده‌اید" }, { status: 401 });
  const rows = await db.select().from(addresses).where(eq(addresses.userId, user.id)).orderBy(desc(addresses.id));
  return NextResponse.json({ addresses: rows });
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "برای ثبت آدرس ابتدا وارد شوید" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const title = String(body.title ?? "خانه").trim() || "خانه";
  const province = String(body.province ?? "").trim();
  const city = String(body.city ?? "").trim();
  const address = String(body.address ?? "").trim();
  const recipient = String(body.recipient ?? "").trim();
  const phone = String(body.phone ?? "").trim();

  if (!province || !city || address.length < 8 || !recipient || !/^09\d{9}$/.test(phone)) {
    return NextResponse.json(
      { error: "لطفاً همه فیلدهای ضروری آدرس را (حداقل آدرس ۸ کاراکتری و موبایل معتبر) تکمیل کنید" },
      { status: 400 }
    );
  }

  const [created] = await db
    .insert(addresses)
    .values({
      userId: user.id,
      title,
      province,
      city,
      address,
      plaque: String(body.plaque ?? "").trim() || null,
      unit: String(body.unit ?? "").trim() || null,
      postalCode: String(body.postalCode ?? "").trim() || null,
      recipient,
      phone,
    })
    .returning();

  return NextResponse.json({ address: created });
}
