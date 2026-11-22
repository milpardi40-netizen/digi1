import { formatPrice, discountPercent, toFaDigits } from "@/lib/format";

/** نمایش قیمت با تخفیف و خط‌خورده */
export default function Price({
  price,
  originalPrice,
  size = "md",
}: {
  price: number;
  originalPrice: number;
  size?: "sm" | "md" | "lg";
}) {
  const off = discountPercent(price, originalPrice);
  const priceSize =
    size === "lg" ? "text-2xl" : size === "sm" ? "text-[13px]" : "text-base";

  return (
    <div className="flex flex-col items-end gap-0.5">
      {off > 0 && (
        <div className="flex items-center gap-1.5">
          <span className="rounded-md bg-brand px-1.5 py-0.5 text-[11px] font-bold leading-4 text-white">
            {toFaDigits(off)}٪
          </span>
          <span className="text-[11px] text-gray-400 line-through">
            {formatPrice(originalPrice)}
          </span>
        </div>
      )}
      <div className="flex items-baseline gap-1">
        <span className={`${priceSize} font-extrabold tracking-tight text-digi-text`}>
          {formatPrice(price)}
        </span>
        <span className="text-[10px] font-medium text-digi-muted">تومان</span>
      </div>
    </div>
  );
}
