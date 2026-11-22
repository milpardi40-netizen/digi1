import { NextRequest, NextResponse } from "next/server";
import { queryProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const num = (v: string | null) => {
    const n = Number(v);
    return v !== null && Number.isFinite(n) ? n : undefined;
  };

  const { products, total } = await queryProducts({
    q: sp.get("q") ?? undefined,
    category: sp.get("category") ?? undefined,
    shop: sp.get("shop") ?? undefined,
    featured: sp.get("featured") === "1" || sp.get("featured") === "true",
    min: num(sp.get("min")),
    max: num(sp.get("max")),
    sort: sp.get("sort") ?? undefined,
    limit: num(sp.get("limit")) ?? 12,
    offset: num(sp.get("offset")) ?? 0,
  });

  return NextResponse.json({ products, total });
}
