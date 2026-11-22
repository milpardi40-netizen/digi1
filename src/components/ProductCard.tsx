"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, ShoppingCart, Check, Sparkles } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useToast } from "@/lib/toast";
import Price from "@/components/Price";
import Rating from "@/components/Rating";

export type ProductCardData = {
  id: number;
  slug: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  rating: string | number;
  ratingsCount: number;
  isFeatured?: boolean;
  salesCount?: number;
  shopName?: string;
  shopSlug?: string;
};

const FAV_KEY = "honarbazar-favorites";

export default function ProductCard({ product }: { product: ProductCardData }) {
  const { add, has } = useCart();
  const { toast } = useToast();
  const [fav, setFav] = useState(false);
  const inCart = has(product.id);

  useEffect(() => {
    try {
      const favs: number[] = JSON.parse(localStorage.getItem(FAV_KEY) ?? "[]");
      setFav(favs.includes(product.id));
    } catch {
      /* ignore */
    }
  }, [product.id]);

  const toggleFav = () => {
    try {
      const favs: number[] = JSON.parse(localStorage.getItem(FAV_KEY) ?? "[]");
      const next = favs.includes(product.id)
        ? favs.filter((i) => i !== product.id)
        : [...favs, product.id];
      localStorage.setItem(FAV_KEY, JSON.stringify(next));
      setFav(!fav);
      toast(!fav ? "به علاقه‌مندی‌ها افزوده شد" : "از علاقه‌مندی‌ها حذف شد");
    } catch {
      /* ignore */
    }
  };

  const addToCart = () => {
    add({
      id: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      price: product.price,
      originalPrice: product.originalPrice,
    });
    toast("اثر به سبد خرید اضافه شد");
  };

  return (
    <div className="group relative flex h-full flex-col rounded-xl bg-white p-3 transition-shadow duration-200 hover:shadow-[0_10px_36px_rgba(41,36,31,0.14)]">
      {/* نشان منتخب سردبیر + علاقه‌مندی */}
      <div className="pointer-events-none absolute left-2 right-2 top-2 z-10 flex items-start justify-between">
        {product.isFeatured ? (
          <span className="flex items-center gap-0.5 rounded-md bg-gradient-to-l from-saffron to-amber-600 px-1.5 py-0.5 text-[10px] font-black text-white shadow-sm">
            <Sparkles size={11} fill="currentColor" /> منتخب سردبیر
          </span>
        ) : (
          <span />
        )}
        <button
          onClick={toggleFav}
          aria-label="علاقه‌مندی"
          className="pointer-events-auto grid h-8 w-8 place-items-center rounded-full bg-white/90 shadow-sm ring-1 ring-gray-100 backdrop-blur transition hover:scale-110"
        >
          <Heart size={16} className={fav ? "text-brand" : "text-gray-400"} fill={fav ? "currentColor" : "none"} />
        </button>
      </div>

      {/* تصویر */}
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-[#efe7d8]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      </Link>

      {/* هنرمند */}
      {product.shopName && (
        <Link
          href={product.shopSlug ? `/shop/${product.shopSlug}` : `/search?q=${encodeURIComponent(product.shopName)}`}
          className="mt-2 w-fit text-[9.5px] font-bold text-accent transition-colors hover:underline"
        >
          {product.shopName}
        </Link>
      )}

      {/* نام */}
      <Link href={`/product/${product.slug}`} className="mt-0.5 block">
        <h3 className="h-10 text-[12px] font-medium leading-5 text-digi-text line-clamp-2 transition-colors group-hover:text-brand">
          {product.name}
        </h3>
      </Link>

      {/* امتیاز */}
      <div className="mt-1.5 flex items-center justify-between">
        <Rating rating={Number(product.rating)} count={product.ratingsCount} size={12} />
        {product.salesCount ? (
          <span className="text-[10px] text-gray-400">
            +{product.salesCount.toLocaleString("fa-IR")} فروش
          </span>
        ) : null}
      </div>

      {/* قیمت + دکمه سبد */}
      <div className="mt-auto flex items-end justify-between gap-1 pt-2">
        <button
          onClick={addToCart}
          aria-label="افزودن به سبد خرید"
          title={inCart ? "افزودن دوباره" : "افزودن به سبد خرید"}
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white shadow-sm transition-all hover:brightness-105 active:scale-90 ${
            inCart ? "bg-emerald-dig" : "bg-brand"
          }`}
        >
          {inCart ? <Check size={17} /> : <ShoppingCart size={17} />}
        </button>
        <Link href={`/product/${product.slug}`} className="min-w-0">
          <Price price={product.price} originalPrice={product.originalPrice} />
        </Link>
      </div>
    </div>
  );
}
