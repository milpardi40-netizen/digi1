import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq, sql } from "drizzle-orm";
import {
  BadgeCheck,
  MapPin,
  ChevronLeft,
  Store,
  CalendarDays,
  Package,
  ShoppingBag,
} from "lucide-react";
import { db } from "@/db";
import { shops, products } from "@/db/schema";
import { queryProducts } from "@/lib/catalog";
import { formatDateFa, toFaDigits } from "@/lib/format";
import ProductCard from "@/components/ProductCard";
import { shopCover } from "@/lib/images";
import FollowShopButton from "@/components/FollowShopButton";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [shop] = await db.select().from(shops).where(eq(shops.slug, slug)).limit(1);
  return { title: shop ? shop.name : "فروشگاه" };
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [shop] = await db.select().from(shops).where(eq(shops.slug, slug)).limit(1);
  if (!shop) notFound();

  const [{ products: shopProducts, total }, [salesAgg]] = await Promise.all([
    queryProducts({ shop: shop.slug, limit: 48 }),
    db
      .select({
        totalSales: sql<number>`coalesce(sum(${products.salesCount}), 0)::int`,
      })
      .from(products)
      .where(eq(products.shopId, shop.id)),
  ]);

  return (
    <div className="container-digi py-3 md:py-4">
      <nav className="mb-2 flex items-center gap-1 text-[10.5px] text-digi-muted" aria-label="breadcrumb">
        <Link href="/" className="hover:text-brand">خانه</Link>
        <ChevronLeft size={11} />
        <Link href="/shops" className="hover:text-brand">فروشگاه‌ها</Link>
        <ChevronLeft size={11} />
        <span className="text-digi-text">{shop.name}</span>
      </nav>

      {/* ── کارت فروشگاه ── */}
      <div className="overflow-hidden rounded-3xl border border-digi-border/60 bg-white">
        {/* نوار رنگی بالایی */}
        <div className="relative h-40 w-full overflow-hidden md:h-56">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={shopCover(shop.slug)} alt={shop.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        </div>
        <div className="flex flex-col gap-5 p-5 md:flex-row md:items-start md:p-6">
          <span
            className="-mt-16 grid h-24 w-24 shrink-0 place-items-center rounded-3xl border-4 border-white text-5xl font-black text-white shadow-lg md:-mt-20 md:h-28 md:w-28"
            style={{ backgroundColor: shop.avatarColor }}
          >
            {shop.name.trim().charAt(0)}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="flex flex-wrap items-center gap-2 font-display text-2xl text-digi-text">
              {shop.name}
              {shop.verified && (
                <span className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
                  <BadgeCheck size={14} />
                  فروشگاه تأییدشده
                </span>
              )}
            </h1>
            <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10.5px] text-digi-muted">
              <span className="flex items-center gap-1"><MapPin size={12} /> {shop.city}</span>
              <span className="flex items-center gap-1"><CalendarDays size={12} /> عضویت از {formatDateFa(shop.createdAt)}</span>
            </p>
            <p className="mt-3 max-w-2xl text-[11px] leading-6 text-digi-muted">{shop.story}</p>
          </div>
          <div className="flex shrink-0 flex-col items-stretch gap-2 md:items-end">
            <FollowShopButton slug={shop.slug} shopName={shop.name} />
            <div className="flex items-center justify-center gap-4 rounded-xl bg-[#faf6ec] px-4 py-2 text-[9.5px] text-digi-muted md:justify-end">
              <span className="flex items-center gap-1"><Package size={12} /> {toFaDigits(total)} اثر</span>
              <span className="flex items-center gap-1"><ShoppingBag size={12} /> {toFaDigits(salesAgg?.totalSales ?? 0)} فروش</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── آثار فروشگاه ── */}
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-[14px] font-extrabold">
            <Store size={17} className="text-brand" />
            آثار «{shop.name}»
          </h2>
          <span className="text-[10.5px] text-digi-muted">{toFaDigits(total)} اثر</span>
        </div>
        {shopProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-digi-border bg-white py-16 text-center text-[12px] text-digi-muted">
            این هنرمند هنوز اثری ثبت نکرده است؛ به‌زودی آثار جدید اضافه می‌شود.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-digi-border/70 bg-digi-border sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {shopProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={{
                  id: p.id,
                  slug: p.slug,
                  name: p.name,
                  image: p.image,
                  price: p.price,
                  originalPrice: p.originalPrice,
                  rating: p.rating,
                  ratingsCount: p.ratingsCount,
                  isFeatured: p.isFeatured,
                  salesCount: p.salesCount,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
