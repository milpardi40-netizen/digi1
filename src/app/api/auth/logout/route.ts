import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth";
import { clearSessionCookie } from "@/lib/auth-cookie";

export const dynamic = "force-dynamic";

export async function POST() {
  await destroySession();
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
