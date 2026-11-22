"use client";

import { useRouter } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { toFaDigits } from "@/lib/format";

const SORT_OPTIONS = [
  { value: "default", label: "پیشنهاد هنربازار" },
  { value: "price_asc", label: "ارزان‌ترین" },
  { value: "price_desc", label: "گران‌ترین" },
  { value: "sales", label: "پرفروش‌ترین" },
  { value: "rating", label: "محبوب‌ترین" },
  { value: "newest", label: "جدیدترین" },
  { value: "discount", label: "بیشترین تخفیف" },
];

const PRICE_RANGES = [
  { value: "all", label: "همه محدوده‌ها", min: undefined, max: undefined },
  { value: "under2", label: "زیر ۲ میلیون", min: undefined, max: 2_000_000 },
  { value: "2to6", label: "۲ تا ۶ میلیون", min: 2_000_000, max: 6_000_000 },
  { value: "6to15", label: "۶ تا ۱۵ میلیون", min: 6_000_000, max: 15_000_000 },
  { value: "above15", label: "بالای ۱۵ میلیون", min: 15_000_000, max: undefined },
] as const;

export default function FilterSidebar({
  shopOptions,
  currentShops,
  currentSort,
  currentMin,
  currentMax,
  basePath,
  fixedQuery,
}: {
  shopOptions: Array<{ slug: string; name: string }>;
  currentShops: string[];
  currentSort: string;
  currentMin?: number;
  currentMax?: number;
  basePath: string;
  fixedQuery: Record<string, string>;
}) {
  const router = useRouter();

  const push = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(fixedQuery);
    if (updates.shop !== undefined) {
      if (updates.shop) params.set("shop", updates.shop);
    } else if (currentShops.length) {
      params.set("shop", currentShops.join(","));
    }
    if (updates.sort !== undefined) {
      if (updates.sort && updates.sort !== "default") params.set("sort", updates.sort);
    } else if (currentSort !== "default") {
      params.set("sort", currentSort);
    }
    if (updates.min !== undefined || updates.max !== undefined) {
      if (updates.min) params.set("min", updates.min);
      if (updates.max) params.set("max", updates.max);
    } else {
      if (currentMin) params.set("min", String(currentMin));
      if (currentMax) params.set("max", String(currentMax));
    }
    router.replace(`${basePath}?${params.toString()}`, { scroll: false });
  };

  const toggleShop = (slug: string) => {
    const next = currentShops.includes(slug)
      ? currentShops.filter((s) => s !== slug)
      : [...currentShops, slug];
    push({ shop: next.join(",") });
  };

  const priceValue = PRICE_RANGES.find(
    (r) => r.min === currentMin && r.max === currentMax
  )?.value ?? "all";

  const applyPrice = (value: (typeof PRICE_RANGES)[number]["value"]) => {
    const r = PRICE_RANGES.find((x) => x.value === value)!;
    push({ min: r.min ? String(r.min) : "", max: r.max ? String(r.max) : "" });
  };

  const clearAll = () => {
    const params = new URLSearchParams(fixedQuery);
    router.replace(`${basePath}?${params.toString()}`, { scroll: false });
  };

  const hasFilters =
    currentShops.length > 0 || currentSort !== "default" || currentMin !== undefined || currentMax !== undefined;

  return (
    <aside className="h-fit rounded-xl border border-digi-border/60 bg-white p-4 lg:sticky lg:top-24">
      <div className="mb-3 flex items-center justify-between border-b border-digi-border pb-3">
        <h2 className="flex items-center gap-1.5 text-[13px] font-extrabold">
          <SlidersHorizontal size={16} />
          فیلترها
        </h2>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-0.5 text-[10.5px] font-bold text-brand hover:underline"
          >
            پاک کردن
            <X size={12} />
          </button>
        )}
      </div>

      {/* مرتب‌سازی */}
      <div className="border-b border-digi-border pb-4">
        <label htmlFor="sort" className="digi-label">مرتب‌سازی</label>
        <select
          id="sort"
          value={currentSort}
          onChange={(e) => push({ sort: e.target.value })}
          className="digi-input"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* محدوده قیمت */}
      <div className="border-b border-digi-border py-4">
        <span className="digi-label">محدوده قیمت</span>
        <div className="space-y-2">
          {PRICE_RANGES.map((r) => (
            <label key={r.value} className="flex cursor-pointer items-center gap-2 text-[12px] text-digi-text">
              <input
                type="radio"
                name="price-range"
                checked={priceValue === r.value}
                onChange={() => applyPrice(r.value)}
                className="h-4 w-4 accent-[#b4532a]"
              />
              {r.label}
            </label>
          ))}
        </div>
      </div>

      {/* هنرمند / کارگاه */}
      <div className="pt-4">
        <span className="digi-label">هنرمند / کارگاه</span>
        <div className="max-h-56 space-y-2 overflow-y-auto thin-scroll">
          {shopOptions.map((s) => {
            const checked = currentShops.includes(s.slug);
            return (
              <label
                key={s.slug}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-[12px] transition-colors hover:bg-[#faf6ec]"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleShop(s.slug)}
                  className="h-4 w-4 accent-[#b4532a]"
                />
                {s.name}
              </label>
            );
          })}
        </div>
        <p className="mt-3 text-[10px] text-gray-400">{toFaDigits(shopOptions.length)} فروشگاه در هنربازار</p>
      </div>
    </aside>
  );
}
