const faDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toFaDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => faDigits[Number(d)]);
}

const priceFmt = new Intl.NumberFormat("fa-IR");

/** ۱۲٬۵۰۰٬۰۰۰ */
export function formatPrice(n: number): string {
  return priceFmt.format(Math.round(n));
}

/** ۱۲٬۵۰۰٬۰۰۰ تومان */
export function formatPriceToman(n: number): string {
  return `${formatPrice(n)} تومان`;
}

export function discountPercent(price: number, original: number): number {
  if (!original || original <= price) return 0;
  return Math.round((1 - price / original) * 100);
}

export function formatCompactFa(n: number): string {
  if (n >= 1_000_000) return `${toFaDigits((n / 1_000_000).toFixed(1))} میلیون`;
  if (n >= 1_000) return `${toFaDigits(Math.round(n / 1_000))} هزار`;
  return toFaDigits(n);
}

export function formatDateFa(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("fa-IR", { dateStyle: "long" }).format(date);
}

export function formatDateTimeFa(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("fa-IR", { dateStyle: "long", timeStyle: "short" }).format(date);
}
