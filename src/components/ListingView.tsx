import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, SearchX } from "lucide-react";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { shops } from "@/db/schema";
import { queryProducts, type CatalogParams, type ProductRow } from "@/lib/catalog";
import { toFaDigits } from "@/lib/format";
import ProductCard from "@/components/ProductCard";
import FilterSidebar from "@/components/FilterSidebar";

const PAGE_SIZE = 12;

function str(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

export default async function ListingView({
  title,
  subtitle,
  breadcrumb,
  basePath,
  searchParams,
  fixed,
  fixedQuery,
  featuredTheme = false,
  bannerImage,
}: {
  title: string;
  subtitle?: string;
  breadcrumb: string[];
  basePath: string;
  searchParams: Record<string, string | string[] | undefined>;
  fixed: CatalogParams;
  fixedQuery: Record<string, string>;
  featuredTheme?: boolean;
  bannerImage?: string;
}) {
  const page = Math.max(1, Number(str(searchParams.page)) || 1);
  const sort = str(searchParams.sort) ?? "default";
  const shop = str(searchParams.shop);
  const min = str(searchParams.min) ? Number(str(searchParams.min)) : undefined;
  const max = str(searchParams.max) ? Number(str(searchParams.max)) : undefined;

  const params: CatalogParams = {
    ...fixed,
    sort: sort === "default" ? undefined : sort,
    shop,
    min,
    max,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  };

  const [{ products, total }, shopRows] = await Promise.all([
    queryProducts(params),
    db.select().from(shops).orderBy(asc(shops.name)),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const pageHref = (p: number) => {
    const q = new URLSearchParams(fixedQuery);
    if (sort !== "default") q.set("sort", sort);
    if (shop) q.set("shop", shop);
    if (min) q.set("min", String(min));
    if (max) q.set("max", String(max));
    if (p > 1) q.set("page", String(p));
    const s = q.toString();
    return s ? `${basePath}?${s}` : basePath;
  };

  return (
    <div className="container-digi py-3 md:py-4">
      {/* نوار عنوان — بنر تصویری */}
      {bannerImage ? (
        <div className="relative mb-3 overflow-hidden rounded-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={bannerImage} alt={title} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-l from-[#2b1a0e]/95 via-[#2b1a0e]/70 to-[#2b1a0e]/20" />
          <div className="relative px-5 py-8 text-[#fbf7ee] md:px-8 md:py-12">
            <nav aria-label="breadcrumb" className="mb-2 flex items-center gap-1 text-[10.5px] text-white/75">
              <Link href="/" className="hover:underline">خانه</Link>
              {breadcrumb.map((crumb) => (
                <span key={crumb} className="flex items-center gap-1">
                  <ChevronLeft size={11} />
                  <span>{crumb}</span>
                </span>
              ))}
            </nav>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="flex items-center gap-2">
                {featuredTheme && <Sparkles size={28} className="text-saffron" fill="currentColor" />}
                <div>
                  <h1 className="font-display text-2xl drop-shadow md:text-4xl">{title}</h1>
                  {subtitle && <p className="mt-1 max-w-lg text-[11.5px] leading-6 text-white/85">{subtitle}</p>}
                </div>
              </div>
              <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-bold backdrop-blur">
                {toFaDigits(total)} اثر
              </span>
            </div>
          </div>
        </div>
      ) : (
      <div
        className={`mb-3 rounded-2xl px-4 py-4 md:px-6 ${
          featuredTheme
            ? "bg-gradient-to-l from-[#b4532a] via-[#a1491f] to-[#6b2d10] text-[#fbf7ee]"
            : "border border-digi-border/60 bg-white"
        }`}
      >
        <nav aria-label="breadcrumb" className="mb-1 flex items-center gap-1 text-[10.5px] opacity-80">
          <Link href="/" className="hover:underline">خانه</Link>
          {breadcrumb.map((crumb) => (
            <span key={crumb} className="flex items-center gap-1">
              <ChevronLeft size={11} />
              <span>{crumb}</span>
            </span>
          ))}
        </nav>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {featuredTheme && <Sparkles size={26} fill="currentColor" />}
            <div>
              <h1 className={`font-display text-lg md:text-2xl ${featuredTheme ? "text-[#fbf7ee]" : "text-digi-text"}`}>
                {title}
              </h1>
              {subtitle && (
                <p className={`mt-0.5 text-[11px] ${featuredTheme ? "text-white/85" : "text-digi-muted"}`}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <span className={`text-[11px] font-bold ${featuredTheme ? "text-[#fbf7ee]" : "text-digi-muted"}`}>
            {toFaDigits(total)} اثر
          </span>
        </div>
      </div>
      )}

      <div className="grid gap-3 lg:grid-cols-12">
        {/* فیلترها */}
        <div className="lg:col-span-3 xl:col-span-2">
          <FilterSidebar
            shopOptions={shopRows.map((s) => ({ slug: s.slug, name: s.name }))}
            currentShops={shop ? shop.split(",").filter(Boolean) : []}
            currentSort={sort}
            currentMin={min}
            currentMax={max}
            basePath={basePath}
            fixedQuery={fixedQuery}
          />
        </div>

        {/* گرید آثار */}
        <div className="lg:col-span-9 xl:col-span-10">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-digi-border/60 bg-white py-20 text-center">
              <SearchX size={44} className="text-gray-300" />
              <h2 className="text-base font-extrabold text-digi-text">اثری یافت نشد</h2>
              <p className="max-w-sm text-[12px] leading-6 text-digi-muted">
                عبارت دیگری جستجو کنید یا فیلترها را پاک کنید.
              </p>
              <Link href={basePath} className="rounded-lg bg-brand px-5 py-2 text-[12px] font-bold text-white">
                پاک کردن فیلترها
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-digi-border/70 bg-digi-border sm:grid-cols-3 xl:grid-cols-4">
                {products.map((p: ProductRow) => (
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
                      shopName: p.shopName,
                      shopSlug: p.shopSlug,
                    }}
                  />
                ))}
              </div>

              {/* صفحه‌بندی */}
              {totalPages > 1 && (
                <nav className="mt-4 flex items-center justify-center gap-1.5" aria-label="صفحه‌بندی">
                  <Link
                    href={pageHref(Math.max(1, page - 1))}
                    aria-label="صفحه قبل"
                    className={`grid h-9 w-9 place-items-center rounded-lg border border-digi-border bg-white transition ${
                      page === 1 ? "pointer-events-none opacity-40" : "hover:border-brand hover:text-brand"
                    }`}
                  >
                    <ChevronRight size={16} />
                  </Link>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={pageHref(p)}
                      aria-current={p === page ? "page" : undefined}
                      className={`grid h-9 w-9 place-items-center rounded-lg border text-[12px] font-bold transition ${
                        p === page
                          ? "border-brand bg-brand text-white"
                          : "border-digi-border bg-white text-digi-text hover:border-brand hover:text-brand"
                      }`}
                    >
                      {toFaDigits(p)}
                    </Link>
                  ))}
                  <Link
                    href={pageHref(Math.min(totalPages, page + 1))}
                    aria-label="صفحه بعد"
                    className={`grid h-9 w-9 place-items-center rounded-lg border border-digi-border bg-white transition ${
                      page === totalPages ? "pointer-events-none opacity-40" : "hover:border-brand hover:text-brand"
                    }`}
                  >
                    <ChevronLeft size={16} />
                  </Link>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
