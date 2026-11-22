import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { verifyPassword, createSession } from "@/lib/auth";
import { setSessionCookie } from "@/lib/auth-cookie";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const phone = String(body.phone ?? "").trim();
  const password = String(body.password ?? "");

  if (!phone || !password) {
    return NextResponse.json({ error: "شماره موبایل و رمز عبور را وارد کنید" }, { status: 400 });
  }

  const [user] = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: "شماره موبایل یا رمز عبور اشتباه است" }, { status: 401 });
  }

  const token = await createSession(user.id);
  await setSessionCookie(token);

  return NextResponse.json({
    user: { id: user.id, name: user.name, phone: user.phone, role: user.role },
  });
}
