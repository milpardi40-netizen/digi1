import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { requireAdmin } from "@/lib/marketplace";

export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "دسترسی فقط برای مدیر" }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const n = Number(body.commissionPercent);
  if (!Number.isFinite(n) || n < 0 || n > 90) {
    return NextResponse.json({ error: "کمیسیون باید عددی بین ۰ تا ۹۰ باشد" }, { status: 400 });
  }

  await db
    .insert(settings)
    .values({ key: "commission_percent", value: String(Math.round(n)) })
    .onConflictDoUpdate({ target: settings.key, set: { value: String(Math.round(n)) } });

  return NextResponse.json({ ok: true, commissionPercent: Math.round(n) });
}
