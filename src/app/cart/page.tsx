"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Trash2,
  ShieldCheck,
  RotateCcw,
  ChevronLeft,
  TicketPercent,
  X,
  Loader2,
  Minus,
  Plus,
  Zap,
  ArrowLeft,
} from "lucide-react";
import { useCart } from "@/lib/cart";
import { useToast } from "@/lib/toast";
import { formatPrice, toFaDigits } from "@/lib/format";
import { usePromo } from "@/lib/use-promo";
import Price from "@/components/Price";

const FREE_SHIPPING_AT = 2_000_000;
const SHIPPING_COST = 45_000;

export default function CartPage() {
  const router = useRouter();
  const { items, count, total, savings, remove, setQuantity, clear, hydrated } = useCart();
  const { toast } = useToast();
  const { promo, loading: promoLoading, error: promoError, apply, removePromo } = usePromo();
  const [promoInput, setPromoInput] = useState("");

  const promoDiscount = promo ? Math.min(Math.floor((total * promo.percent) / 100), promo.maxDiscount) : 0;
  const shipping = total - promoDiscount >= FREE_SHIPPING_AT ? 0 : SHIPPING_COST;
  const payable = Math.max(0, total - promoDiscount + shipping);

  const applyPromo = async () => {
    const code = promoInput.trim();
    if (!code) return;
    const ok = await apply(code);
    if (ok) {
      setPromoInput("");
      toast("کد تخفیف با موفقیت اعمال شد");
    }
  };

  if (!hydrated) {
    return (
      <div className="container-digi py-10">
        <div className="h-72 animate-pulse rounded-2xl bg-white" />
      </div>
    );
  }

  /* ── سبد خالی ── */
  if (items.length === 0) {
    return (
      <div className="container-digi flex flex-col items-center gap-4 py-16 text-center">
        <div className="grid h-28 w-28 place-items-center rounded-full bg-white text-gray-300">
          <ShoppingCart size={52} strokeWidth={1.2} />
        </div>
        <h1 className="text-lg font-black text-digi-text">سبد خرید شما خالی است!</h1>
        <p className="max-w-xs text-[12px] leading-6 text-digi-muted">
          منتخب سردبیر هنربازار را ببینید و آثار دست‌ساز دوست‌داشتنی را به سبدتان اضافه کنید.
        </p>
        <div className="flex gap-2">
          <Link href="/featured" className="rounded-xl bg-brand px-6 py-3 text-[12px] font-bold text-white hover:bg-brand-deep">
            مشاهده منتخب سردبیر
          </Link>
          <Link href="/" className="rounded-xl border border-digi-border px-6 py-3 text-[12px] font-bold text-digi-text hover:border-brand hover:text-brand">
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-digi py-3 md:py-4">
      <nav className="mb-2 flex items-center gap-1 text-[10.5px] text-digi-muted" aria-label="breadcrumb">
        <Link href="/" className="hover:text-brand">خانه</Link>
        <ChevronLeft size={11} />
        <span className="text-digi-text">سبد خرید</span>
      </nav>

      <div className="grid gap-3 lg:grid-cols-12">
        {/* ── لیست کالاها ── */}
        <section className="rounded-2xl border border-digi-border/60 bg-white p-4 lg:col-span-8">
          <div className="flex items-center justify-between border-b border-digi-border pb-3">
            <div className="flex items-center gap-2">
              <ShoppingCart size={20} className="text-brand" />
              <h1 className="text-[15px] font-extrabold">سبد خرید شما</h1>
              <span className="text-[11px] text-digi-muted">({toFaDigits(count)} کالا)</span>
            </div>
            <button
              onClick={() => {
                clear();
                toast("سبد خرید خالی شد");
              }}
              className="flex items-center gap-1 text-[10.5px] font-bold text-digi-muted transition hover:text-brand"
            >
              <Trash2 size={14} />
              حذف همه
            </button>
          </div>

          <ul className="divide-y divide-digi-border/70">
            {items.map((item) => {
              const lineSavings = (item.originalPrice - item.price) * item.quantity;
              return (
                <li key={item.id} className="flex gap-3 py-4">
                  <Link
                    href={`/product/${item.slug}`}
                    className="grid h-24 w-24 shrink-0 place-items-center rounded-xl border border-digi-border/60 bg-[#fafafa] p-1 md:h-28 md:w-28"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link href={`/product/${item.slug}`} className="text-[12px] font-bold leading-5 text-digi-text line-clamp-2 hover:text-brand">
                      {item.name}
                    </Link>
                    {lineSavings > 0 && (
                      <span className="mt-1 w-fit rounded bg-red-50 px-1.5 py-0.5 text-[9.5px] font-bold text-brand">
                        سود شما: {formatPrice(lineSavings)} تومان
                      </span>
                    )}
                    <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                      <div className="flex items-center rounded-lg border border-digi-border">
                        <button onClick={() => setQuantity(item.id, item.quantity + 1)} aria-label="افزودن" className="grid h-8 w-8 place-items-center hover:text-brand">
                          <Plus size={14} />
                        </button>
                        <span className="w-7 text-center text-[12px] font-extrabold tabular-nums">{toFaDigits(item.quantity)}</span>
                        <button onClick={() => setQuantity(item.id, item.quantity - 1)} aria-label="کاهش" className="grid h-8 w-8 place-items-center hover:text-brand">
                          <Minus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => remove(item.id)}
                        aria-label="حذف کالا"
                        className="grid h-8 w-8 place-items-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-brand"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                  <div className="hidden shrink-0 sm:block">
                    <Price price={item.price * item.quantity} originalPrice={item.originalPrice * item.quantity} />
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-1 hidden border-t border-digi-border pt-3 sm:block">
            <p className="text-[10px] text-digi-muted">
              افزودن کالاهای بیشتر به سبد، ارسال شما را رایگان می‌کند. ارسال رایگان برای سفارش‌های بالای ۲٬۰۰۰٬۰۰۰ تومان.
            </p>
          </div>
        </section>

        {/* ── خلاصه سفارش + کد تخفیف ── */}
        <aside className="h-fit space-y-3 lg:sticky lg:top-24 lg:col-span-4">
          {/* کد تخفیف */}
          <div className="rounded-2xl border border-digi-border/60 bg-white p-4">
            <h2 className="flex items-center gap-1.5 text-[12px] font-extrabold">
              <TicketPercent size={16} className="text-brand" />
              کد تخفیف / کارت هدیه
            </h2>
            {promo ? (
              <div className="mt-2 flex items-center justify-between rounded-xl border border-emerald-dig/30 bg-emerald-50 px-3 py-2.5">
                <div>
                  <div className="font-mono text-[13px] font-bold text-emerald-dig" dir="ltr">{promo.code}</div>
                  <div className="text-[10px] text-emerald-700">
                    {toFaDigits(promo.percent)}٪ تخفیف تا سقف {formatPrice(promo.maxDiscount)} تومان
                  </div>
                </div>
                <button onClick={removePromo} aria-label="حذف کد تخفیف" className="grid h-8 w-8 place-items-center rounded-lg text-emerald-700 hover:bg-emerald-100">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <div className="mt-2 flex gap-2">
                  <input
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Enter" && applyPromo()}
                    placeholder="مثلاً DIGI20"
                    dir="ltr"
                    className="digi-input flex-1 font-mono text-left"
                  />
                  <button
                    onClick={applyPromo}
                    disabled={promoLoading}
                    className="grid h-11 w-12 shrink-0 place-items-center rounded-xl border border-brand text-brand transition hover:bg-red-50 disabled:opacity-50"
                    aria-label="اعمال کد تخفیف"
                  >
                    {promoLoading ? <Loader2 size={18} className="animate-spin" /> : <ArrowLeft size={18} />}
                  </button>
                </div>
                {promoError && <p className="mt-1.5 text-[10px] font-bold text-brand">{promoError}</p>}
                <p className="mt-1.5 text-[9.5px] text-gray-400">کدهای تست: DIGI20 · WELCOME · SUPER50</p>
              </>
            )}
          </div>

          {/* خلاصه */}
          <div className="rounded-2xl border border-digi-border/60 bg-white p-4">
            <h2 className="text-[13px] font-extrabold">خلاصه سفارش</h2>
            <dl className="mt-3 space-y-2 text-[12px]">
              <div className="flex items-center justify-between text-digi-muted">
                <dt>قیمت کالاها ({toFaDigits(count)})</dt>
                <dd className="tabular-nums">{formatPrice(total)} تومان</dd>
              </div>
              <div className="flex items-center justify-between text-emerald-dig">
                <dt>سود شما از خرید</dt>
                <dd className="tabular-nums">- {formatPrice(savings)} تومان</dd>
              </div>
              {promoDiscount > 0 && (
                <div className="flex items-center justify-between text-emerald-dig">
                  <dt>کد تخفیف {promo?.code}</dt>
                  <dd className="tabular-nums">- {formatPrice(promoDiscount)} تومان</dd>
                </div>
              )}
              <div className="flex items-center justify-between text-digi-muted">
                <dt>هزینه ارسال</dt>
                <dd>{shipping === 0 ? <span className="font-bold text-emerald-dig">رایگان</span> : `${formatPrice(shipping)} تومان`}</dd>
              </div>
            </dl>
            <div className="my-3 border-t border-dashed border-digi-border" />
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold">مبلغ قابل پرداخت</span>
              <span className="text-[17px] font-black tabular-nums text-brand">
                {formatPrice(payable)} <span className="text-[10px] font-medium text-digi-muted">تومان</span>
              </span>
            </div>
            <button
              onClick={() => router.push("/checkout")}
              className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand text-[13px] font-extrabold text-white shadow-sm transition hover:bg-brand-deep active:scale-[0.99]"
            >
              ادامه فرایند خرید
              <ChevronLeft size={17} />
            </button>
            <div className="mt-3 flex items-center justify-center gap-4 text-[9.5px] text-digi-muted">
              <span className="flex items-center gap-1"><ShieldCheck size={12} className="text-emerald-dig" /> ضمانت مرجوعی کالا</span>
              <span className="flex items-center gap-1"><RotateCcw size={12} className="text-[#fa8c16]" /> ۷ روز تست رایگان</span>
              <span className="flex items-center gap-1"><Zap size={12} className="text-blue-600" /> ارسال اکسپرس</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
