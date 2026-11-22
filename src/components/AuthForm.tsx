"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UserRound,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CircleAlert,
  LogIn,
  UserPlus,
  Store,
  ShoppingBag,
  MapPin,
  Wand2,
} from "lucide-react";
import { useToast } from "@/lib/toast";

export default function AuthForm({
  mode,
  next = "/",
  initialRole = "buyer",
}: {
  mode: "login" | "register";
  next?: string;
  initialRole?: "buyer" | "seller";
}) {
  const router = useRouter();
  const { toast } = useToast();
  const isLogin = mode === "login";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState<"buyer" | "seller">(initialRole);
  const [shopName, setShopName] = useState("");
  const [shopCity, setShopCity] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isLogin && role === "seller") {
      if (shopName.trim().length < 3) {
        setError("نام فروشگاه را وارد کنید (حداقل ۳ کاراکتر)");
        return;
      }
      if (shopCity.trim().length < 2) {
        setError("شهر فروشگاه را وارد کنید");
        return;
      }
    }

    setLoading(true);
    try {
      const res = await fetch(isLogin ? "/api/auth/login" : "/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isLogin
            ? { phone, password }
            : { name, phone, password, accountType: role, shopName: shopName.trim(), shopCity: shopCity.trim() }
        ),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "خطایی رخ داد؛ دوباره تلاش کنید");
        return;
      }
      toast(
        isLogin
          ? `خوش آمدید، ${data.user?.name?.split(" ")[0] ?? ""}!`
          : role === "seller"
            ? "فروشگاه شما ساخته شد؛ به هنربازار خوش آمدید!"
            : "ثبت‌نام شما با موفقیت انجام شد"
      );
      const fallback = role === "seller" ? "/seller" : "/";
      router.replace(next.startsWith("/") ? next : fallback);
      router.refresh();
    } catch {
      setError("ارتباط با سرور برقرار نشد");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (kind: "buyer" | "seller" | "admin") => {
    setPhone(kind === "buyer" ? "09123456789" : kind === "seller" ? "09120000001" : "09000000000");
    setPassword(kind === "buyer" ? "123456" : kind === "seller" ? "seller123" : "admin123");
  };

  return (
    <div className="container-digi flex items-center justify-center py-8 md:py-12">
      <div className="w-full max-w-md">
        {/* لوگو */}
        <div className="mb-5 flex flex-col items-center gap-2 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand shadow-md">
            <svg viewBox="0 0 64 64" className="h-9 w-9" aria-hidden>
              <path
                d="M20 14h24M23.5 14c0 7-7.5 9.5-7.5 18.5A16 16 0 0 0 48 32.5C48 23.5 40.5 21 40.5 14"
                stroke="#fbf7ee"
                fill="none"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="font-display text-2xl text-brand">{isLogin ? "ورود به هنربازار" : "عضویت در هنربازار"}</h1>
          <p className="text-[11px] text-digi-muted">
            {isLogin ? "شماره موبایل و رمز عبور خود را وارد کنید" : "خرید از هنرمندان — یا خودتان هنرمند شوید"}
          </p>
        </div>

        <form onSubmit={submit} className="rounded-2xl border border-digi-border/60 bg-white p-6 shadow-sm">
          {error && (
            <div className="mb-3 flex items-start gap-2 rounded-xl border border-brand/30 bg-orange-50 px-3 py-2.5 text-[11px] font-bold leading-5 text-brand">
              <CircleAlert size={15} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          {!isLogin && (
            <>
              {/* انتخاب نوع حساب */}
              <div className="mb-4 grid grid-cols-2 gap-2" role="radiogroup" aria-label="نوع حساب">
                {[
                  { value: "buyer" as const, icon: ShoppingBag, title: "خریدار", sub: "خرید آثار هنری" },
                  { value: "seller" as const, icon: Store, title: "فروشنده", sub: "فروش آثار هنری" },
                ].map(({ value, icon: Icon, title, sub }) => {
                  const selected = role === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setRole(value)}
                      className={`flex flex-col items-center gap-1 rounded-xl border p-3 transition-all ${
                        selected ? "border-brand bg-orange-50 ring-2 ring-brand/25" : "border-digi-border hover:border-brand/50"
                      }`}
                    >
                      <Icon size={22} className={selected ? "text-brand" : "text-digi-muted"} />
                      <span className={`text-[12px] font-extrabold ${selected ? "text-brand" : "text-digi-text"}`}>{title}</span>
                      <span className="text-[9px] text-digi-muted">{sub}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mb-3">
                <label htmlFor="name" className="digi-label">نام و نام خانوادگی</label>
                <div className="relative">
                  <UserRound size={17} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    minLength={3}
                    placeholder="مثلاً: علی محمدی"
                    className="digi-input ps-10"
                  />
                </div>
              </div>

              {/* فیلدهای فروشگاه (فقط فروشنده) */}
              {role === "seller" && (
                <div className="mb-3 grid grid-cols-2 gap-2 rounded-xl border border-saffron/40 bg-amber-50/60 p-3">
                  <div className="col-span-2 text-[10px] font-extrabold text-amber-800">اطلاعات فروشگاه (فعال‌سازی فوری، بدون هزینه)</div>
                  <div className="col-span-2">
                    <label htmlFor="shopName" className="digi-label">نام فروشگاه *</label>
                    <div className="relative">
                      <Store size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        id="shopName"
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        placeholder="مثلاً: گالری سفال لالجین"
                        className="digi-input ps-9"
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="shopCity" className="digi-label">شهر فروشگاه *</label>
                    <div className="relative">
                      <MapPin size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        id="shopCity"
                        value={shopCity}
                        onChange={(e) => setShopCity(e.target.value)}
                        placeholder="مثلاً: اصفهان"
                        className="digi-input ps-9"
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="mb-3">
            <label htmlFor="phone" className="digi-label">شماره موبایل</label>
            <div className="relative">
              <Phone size={17} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, "").slice(0, 11))}
                required
                inputMode="numeric"
                dir="ltr"
                placeholder="09123456789"
                className="digi-input ps-10 text-left font-mono"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="digi-label">رمز عبور</label>
            <div className="relative">
              <Lock size={17} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder={isLogin ? "رمز عبور شما" : "حداقل ۶ کاراکتر"}
                className="digi-input ps-10 pe-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "پنهان کردن رمز" : "نمایش رمز"}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-digi-text"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand text-[13px] font-extrabold text-white transition hover:bg-brand-deep disabled:opacity-60"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : isLogin ? (
              <LogIn size={18} />
            ) : (
              <UserPlus size={18} />
            )}
            {isLogin ? "ورود به حساب" : role === "seller" ? "ثبت‌نام و ساخت فروشگاه" : "ثبت‌نام و ورود خودکار"}
          </button>

          {isLogin && (
            <div className="mt-2 grid grid-cols-3 gap-2">
              {[
                { kind: "buyer" as const, label: "خریدار نمونه" },
                { kind: "seller" as const, label: "فروشنده نمونه" },
                { kind: "admin" as const, label: "ادمین" },
              ].map(({ kind, label }) => (
                <button
                  key={kind}
                  type="button"
                  onClick={() => fillDemo(kind)}
                  className="flex h-9 items-center justify-center gap-1 rounded-lg border border-dashed border-digi-border text-[9.5px] font-bold text-digi-muted transition hover:border-brand hover:text-brand"
                >
                  <Wand2 size={12} />
                  {label}
                </button>
              ))}
            </div>
          )}
        </form>

        <p className="mt-4 text-center text-[11.5px] text-digi-muted">
          {isLogin ? (
            <>حساب ندارید؟ <Link href={`/auth/register${next !== "/" ? `?next=${next}` : ""}`} className="font-bold text-brand hover:underline">ثبت‌نام کنید</Link></>
          ) : (
            <>قبلاً ثبت‌نام کرده‌اید؟ <Link href={`/auth/login${next !== "/" ? `?next=${next}` : ""}`} className="font-bold text-brand hover:underline">وارد شوید</Link></>
          )}
        </p>
      </div>
    </div>
  );
}
