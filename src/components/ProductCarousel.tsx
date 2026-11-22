"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard, { type ProductCardData } from "@/components/ProductCard";

export default function ProductCarousel({
  title,
  href,
  products,
}: {
  title: string;
  href?: string;
  products: ProductCardData[];
}) {
  const scroller = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 640), behavior: "smooth" });
  };

  if (products.length === 0) return null;

  return (
    <section className="rounded-2xl border border-digi-border/60 bg-white p-3 md:p-4">
      <div className="mb-2 flex items-center justify-between px-1">
        <h2 className="text-[15px] font-extrabold text-digi-text">{title}</h2>
        <div className="flex items-center gap-1">
          {href && (
            <Link
              href={href}
              className="flex items-center gap-0.5 rounded-lg px-2 py-1 text-[11px] font-bold text-brand transition-colors hover:bg-red-50"
            >
              مشاهده همه
              <ChevronLeft size={14} />
            </Link>
          )}
          <button
            onClick={() => scrollBy(1)}
            aria-label="قبلی"
            className="grid h-8 w-8 place-items-center rounded-full border border-digi-border text-digi-muted transition hover:border-brand hover:text-brand"
          >
            <ChevronRight size={16} />
          </button>
          <button
            onClick={() => scrollBy(-1)}
            aria-label="بعدی"
            className="grid h-8 w-8 place-items-center rounded-full border border-digi-border text-digi-muted transition hover:border-brand hover:text-brand"
          >
            <ChevronLeft size={16} />
          </button>
        </div>
      </div>
      <div
        ref={scroller}
        className="scrollbar-hide snap-x-container flex gap-2 overflow-x-auto pb-1"
      >
        {products.map((p) => (
          <div key={p.id} className="snap-card w-[160px] shrink-0 border border-digi-border/50 rounded-xl sm:w-[180px]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
