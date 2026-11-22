import Link from "next/link";
import {
  Scroll,
  Amphora,
  Shapes,
  Layers,
  LampCeiling,
  Scissors,
  Handbag,
  Brush,
  Gem,
  TreePine,
  Hammer,
  Gift,
  Sparkles,
  Store,
  ChevronLeft,
  Truck,
  ShieldCheck,
  RotateCcw,
  HeartHandshake,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";
import { asc, desc, sql } from "drizzle-orm";
import { db } from "@/db";
import { categories, shops, products } from "@/db/schema";
import { queryProducts, type ProductRow } from "@/lib/catalog";
import { toFaDigits } from "@/lib/format";
import { CATEGORY_IMAGES, px } from "@/lib/images";
import Stories from "@/components/Stories";
import HeroSlider from "@/components/HeroSlider";
import ProductCarousel from "@/components/ProductCarousel";
import ShopCard from "@/components/ShopCard";
import type { ProductCardData } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  carpet: Scroll,
  pottery: Amphora,
  textile: Scissors,
  leather: Handbag,
  painting: Brush,
  jewelry: Gem,
  wood: TreePine,
  metal: Hammer,
  decor: Gift,
  pattern: Shapes,
  felt: Layers,
  lighting: LampCeiling,
};

const toCard = (p: ProductRow): ProductCardData => ({
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
  shopName: p.shopName,
  shopSlug: p.shopSlug,
});

export default async function HomePage() {
  const [cats, shopRows, featuredRes, newestRes, salesRes, discountRes] = await Promise.all([
    db.select().from(categories).orderBy(asc(categories.sort)),
    db
      .select({
        id: shops.id,
        name: shops.name,
        slug: shops.slug,
        city: shops.city,
        story: shops.story,
        avatarColor: shops.avatarColor,
        verified: shops.verified,
        productsCount: sql<number>`count(${products.id})::int`,
      })
      .from(shops)
      .leftJoin(products, sql`${products.shopId} = ${shops.id}`)
      .groupBy(shops.id)
      .orderBy(desc(shops.verified), desc(sql`count(${products.id})`)),
    queryProducts({ featured: true, limit: 12 }),
    queryProducts({ sort: "newest", limit: 12 }),
    queryProducts({ sort: "sales", limit: 12 }),
    queryProducts({ sort: "discount", limit: 12 }),
  ]);

  return (
    <div className="container-digi space-y-3 py-3 md:space-y-4 md:py-4">
      {/* استوری فروشگاه‌های هنرمندان */}
      <Stories />

      {/* اسلایدر + ستون کناری */}
      <div className="grid gap-3 md:grid-cols-12">
        <div className="md:col-span-9">
          <HeroSlider />
        </div>
        <aside className="hidden flex-col gap-3 md:col-span-3 md:flex">
          <Link href="/sell" className="group relative flex-1 overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={px(36738895, 600, 500)} alt="هنرمند در کارگاه" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2b1a0e] via-[#2b1a0e]/60 to-transparent" />
            <div className="relative flex h-full flex-col justify-end p-4">
              <span className="mb-1 flex h-9 w-9 items-center justify-center rounded-xl bg-saffron text-[#2b1a0e]"><Store size={18} /></span>
              <h3 className="font-display text-[17px] text-[#fbf7ee]">شما هم هنرمند هستید؟</h3>
              <p className="text-[10px] leading-5 text-white/80">بدون هزینه عضویت؛ فقط ۱۰٪ کمیسیون از فروش</p>
              <span className="mt-1 flex items-center gap-1 text-[10.5px] font-bold text-saffron">شروع فروشندگی <ChevronLeft size={13} className="transition-transform group-hover:-translate-x-1" /></span>
            </div>
          </Link>
          <Link href="/featured" className="group relative flex-1 overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={px(32980208, 600, 500)} alt="فانوس‌های موزائیک" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1f1405] via-[#1f1405]/55 to-transparent" />
            <div className="relative flex h-full flex-col justify-end p-4">
              <span className="mb-1 flex h-9 w-9 items-center justify-center rounded-xl bg-[#fbf7ee] text-amber-700"><Sparkles size={18} /></span>
              <h3 className="font-display text-[17px] text-[#fbf7ee]">منتخب سردبیر</h3>
              <p className="text-[10px] leading-5 text-white/80">دست‌چین کارشناسان از بهترین کارگاه‌ها</p>
              <span className="mt-1 flex items-center gap-1 text-[10.5px] font-bold text-saffron">دیدن منتخب‌ها <ChevronLeft size={13} className="transition-transform group-hover:-translate-x-1" /></span>
            </div>
          </Link>
        </aside>
      </div>

      {/* بنر مأموریت و آمار */}
      <section className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-digi-border/60 bg-[#2b2118] px-5 py-4 text-center md:flex-row md:text-right">
        <div className="flex items-center gap-3">
          <HeartHandshake size={34} className="shrink-0 text-saffron" strokeWidth={1.4} />
          <div>
            <p className="font-display text-[15px] leading-6 text-[#fbf7ee]">با خرید شما، هنر زنده می‌ماند</p>
            <p className="text-[9.5px] text-white/60">۹۰٪ مبلغ هر اثر مستقیماً به هنرمند می‌رسد</p>
          </div>
        </div>
        <div className="flex items-center gap-5 text-[#fbf7ee] md:gap-7">
          {[
            { v: "۹+", l: "کارگاه هنرمند" },
            { v: "۲۶+", l: "اثر دست‌ساز" },
            { v: "۹", l: "استان ایران" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <div className="text-lg font-black text-saffron">{s.v}</div>
              <div className="text-[9px] text-white/60">{s.l}</div>
            </div>
          ))}
          <Link href="/shops" className="hidden rounded-lg border border-saffron/40 px-4 py-2 text-[11px] font-bold text-saffron transition hover:bg-saffron hover:text-[#2b2118] md:block">
            بازدید از فروشگاه‌ها
          </Link>
        </div>
      </section>

      {/* دسته‌بندی آثار */}
      <section id="categories" className="rounded-2xl border border-digi-border/60 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-[13px] font-extrabold">
            <LayoutGrid size={16} className="text-brand" />
            دسته‌بندی آثار هنری
          </h2>
          <Link href="/shops" className="flex items-center gap-0.5 text-[10.5px] font-bold text-brand hover:underline">
            همه فروشگاه‌ها
            <ChevronLeft size={13} />
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-6">
          {cats.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.slug] ?? Amphora;
            const img = CATEGORY_IMAGES[cat.slug];
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#efe7d8] sm:aspect-square"
              >
                {img && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img} alt={cat.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity group-hover:from-black/85" />
                <div className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 p-2.5">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-white shadow" style={{ backgroundColor: cat.color }}>
                    <Icon size={15} strokeWidth={2} />
                  </span>
                  <span className="text-[11px] font-extrabold leading-4 text-white drop-shadow sm:text-[12px]">{cat.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* منتخب سردبیر */}
      <ProductCarousel title="منتخب سردبیر هنربازار" href="/featured" products={featuredRes.products.map(toCard)} />

      {/* فروشگاه‌های برگزیده */}
      <section className="rounded-2xl border border-digi-border/60 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-[14px] font-extrabold">
            <Store size={17} className="text-brand" />
            فروشگاه‌های برگزیده هنرمندان
          </h2>
          <Link href="/shops" className="flex items-center gap-0.5 text-[10.5px] font-bold text-brand hover:underline">
            همه {toFaDigits(shopRows.length)} فروشگاه
            <ChevronLeft size={13} />
          </Link>
        </div>
        <div className="scrollbar-hide snap-x-container flex gap-3 overflow-x-auto pb-1">
          {shopRows.map((shop) => (
            <div key={shop.id} className="snap-card">
              <ShopCard shop={shop} productsCount={shop.productsCount} />
            </div>
          ))}
        </div>
      </section>

      {/* پرفروش‌ترین‌ها */}
      <ProductCarousel title="پرفروش‌ترین آثار" href="/search?sort=sales" products={salesRes.products.map(toCard)} />

      {/* آثار با تخفیف */}
      <ProductCarousel title="آثار با تخفیف ویژه" href="/search?sort=discount" products={discountRes.products.map(toCard)} />

      {/* تازه‌های کارگاه‌ها */}
      <ProductCarousel title="تازه‌های کارگاه‌ها" href="/search?sort=newest" products={newestRes.products.map(toCard)} />

      {/* خدمات هنربازار */}
      <section className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
        {[
          { icon: HeartHandshake, title: "خرید مستقیم از هنرمند", sub: "بدون واسطه و با قیمت کارگاه", color: "#b4532a" },
          { icon: ShieldCheck, title: "ضمانت اصالت اثر", sub: "گواهی دست‌ساز بودن برای هر اثر", color: "#2e7d4f" },
          { icon: Truck, title: "بسته‌بندی مطمئن", sub: "ارسال با جعبه محافظ و بیمه", color: "#0f766e" },
          { icon: RotateCcw, title: "۷ روز مهلت بازگشت", sub: "در صورت مغایرت اثر با توضیحات", color: "#d9a441" },
        ].map(({ icon: Icon, title, sub, color }) => (
          <div
            key={title}
            className="flex items-center gap-3 rounded-2xl border border-digi-border/60 bg-white p-3 md:p-4"
          >
            <span
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
              style={{ backgroundColor: `${color}14`, color }}
            >
              <Icon size={22} strokeWidth={1.8} />
            </span>
            <span>
              <span className="block text-[11px] font-extrabold text-digi-text">{title}</span>
              <span className="mt-0.5 block text-[9px] leading-4 text-digi-muted">{sub}</span>
            </span>
          </div>
        ))}
      </section>
    </div>
  );
}
