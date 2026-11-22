import Link from "next/link";
import { BadgeCheck, MapPin, ArrowLeft } from "lucide-react";
import { toFaDigits } from "@/lib/format";
import { shopCover } from "@/lib/images";

export default function ShopCard({
  shop,
  productsCount,
  wide = false,
}: {
  shop: {
    name: string;
    slug: string;
    city: string;
    story: string;
    avatarColor: string;
    verified: boolean;
  };
  productsCount?: number;
  wide?: boolean;
}) {
  return (
    <Link
      href={`/shop/${shop.slug}`}
      className={`group flex shrink-0 flex-col overflow-hidden rounded-2xl border border-digi-border/60 bg-white transition-all hover:-translate-y-1 hover:shadow-[0_16px_44px_rgba(41,36,31,0.18)] ${
        wide ? "w-full" : "w-60"
      }`}
    >
      {/* کاور */}
      <div className="relative h-28 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={shopCover(shop.slug)}
          alt={shop.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        {shop.verified && (
          <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-bold text-accent backdrop-blur">
            <BadgeCheck size={11} /> تأییدشده
          </span>
        )}
      </div>
      {/* آواتار + نام */}
      <div className="relative flex flex-1 flex-col px-4 pb-3">
        <span
          className="-mt-7 grid h-14 w-14 place-items-center rounded-2xl border-4 border-white text-2xl font-black text-white shadow-md"
          style={{ backgroundColor: shop.avatarColor }}
        >
          {shop.name.trim().charAt(0)}
        </span>
        <h3 className="mt-1.5 line-clamp-1 text-[12.5px] font-extrabold leading-5 text-digi-text">{shop.name}</h3>
        <p className="mt-0.5 flex items-center gap-1 text-[9.5px] text-digi-muted">
          <MapPin size={10} />
          {shop.city}
        </p>
        <p className="mt-2 h-10 text-[10px] leading-5 text-digi-muted line-clamp-2">{shop.story}</p>
        <div className="mt-auto flex items-center justify-between border-t border-digi-border/60 pt-2.5">
          {productsCount !== undefined && (
            <span className="text-[9.5px] font-bold text-digi-muted">{toFaDigits(productsCount)} اثر</span>
          )}
          <span className="flex items-center gap-0.5 text-[10px] font-bold text-brand transition-all group-hover:gap-1.5">
            بازدید از فروشگاه
            <ArrowLeft size={12} />
          </span>
        </div>
      </div>
    </Link>
  );
}
