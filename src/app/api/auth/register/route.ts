import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, shops } from "@/db/schema";
import { hashPassword, createSession } from "@/lib/auth";
import { setSessionCookie } from "@/lib/auth-cookie";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";

export const dynamic = "force-dynamic";

const PHONE_RE = /^09\d{9}$/;

function makeSlug(name: string): string {
  const base = name
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\u0600-\u06FFa-zA-Z0-9-]/g, "")
    .slice(0, 60);
  return `${base || "shop"}-${randomBytes(2).toString("hex")}`;
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const password = String(body.password ?? "");
  const accountType = body.accountType === "seller" ? "seller" : "buyer";
  const shopName = String(body.shopName ?? "").trim();
  const shopCity = String(body.shopCity ?? "").trim();

  if (name.length < 3) {
    return NextResponse.json({ error: "نام و نام خانوادگی را کامل وارد کنید" }, { status: 400 });
  }
  if (!PHONE_RE.test(phone)) {
    return NextResponse.json({ error: "شماره موبایل معتبر نیست (مثال: 09123456789)" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "رمز عبور باید حداقل ۶ کاراکتر باشد" }, { status: 400 });
  }
  if (accountType === "seller" && (shopName.length < 3 || shopCity.length < 2)) {
    return NextResponse.json({ error: "نام فروشگاه و شهر را کامل وارد کنید" }, { status: 400 });
  }

  const [exists] = await db.select({ id: users.id }).from(users).where(eq(users.phone, phone)).limit(1);
  if (exists) {
    return NextResponse.json({ error: "این شماره موبایل قبلاً ثبت شده است" }, { status: 409 });
  }

  const result = await db.transaction(async (tx) => {
    const [user] = await tx
      .insert(users)
      .values({
        name,
        phone,
        passwordHash: hashPassword(password),
        role: accountType,
      })
      .returning({ id: users.id, name: users.name, phone: users.phone, role: users.role });

    let shop = null;
    if (accountType === "seller") {
      [shop] = await tx
        .insert(shops)
        .values({
          userId: user.id,
          name: shopName,
          slug: makeSlug(shopName),
          city: shopCity,
          story: `فروشگاه ${shopName} در هنربازار؛ فروش آثار دست‌ساز و هنری با تضمین اصالت.`,
          avatarColor: ["#b4532a", "#0f766e", "#6d28d9", "#92400e", "#be185d"][Math.floor(Math.random() * 5)],
        })
        .returning();
    }

    return { user, shop };
  });

  const token = await createSession(result.user.id);
  await setSessionCookie(token);

  return NextResponse.json({
    user: { id: result.user.id, name: result.user.name, phone: result.user.phone, role: result.user.role },
    shop: result.shop ? { slug: result.shop.slug, name: result.shop.name } : null,
  });
}
