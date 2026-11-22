import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/db";
import { shops } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function requireSeller() {
  const user = await getSessionUser();
  if (!user) return { error: NextResponse.json({ error: "وارد نشده‌اید" }, { status: 401 }) } as const;
  const [shop] = await db.select().from(shops).where(eq(shops.userId, user.id)).limit(1);
  if (!shop) return { error: NextResponse.json({ error: "شما فروشنده نیستید؛ اول ثبت‌نام فروشنده را انجام دهید" }, { status: 403 }) } as const;
  return { user, shop } as const;
}
