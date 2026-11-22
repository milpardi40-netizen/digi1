"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Truck,
  ShieldCheck,
  Lock,
  MapPin,
  Plus,
  CheckCircle2,
  Loader2,
  Home,
  Building2,
  CircleAlert,
  CreditCard,
  Zap,
} from "lucide-react";
import { useCart } from "@/lib/cart";
import { useToast } from "@/lib/toast";
import { usePromo } from "@/lib/use-promo";
import { formatPrice, toFaDigits } from "@/lib/format";
import AddressForm, { type AddressRow } from "@/components/AddressForm";

const FREE_SHIPPING_AT = 2_000_000;
const SHIPPING_COST = 45_000;

const GATEWAYS = [
  { id: "zarinpal", name: "زرین‌پال", desc: "پرداخت امن و آنی از همه بانک‌ها", color: "#ffb02e" },
  { id: "idpay", name: "آیدی‌پی", desc: "کسر مستقیم از حساب و کیف پول", color: "#00b4d8" },
  { id: "shaparak", name: "شاپرک", desc: "درگاه یکپارچه بانک مرکزی", color: "#00a049" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, count, total, savings, clear, hydrated } = useCart();
  const { toast } = useToast();
  const { promo, removePromo } = usePromo();

  const [authState, setAuthState] = useState<"loading" | "ok" | "guest">("loading");
  const [addresses, setAddresses] = useState<AddressRow[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [addingAddress, setAddingAddress] = useState(false);
  const [gateway, setGateway] = useState("zarinpal");
  const [note, setNote] = useState("");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  /* احراز هویت و دریافت آدرس‌ها */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const meRes = await fetch("/api/auth/me", { cache: "no-store" });
        if (cancelled) return;
        if (!meRes.ok) {
          setAuthState("guest");
          return;
        }
        setAuthState("ok");
        const addrRes = await fetch("/api/addresses", { cache: "no-store" });
        const addrData = await addrRes.json();
        if (cancelled) return;
        const list: AddressRow[] = addrData.addresses ?? [];
        setAddresses(list);
        if (list.length > 0) setSelectedAddress(list[0].id);
        else setAddingAddress(true);
      } catch {
        if (!cancelled) setAuthState("guest");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (authState === "guest") {
      router.replace("/auth/login?next=/checkout");
    }
  }, [authState, router]);

  const promoDiscount = promo ? Math.min(Math.floor((total * promo.percent) / 100), promo.maxDiscount) : 0;
  const shipping = total - promoDiscount >= FREE_SHIPPING_AT ? 0 : SHIPPING_COST;
  const payable = Math.max(0, total - promoDiscount + shipping);

  const placeOrder = async () => {
    setError("");
    if (!selectedAddress) {
      setError("لطفاً آدرس تحویل را انتخاب یا اضافه کنید");
      return;
    }
    setPlacing(true);
    // شبیه‌سازی اتصال به درگاه بانکی
    await new Promise((r) => setTimeout(r, 1600));
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
          addressId: selectedAddress,
          promoCode: promo?.code,
          note,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "خطا در ثبت سفارش");
        setPlacing(false);
        return;
      }
      clear();
      localStorage.removeItem("digi-promo");
      toast("سفارش شما با موفقیت ثبت شد");
      router.replace(`/checkout/success?id=${data.id}`);
    } catch {
      setError("ارتباط با سرور برقرار نشد؛ لطفاً دوباره تلاش کنید");
      setPlacing(false);
    }
  };

  if (!hydrated || authState === "loading") {
    return (
      <div className="container-digi space-y-3 py-4">
        <div className="h-24 animate-pulse rounded-2xl bg-white" />
        <div className="h-96 animate-pulse rounded-2xl bg-white" />
      </div>
    );
  }

  if (authState === "guest") {
    return (
      <div className="container-digi py-16 text-center text-[13px] text-digi-muted">
        در حال انتقال به صفحه ورود…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-digi flex flex-col items-center gap-3 py-16 text-center">
        <h1 className="text-lg font-black">سبد خرید شما خالی است</h1>
        <p className="text-[12px] text-digi-muted">برای ثبت سفارش ابتدا کالایی به سبد اضافه کنید.</p>
        <Link href="/featured" className="rounded-xl bg-brand px-6 py-3 text-[12px] font-bold text-white">
          رفتن به منتخب سردبیر
        </Link>
      </div>
    );
  }

  return (
    <div className="container-digi py-3 md:py-4">
      {/* ── نشانگر مراحل خرید ── */}
      <div className="mb-4 flex items-center justify-center gap-0 text-[10px] md:text-[11px]">
        {[
          { step: 1, label: "سبد خرید", state: "done" },
          { step: 2, label: "ثبت و پرداخت", state: "active" },
          { step: 3, label: "دریافت سفارش", state: "pending" },
        ].map(({ step, label, state }, i) => (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <span
                className={`grid h-7 w-7 place-items-center rounded-full text-[12px] font-black ${
                  state === "done"
                    ? "bg-emerald-dig text-white"
                    : state === "active"
                      ? "bg-brand text-white"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {state === "done" ? <CheckCircle2 size={17} /> : toFaDigits(step)}
              </span>
              <span className={`font-bold ${state === "pending" ? "text-gray-400" : "text-digi-text"}`}>{label}</span>
            </div>
            {i < 2 && <div className={`mx-2 mb-5 h-0.5 w-14 md:w-32 ${i === 0 ? "bg-emerald-dig" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>

      <h1 className="mb-2 text-[16px] font-black md:text-xl">ثبت و پرداخت سفارش</h1>

      <div className="grid gap-3 lg:grid-cols-12">
        {/* ── ستون اصلی ── */}
        <div className="space-y-3 lg:col-span-8">
          {/* آدرس تحویل */}
          <section className="rounded-2xl border border-digi-border/60 bg-white p-4 md:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-[13px] font-extrabold">
                <MapPin size={17} className="text-brand" />
                آدرس تحویل سفارش
              </h2>
              <button
                onClick={() => setAddingAddress((v) => !v)}
                className="flex items-center gap-1 rounded-lg border border-digi-border px-3 py-1.5 text-[11px] font-bold text-digi-text transition hover:border-brand hover:text-brand"
              >
                <Plus size={14} />
                افزودن آدرس جدید
              </button>
            </div>

            <div className="space-y-2">
              {addresses.map((addr) => {
                const selected = selectedAddress === addr.id;
                return (
                  <label
                    key={addr.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all ${
                      selected ? "border-brand bg-red-50/50 ring-1 ring-brand/40" : "border-digi-border hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={selected}
                      onChange={() => setSelectedAddress(addr.id)}
                      className="mt-1 h-4 w-4 accent-[#ef394e]"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-digi-text">
                          {addr.title === "خانه" ? <Home size={11} /> : <Building2 size={11} />}
                          {addr.title}
                        </span>
                        <span className="text-[11px] font-extrabold">{addr.recipient}</span>
                        <span className="text-[10px] text-digi-muted" dir="ltr">{addr.phone}</span>
                      </span>
                      <span className="mt-1 block text-[11px] leading-6 text-digi-muted">
                        {addr.province}، {addr.city} — {addr.address}
                        {addr.plaque ? `، پلاک ${addr.plaque}` : ""}
                        {addr.unit ? `، واحد ${addr.unit}` : ""}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>

            {addingAddress && (
              <div className="mt-3 rounded-xl border border-dashed border-digi-border bg-[#fcfcfd] p-4">
                <h3 className="mb-2 text-[11px] font-extrabold text-digi-muted">آدرس جدید</h3>
                <AddressForm
                  submitLabel="ذخیره و انتخاب آدرس"
                  onSaved={(addr) => {
                    setAddresses((list) => [addr, ...list]);
                    setSelectedAddress(addr.id);
                    setAddingAddress(false);
                  }}
                />
              </div>
            )}
          </section>

          {/* روش ارسال */}
          <section className="rounded-2xl border border-digi-border/60 bg-white p-4 md:p-5">
            <h2 className="mb-3 flex items-center gap-2 text-[13px] font-extrabold">
              <Truck size={17} className="text-blue-600" />
              روش ارسال
            </h2>
            <div className="flex items-center gap-3 rounded-xl border border-brand/40 bg-red-50/40 p-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-blue-600 shadow-sm">
                <Zap size={20} />
              </span>
              <div className="flex-1">
                <div className="text-[12px] font-extrabold">ارسال اکسپرس (ارسال در همان روز / فردا)</div>
                <div className="text-[10px] text-digi-muted">ویژه تهران بزرگ؛ سایر شهرها از طریق پست پیشتاز ۲ روزه</div>
              </div>
              <div className="text-left text-[11px] font-extrabold">
                {shipping === 0 ? (
                  <span className="text-emerald-dig">رایگان</span>
                ) : (
                  <span>{formatPrice(SHIPPING_COST)} <span className="text-[9px] font-medium text-digi-muted">تومان</span></span>
                )}
              </div>
            </div>
          </section>

          {/* درگاه پرداخت */}
          <section className="rounded-2xl border border-digi-border/60 bg-white p-4 md:p-5">
            <h2 className="mb-3 flex items-center gap-2 text-[13px] font-extrabold">
              <CreditCard size={17} className="text-emerald-dig" />
              روش پرداخت
            </h2>
            <div className="grid gap-2 sm:grid-cols-3">
              {GATEWAYS.map((g) => {
                const selected = gateway === g.id;
                return (
                  <label
                    key={g.id}
                    className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all ${
                      selected ? "border-brand ring-1 ring-brand/40" : "border-digi-border hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="gateway"
                      value={g.id}
                      checked={selected}
                      onChange={() => setGateway(g.id)}
                      className="sr-only"
                    />
                    <span className="h-6 w-10 rounded-md" style={{ backgroundColor: g.color }} />
                    <span className="text-[12px] font-extrabold">{g.name}</span>
                    <span className="text-[8.5px] leading-4 text-digi-muted">{g.desc}</span>
                  </label>
                );
              })}
            </div>

            <label htmlFor="order-note" className="digi-label mt-4">یادداشت برای فروشنده (اختیاری)</label>
            <textarea
              id="order-note"
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="مثلاً: لطفاً قبل از ارسال هماهنگ کنید…"
              className="digi-input resize-none"
            />
          </section>
        </div>

        {/* ── خلاصه و دکمه پرداخت ── */}
        <aside className="h-fit lg:sticky lg:top-24 lg:col-span-4">
          <div className="rounded-2xl border border-digi-border/60 bg-white p-4 md:p-5">
            <h2 className="text-[13px] font-extrabold">مرور سفارش ({toFaDigits(count)} کالا)</h2>
            <ul className="mt-2 max-h-44 space-y-2 overflow-y-auto thin-scroll">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-2 text-[10.5px]">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg border border-digi-border/60 bg-[#fafafa]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.name} className="h-10 w-10 object-cover" loading="lazy" />
                  </span>
                  <span className="line-clamp-1 flex-1 leading-5 text-digi-text">{item.name}</span>
                  <span className="shrink-0 font-bold text-digi-muted">×{toFaDigits(item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="my-3 border-t border-dashed border-digi-border" />
            <dl className="space-y-2 text-[11.5px]">
              <div className="flex justify-between text-digi-muted"><dt>جمع کل کالاها</dt><dd className="tabular-nums">{formatPrice(total)} تومان</dd></div>
              <div className="flex justify-between text-emerald-dig"><dt>سود شما از خرید</dt><dd className="tabular-nums">- {formatPrice(savings)}</dd></div>
              {promoDiscount > 0 && (
                <div className="flex items-center justify-between text-emerald-dig">
                  <dt>کد تخفیف {promo?.code}</dt>
                  <dd className="flex items-center gap-1">
                    <span className="tabular-nums">- {formatPrice(promoDiscount)}</span>
                    <button onClick={removePromo} aria-label="حذف کد" className="text-gray-400 hover:text-brand">×</button>
                  </dd>
                </div>
              )}
              <div className="flex justify-between text-digi-muted"><dt>هزینه ارسال</dt><dd>{shipping === 0 ? <span className="font-bold text-emerald-dig">رایگان</span> : `${formatPrice(shipping)} تومان`}</dd></div>
            </dl>
            <div className="my-3 border-t border-digi-border" />
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold">مبلغ قابل پرداخت</span>
              <span className="text-[18px] font-black tabular-nums text-brand">
                {formatPrice(payable)} <span className="text-[10px] font-medium text-digi-muted">تومان</span>
              </span>
            </div>

            {error && (
              <div className="mt-3 flex items-start gap-2 rounded-xl border border-brand/30 bg-red-50 px-3 py-2 text-[10.5px] font-bold leading-5 text-brand">
                <CircleAlert size={15} className="mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            <button
              onClick={placeOrder}
              disabled={placing}
              className="mt-3 flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-brand py-4 text-[13.5px] font-extrabold text-white shadow transition hover:bg-brand-deep disabled:cursor-wait disabled:opacity-80"
            >
              {placing ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  در حال انتقال به درگاه پرداخت…
                </>
              ) : (
                <>
                  <Lock size={18} />
                  پرداخت اینترنتی و ثبت نهایی سفارش
                </>
              )}
            </button>
            <p className="mt-2 flex items-center justify-center gap-1.5 text-[9px] text-digi-muted">
              <ShieldCheck size={12} className="text-emerald-dig" />
              اطلاعات کارت شما نزد بانک محفوظ می‌ماند و در سرور هنربازار ذخیره نمی‌شود.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
