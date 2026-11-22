import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import {
  ChevronLeft,
  Sparkles,
  Truck,
  ShieldCheck,
  RotateCcw,
  BadgeCheck,
  MapPin,
  CircleCheck,
  Store,
  ArrowLeft,
} from "lucide-react";
import { db } from "@/db";
import { comments } from "@/db/schema";
import { getProductBySlug, queryProducts } from "@/lib/catalog";
import { discountPercent, toFaDigits } from "@/lib/format";
import Price from "@/components/Price";
import Rating from "@/components/Rating";
import ProductTabs, { type SerializedComment } from "@/components/ProductTabs";
import AddToCartButton from "@/components/AddToCartButton";
import FavoriteToggle from "@/components/FavoriteToggle";
import ProductCarousel from "@/components/ProductCarousel";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  return { title: p ? p.name : "اثر هنری" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) notFound();

  const [commentRows, relatedRes, shopProductsRes] = await Promise.all([
    db
      .select()
      .from(comments)
      .where(eq(comments.productId, p.id))
      .orderBy(desc(comments.createdAt))
      .limit(20),
    queryProducts({ category: p.categorySlug ?? undefined, limit: 13 }),
    queryProducts({ shop: p.shopSlug, limit: 13 }),
  ]);

  const related = relatedRes.products.filter((r) => r.id !== p.id).slice(0, 12);
  const moreFromShop = shopProductsRes.products.filter((r) => r.id !== p.id).slice(0, 12);
  const off = discountPercent(p.price, p.originalPrice);
  const keySpecs = Object.entries(p.specs).slice(0, 4);

  const serializedComments: SerializedComment[] = commentRows.map((c) => ({
    id: c.id,
    userName: c.userName,
    rating: c.rating,
    text: c.text,
    likes: c.likes,
    dislikes: c.dislikes,
    createdAt: c.createdAt.toISOString(),
  }));

  return (
    <div className="container-digi py-3 md:py-4">
      {/* مسیر راهنما */}
      <nav className="mb-2 flex flex-wrap items-center gap-1 text-[10.5px] text-digi-muted" aria-label="breadcrumb">
        <Link href="/" className="hover:text-brand">خانه</Link>
        <ChevronLeft size={11} />
        {p.categorySlug && (
          <>
            <Link href={`/category/${p.categorySlug}`} className="hover:text-brand">{p.categoryName}</Link>
            <ChevronLeft size={11} />
          </>
        )}
        <Link href={`/shop/${p.shopSlug}`} className="hover:text-brand">{p.shopName}</Link>
        <ChevronLeft size={11} />
        <span className="max-w-56 truncate text-digi-text md:max-w-96">{p.name}</span>
      </nav>

      {/* ── بلوک اصلی: تصویر | اطلاعات | جعبه خرید ── */}
      <div className="grid gap-3 lg:grid-cols-12">
        {/* تصویر */}
        <div className="rounded-2xl border border-digi-border/60 bg-white p-4 lg:col-span-3">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-[#efe7d8]">
            {p.isFeatured && (
              <span className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-lg bg-gradient-to-l from-saffron to-amber-600 px-2 py-1 text-[11px] font-black text-white shadow">
                <Sparkles size={12} fill="currentColor" />
                منتخب سردبیر
              </span>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.image}
              alt={p.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 border-t border-digi-border/60 pt-3">
            <BadgeCheck size={16} className="text-emerald-dig" />
            <span className="text-[10.5px] font-bold text-emerald-dig">اثر دست‌ساز با گواهی اصالت</span>
          </div>
          <div className="mt-2 flex items-center justify-center gap-2 text-[10px] text-digi-muted">
            کد اثر: AZ-{toFaDigits(p.id)}047
          </div>
        </div>

        {/* اطلاعات اثر */}
        <div className="rounded-2xl border border-digi-border/60 bg-white p-5 lg:col-span-6">
          <Link
            href={`/shop/${p.shopSlug}`}
            className="group flex w-fit items-center gap-2 rounded-lg border border-digi-border px-2.5 py-1.5 transition-colors hover:border-brand"
          >
            <span
              className="grid h-6 w-6 place-items-center rounded-md text-[11px] font-black text-white"
              style={{ backgroundColor: p.shopAvatarColor }}
            >
              {p.shopName.trim().charAt(0)}
            </span>
            <span className="text-[10.5px] font-bold text-digi-text group-hover:text-brand">{p.shopName}</span>
            {p.shopVerified && <BadgeCheck size={13} className="text-accent" />}
          </Link>

          <h1 className="mt-3 text-[17px] font-bold leading-7 text-digi-text md:text-xl md:leading-8">
            {p.name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-digi-border/60 pb-3 text-[11px] text-digi-muted">
            <Rating rating={Number(p.rating)} size={14} />
            <span>{toFaDigits(p.ratingsCount)} دیدگاه و امتیاز</span>
            <span className="text-gray-300">|</span>
            <span>{toFaDigits(p.salesCount)}+ اثر فروخته‌شده</span>
            <span className="text-gray-300">|</span>
            <span>{toFaDigits(commentRows.length)} نظر ثبت‌شده</span>
          </div>

          {/* ویژگی‌های کلیدی */}
          <h2 className="mt-4 text-[13px] font-extrabold text-digi-text">ویژگی‌های کلیدی اثر</h2>
          <ul className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {keySpecs.map(([key, value]) => (
              <li key={key} className="flex items-start gap-1.5 text-[11.5px] leading-6">
                <CircleCheck size={14} className="mt-1 shrink-0 text-emerald-dig" />
                <span>
                  <strong className="font-bold">{key}:</strong> {value}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-4 hidden border-r-2 border-brand/40 pr-3 text-[12px] leading-7 text-digi-muted md:block">
            {p.description}
          </p>

          {off > 0 && (
            <div className="mt-4 w-fit rounded-lg bg-orange-50 px-3 py-1.5 text-[11px] font-extrabold text-brand">
              اثر با {toFaDigits(off)}٪ تخفیف نسبت به قیمت کارگاه
            </div>
          )}
        </div>

        {/* جعبه خرید */}
        <div className="h-fit rounded-2xl border border-digi-border/60 bg-white p-4 lg:sticky lg:top-24 lg:col-span-3">
          {/* هنرمند */}
          <Link href={`/shop/${p.shopSlug}`} className="group block border-b border-digi-border/60 pb-3">
            <div className="text-[10px] text-digi-muted">هنرمند / کارگاه</div>
            <div className="mt-1.5 flex items-center gap-2">
              <span
                className="grid h-10 w-10 place-items-center rounded-xl text-[15px] font-black text-white"
                style={{ backgroundColor: p.shopAvatarColor }}
              >
                {p.shopName.trim().charAt(0)}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-1 text-[11.5px] font-extrabold text-digi-text group-hover:text-brand">
                  <span className="truncate">{p.shopName}</span>
                  {p.shopVerified && <BadgeCheck size={14} className="shrink-0 text-accent" />}
                </div>
                <div className="mt-0.5 flex items-center gap-1 text-[9px] text-digi-muted">
                  <MapPin size={10} />
                  {p.shopCity}
                </div>
              </div>
            </div>
            <span className="mt-2 flex items-center gap-1 text-[9.5px] font-bold text-brand">
              مشاهده همه آثار این هنرمند
              <ArrowLeft size={11} />
            </span>
          </Link>

          <div className="flex items-center justify-between py-3">
            <span className={`flex items-center gap-1.5 text-[10.5px] font-bold ${p.stock > 0 ? "text-emerald-dig" : "text-brand"}`}>
              <span className={`h-2 w-2 rounded-full ${p.stock > 0 ? "bg-emerald-dig" : "bg-brand"}`} />
              {p.stock > 0 ? `موجود — تنها ${toFaDigits(p.stock)} عدد باقی‌مانده` : "ناموجود"}
            </span>
          </div>

          {/* قیمت */}
          <div className="border-t border-digi-border/60 pt-3">
            <div className="flex items-end justify-between gap-2">
              <div className="text-[10px] text-digi-muted">
                قیمت مستقیم از کارگاه
                <div className="mt-0.5 text-[9px] text-gray-400">ارسال رایگان بالای ۲ میلیون تومان</div>
              </div>
              <Price price={p.price} originalPrice={p.originalPrice} size="lg" />
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2 py-1 text-[9.5px] font-bold text-emerald-800">
              <ShieldCheck size={12} />
              {toFaDigits(90)}٪ مبلغ این اثر مستقیماً به هنرمند می‌رسد
            </div>
          </div>

          {/* دکمه‌های خرید */}
          <div className="mt-3 flex gap-2">
            <div className="flex-1">
              <AddToCartButton
                product={{
                  id: p.id,
                  slug: p.slug,
                  name: p.name,
                  image: p.image,
                  price: p.price,
                  originalPrice: p.originalPrice,
                }}
                stock={p.stock}
              />
            </div>
            <FavoriteToggle productId={p.id} />
          </div>

          {/* سرویس‌ها */}
          <ul className="mt-4 space-y-2 border-t border-digi-border/60 pt-3 text-[10px] text-digi-muted">
            <li className="flex items-center gap-2"><Truck size={14} className="text-accent" /> ارسال با جعبه محافظ و بیمه کالا</li>
            <li className="flex items-center gap-2"><RotateCcw size={14} className="text-saffron" /> ۷ روز مهلت بازگشت در صورت مغایرت</li>
            <li className="flex items-center gap-2"><ShieldCheck size={14} className="text-emerald-dig" /> گواهی اصالت دست‌ساز بودن اثر</li>
          </ul>
        </div>
      </div>

      {/* ── تب‌ها ── */}
      <div className="mt-3">
        <ProductTabs
          productId={p.id}
          description={p.description}
          specs={p.specs}
          comments={serializedComments}
          rating={Number(p.rating)}
          ratingsCount={p.ratingsCount}
        />
      </div>

      {/* ── آثار دیگر همین هنرمند ── */}
      {moreFromShop.length > 0 && (
        <div className="mt-3">
          <ProductCarousel
            title={`سایر آثار «${p.shopName}»`}
            href={`/shop/${p.shopSlug}`}
            products={moreFromShop.map((r) => ({
              id: r.id,
              slug: r.slug,
              name: r.name,
              image: r.image,
              price: r.price,
              originalPrice: r.originalPrice,
              rating: r.rating,
              ratingsCount: r.ratingsCount,
              isFeatured: r.isFeatured,
              salesCount: r.salesCount,
              shopName: r.shopName,
              shopSlug: r.shopSlug,
            }))}
          />
        </div>
      )}

      {/* ── آثار مشابه ── */}
      {related.length > 0 && (
        <div className="mt-3">
          <ProductCarousel
            title="آثار مشابه این محصول"
            href={p.categorySlug ? `/category/${p.categorySlug}` : undefined}
            products={related.map((r) => ({
              id: r.id,
              slug: r.slug,
              name: r.name,
              image: r.image,
              price: r.price,
              originalPrice: r.originalPrice,
              rating: r.rating,
              ratingsCount: r.ratingsCount,
              isFeatured: r.isFeatured,
              salesCount: r.salesCount,
              shopName: r.shopName,
              shopSlug: r.shopSlug,
            }))}
          />
        </div>
      )}
    </div>
  );
}
