import type { Metadata } from "next";
import { Store, BadgeCheck } from "lucide-react";
import { desc, sql } from "drizzle-orm";
import { db } from "@/db";
import { shops, products } from "@/db/schema";
import ShopCard from "@/components/ShopCard";
import { toFaDigits } from "@/lib/format";
import { HERO } from "@/lib/images";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "فروشگاه‌های هنرمندان",
  description: "همه کارگاه‌ها و فروشگاه‌های هنرمندان هنربازار؛ از سفال لالجین تا خاتم اصفهان و سوزن‌دوزی بلوچستان.",
};

export default async function ShopsPage() {
  const shopRows = await db
    .select({
      id: shops.id,
      name: shops.name,
      slug: shops.slug,
      city: shops.city,
      story: shops.story,
      avatarColor: shops.avatarColor,
      verified: shops.verified,
      productsCount: sql<number>`count(${products.id})::int`,
      salesCount: sql<number>`coalesce(sum(${products.salesCount}), 0)::int`,
    })
    .from(shops)
    .leftJoin(products, sql`${products.shopId} = ${shops.id}`)
    .groupBy(shops.id)
    .orderBy(desc(shops.verified), desc(sql`coalesce(sum(${products.salesCount}), 0)`));

  const totalProducts = shopRows.reduce((acc, s) => acc + s.productsCount, 0);

  return (
    <div className="container-digi py-4">
      {/* سربرگ */}
      <div className="relative flex flex-col items-center gap-2 overflow-hidden rounded-3xl px-6 py-12 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO.bazaar} alt="بازار صنایع‌دستی" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2b1a0e]/80 via-[#2b1a0e]/75 to-[#2b1a0e]/90" />
        <span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-saffron text-[#2b1a0e]">
          <Store size={28} strokeWidth={1.6} />
        </span>
        <h1 className="relative font-display text-3xl text-[#fbf7ee]">فروشگاه‌های هنرمندان هنربازار</h1>
        <p className="relative max-w-xl text-[11.5px] leading-6 text-white/80">
          {toFaDigits(shopRows.length)} فروشگاه فعال با {toFaDigits(totalProducts)} اثر دست‌ساز؛<br />
          خرید مستقیم از کارگاه، بدون واسطه و با گواهی اصالت.
        </p>
        <p className="relative flex items-center gap-1 text-[10px] text-emerald-300">
          <BadgeCheck size={13} />
          فروشگاه‌های دارای نشان آبی توسط تیم هنربازار اعتبارسنجی شده‌اند
        </p>
      </div>

      {/* گرید فروشگاه‌ها */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {shopRows.map((shop) => (
          <ShopCard key={shop.id} shop={shop} productsCount={shop.productsCount} wide />
        ))}
      </div>
    </div>
  );
}
