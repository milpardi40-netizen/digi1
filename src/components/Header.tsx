"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  Store,
  Truck,
  ChevronDown,
  ChevronLeft,
  Scroll,
  Amphora,
  Scissors,
  Handbag,
  Brush,
  Gem,
  TreePine,
  Hammer,
  Gift,
  Shapes,
  Layers,
  LampCeiling,
  Home,
  Package,
  BadgePercent,
  Store as StoreIcon,
  type LucideIcon,
} from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice, toFaDigits } from "@/lib/format";

/* ───────── مگامنوی دسته‌بندی هنر و صنایع‌دستی ───────── */
type MegaLink = { label: string; q: string };
type MegaColumn = { heading: string; links: MegaLink[] };
type MegaCategory = {
  slug: string;
  name: string;
  icon: LucideIcon;
  color: string;
  columns: MegaColumn[];
};

const MEGA: MegaCategory[] = [
  {
    slug: "carpet",
    name: "فرش و گلیم",
    icon: Scroll,
    color: "#b4532a",
    columns: [
      {
        heading: "دستباف کردستان",
        links: [
          { label: "گلیم کردستان", q: "گلیم" },
          { label: "جاجیم پشمی", q: "جاجیم" },
          { label: "قالیچه شیراز", q: "قالیچه" },
        ],
      },
      {
        heading: "بر اساس کاربرد",
        links: [
          { label: "دیوارکوب", q: "دیوارکوب" },
          { label: "رومیزی و زیرانداز", q: "گلیم" },
          { label: "تابلو فرش", q: "تابلو فرش" },
        ],
      },
    ],
  },
  {
    slug: "pottery",
    name: "سفال و سرامیک",
    icon: Amphora,
    color: "#0f766e",
    columns: [
      {
        heading: "سفال لالجین",
        links: [
          { label: "گلدان فیروزه‌ای", q: "گلدان" },
          { label: "ظرف سرو گل و مرغ", q: "گل و مرغ" },
          { label: "لیوان قهوه‌خوری", q: "لیوان" },
          { label: "سرویس کاسه فیروزه‌ای", q: "کاسه" },
        ],
      },
      {
        heading: "بر اساس کاربرد",
        links: [
          { label: "سرویس پذیرایی", q: "سفال" },
          { label: "دکوراسیون", q: "گلدان" },
        ],
      },
    ],
  },
  {
    slug: "textile",
    name: "نساجی و سوزن‌دوزی",
    icon: Scissors,
    color: "#7c2d12",
    columns: [
      {
        heading: "سوزن‌دوزی بلوچی",
        links: [
          { label: "سفره سوزن‌دوزی", q: "سوزن‌دوزی" },
          { label: "رومیزی ترمه", q: "ترمه" },
          { label: "تابلوی دست‌های هنرمند", q: "دست‌های هنرمند" },
        ],
      },
    ],
  },
  {
    slug: "leather",
    name: "چرم دست‌دوز",
    icon: Handbag,
    color: "#44403c",
    columns: [
      {
        heading: "کارگاه چرم میزان",
        links: [
          { label: "کیف دوشی کویر", q: "کویر" },
          { label: "کیف دستی مراکشی", q: "مراکشی" },
          { label: "کیف بازار تبریز", q: "بازار تبریز" },
        ],
      },
    ],
  },
  {
    slug: "painting",
    name: "نقاشی و خوشنویسی",
    icon: Brush,
    color: "#6d28d9",
    columns: [
      {
        heading: "نگارستان",
        links: [
          { label: "دشت لاله — رنگ روغن", q: "دشت لاله" },
          { label: "انتزاعی بافت زنده", q: "انتزاعی" },
          { label: "نقاشی کارگاهی", q: "در حال اجرا" },
          { label: "خوشنویسی نستعلیق «عشق»", q: "نستعلیق" },
        ],
      },
    ],
  },
  {
    slug: "jewelry",
    name: "زیورآلات هنری",
    icon: Gem,
    color: "#0e7490",
    columns: [
      {
        heading: "فیروزه نیشابور",
        links: [
          { label: "گردنبند نقره ۹۲۵", q: "گردنبند" },
          { label: "دستبند فیروزه‌کوب", q: "دستبند" },
          { label: "انگشتر عقیق", q: "انگشتر" },
        ],
      },
    ],
  },
  {
    slug: "wood",
    name: "صنایع چوبی و خاتم",
    icon: TreePine,
    color: "#92400e",
    columns: [
      {
        heading: "خاتم اصفهان",
        links: [
          { label: "قاب خاتم اسلیمی", q: "قاب خاتم" },
          { label: "جعبه خاتم هندسی", q: "جعبه خاتم" },
          { label: "جعبه جواهرات منبت", q: "جعبه جواهرات" },
          { label: "صندوقچه منبت‌کاری گردو", q: "صندوقچه" },
        ],
      },
    ],
  },
  {
    slug: "metal",
    name: "فلز و قلمزنی",
    icon: Hammer,
    color: "#57534e",
    columns: [
      {
        heading: "قلمزنی اصفهان",
        links: [
          { label: "بشقاب شکارگاه", q: "شکارگاه" },
          { label: "ست سرو مسی با سینی", q: "ست سرو مسی" },
        ],
      },
    ],
  },
  {
    slug: "decor",
    name: "سوغات و دکوراسیون",
    icon: Gift,
    color: "#be185d",
    columns: [
      {
        heading: "سوغات شیراز",
        links: [
          { label: "تابلو فرش نارنجستان", q: "نارنجستان" },
          { label: "گلدان کوهپایه", q: "کوهپایه" },
        ],
      },
    ],
  },
  {
    slug: "pattern",
    name: "طرح و پترن",
    icon: Shapes,
    color: "#7e22ce",
    columns: [
      {
        heading: "باتیک دستی",
        links: [
          { label: "شال باتیک ابریشم", q: "شال باتیک" },
          { label: "ست ۳ شال باتیک هندسی", q: "ست ۳ شال" },
          { label: "رانر میز شاه‌عباسی", q: "رانر" },
        ],
      },
      {
        heading: "چاپ بلاک",
        links: [
          { label: "پارچه کتان چاپ بلاک", q: "چاپ بلاک" },
          { label: "پارچه باتیک متری", q: "پارچه باتیک" },
        ],
      },
      {
        heading: "پانل هنری",
        links: [{ label: "پانل «کویر در شب»", q: "کویر" }],
      },
    ],
  },
  {
    slug: "felt",
    name: "نمد و نمدمالی",
    icon: Layers,
    color: "#a16207",
    columns: [
      {
        heading: "نمد دستی نمدینه",
        links: [
          { label: "کیف نمدی گل آبی", q: "کیف نمدی" },
          { label: "پاپوش قشقایی", q: "پاپوش" },
          { label: "کلاه نمدی سنتی", q: "کلاه نمدی" },
        ],
      },
      {
        heading: "هدیه و دکوری",
        links: [
          { label: "کیف نمدی طرح گوزن", q: "گوزن" },
          { label: "عروسک کفش نمدی", q: "عروسک نمدی" },
          { label: "ست پاپوش عروس و داماد", q: "ست ۴ پاپوش" },
        ],
      },
    ],
  },
  {
    slug: "lighting",
    name: "صنایع روشنایی",
    icon: LampCeiling,
    color: "#ca8a04",
    columns: [
      {
        heading: "موزائیک شیشه‌ای",
        links: [
          { label: "لوستر ۹ تایی دست‌ساز", q: "لوستر موزائیک" },
          { label: "آباژور کنار مبلی", q: "آباژور" },
          { label: "فانوس مراکشی", q: "فانوس مراکشی" },
        ],
      },
      {
        heading: "کارگاه چراغ‌چی",
        links: [
          { label: "لوستر برنجی ۶ پارچه", q: "لوستر برنجی" },
          { label: "سری ۳ فانوس رنگارنگ", q: "سری ۳ فانوس" },
          { label: "آویز موزائیک سلجوقی", q: "سلجوقی" },
        ],
      },
    ],
  },
];

type Suggestion = {
  id: number;
  slug: string;
  name: string;
  image: string;
  price: number;
};

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { count } = useCart();

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [activeCat, setActiveCat] = useState(0);
  const [user, setUser] = useState<{ name: string; role?: string } | null | undefined>(undefined);
  const debounce = useRef<number | undefined>(undefined);

  useEffect(() => {
    setSuggestOpen(false);
    setMegaOpen(false);
  }, [pathname]);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setUser(d?.user ?? null))
      .catch(() => setUser(null));
  }, [pathname]);

  useEffect(() => {
    window.clearTimeout(debounce.current);
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    debounce.current = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(query)}&limit=6`);
        const data = await res.json();
        setSuggestions(data.products ?? []);
      } catch {
        setSuggestions([]);
      }
    }, 250);
    return () => window.clearTimeout(debounce.current);
  }, [query]);

  const submitSearch = (e?: FormEvent) => {
    e?.preventDefault();
    const q = query.trim();
    setSuggestOpen(false);
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  };

  const active = MEGA[activeCat];

  return (
    <header className="sticky top-0 z-40 bg-[#fbf9f4] shadow-[0_1px_0_0_#e6ddcd]">
      {/* ─── نوار بالایی ─── */}
      <div className="hidden border-b border-digi-border lg:block">
        <div className="container-digi flex h-9 items-center justify-between text-[11px] text-digi-muted">
          <div className="flex items-center gap-2">
            <Truck size={14} className="text-brand" />
            <span>ارسال رایگان سفارش‌های بالای ۲٬۰۰۰٬۰۰۰ تومان</span>
            <span className="text-gray-300">|</span>
            <span>ضمانت اصالت تمام آثار دست‌ساز</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/sell" className="font-bold text-brand transition-colors hover:text-brand-deep">
              فروش در هنربازار
            </Link>
            <Link href="/shops" className="transition-colors hover:text-brand">
              همه فروشگاه‌ها
            </Link>
            <Link href="/profile" className="transition-colors hover:text-brand">
              رهگیری سفارش
            </Link>
            <Link href="/help" className="transition-colors hover:text-brand">
              راهنمای خرید
            </Link>
          </nav>
        </div>
      </div>

      {/* ─── ردیف اصلی ─── */}
      <div className="container-digi flex h-16 items-center gap-3 md:gap-5">
        {/* لوگو */}
        <Link href="/" className="flex shrink-0 select-none items-center gap-2" aria-label="هنربازار — خانه">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-brand shadow-sm">
            <svg viewBox="0 0 64 64" className="h-7 w-7" aria-hidden>
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
          <div className="leading-tight">
            <div className="font-display text-[26px] leading-none tracking-wide text-brand">هنربازار</div>
            <div className="hidden text-[8.5px] font-medium text-digi-muted sm:block">بازارچه آنلاین هنر و صنایع‌دستی</div>
          </div>
        </Link>

        {/* جستجو — دسکتاپ */}
        <form onSubmit={submitSearch} className="relative mx-auto hidden w-full max-w-2xl md:block" role="search">
          <Search size={19} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSuggestOpen(true);
            }}
            onFocus={() => setSuggestOpen(true)}
            type="text"
            aria-label="جستجو در آثار هنری"
            placeholder="جستجو در آثار هنری و صنایع‌دستی…"
            className="h-11 w-full rounded-xl border border-transparent bg-[#efe9dd] pe-4 ps-12 text-[13px] outline-none transition placeholder:text-gray-400 focus:border-brand/30 focus:bg-white focus:ring-2 focus:ring-brand/15"
          />
          {suggestOpen && (
            <>
              <button type="button" aria-hidden className="fixed inset-0 z-10 cursor-default" onClick={() => setSuggestOpen(false)} />
              <div className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-digi-border bg-white shadow-2xl">
                {suggestions.length > 0 ? (
                  <>
                    <div className="border-b border-digi-border px-4 py-2 text-[11px] font-bold text-digi-muted">
                      آثار پیشنهادی
                    </div>
                    {suggestions.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => router.push(`/product/${s.slug}`)}
                        className="flex w-full items-center gap-3 px-4 py-2 text-right transition-colors hover:bg-[#faf6ec]"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={s.image} alt={s.name} className="h-11 w-11 rounded-lg object-cover" />
                        <span className="min-w-0 flex-1 truncate text-[12px] text-digi-text">{s.name}</span>
                        <span className="shrink-0 text-[11px] font-bold text-brand">{formatPrice(s.price)}</span>
                      </button>
                    ))}
                    <button
                      type="submit"
                      className="flex w-full items-center justify-center gap-1 border-t border-digi-border bg-[#fbf9f4] px-4 py-2.5 text-[12px] font-bold text-brand transition-colors hover:bg-orange-50"
                    >
                      جستجوی «{query}» در همه آثار
                      <ChevronLeft size={14} />
                    </button>
                  </>
                ) : (
                  query.trim().length >= 2 && (
                    <button
                      type="submit"
                      className="flex w-full items-center justify-center gap-1 px-4 py-3 text-[12px] font-bold text-brand"
                    >
                      جستجوی «{query}»
                      <ChevronLeft size={14} />
                    </button>
                  )
                )}
              </div>
            </>
          )}
        </form>

        {/* اکشن‌های دسکتاپ */}
        <div className="ms-auto hidden shrink-0 items-center gap-2 md:flex">
          <Link
            href="/sell"
            className="flex h-10 items-center gap-1.5 rounded-lg bg-brand px-3 text-[12px] font-bold text-white shadow-sm transition hover:bg-brand-deep"
          >
            <Store size={16} />
            فروش در هنربازار
          </Link>
          {user === undefined ? (
            <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-100" />
          ) : user ? (
            <Link
              href={user.role === "seller" ? "/seller" : user.role === "admin" ? "/admin" : "/profile"}
              className="flex h-10 items-center gap-2 rounded-lg border border-digi-border px-3 text-[12px] font-bold transition-colors hover:border-brand hover:text-brand"
            >
              <User size={18} />
              <span className="max-w-28 truncate">{user.name.split(" ")[0]}</span>
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="flex h-10 items-center gap-2 rounded-lg border border-digi-border px-3 text-[12px] font-bold transition-colors hover:border-brand hover:text-brand"
            >
              <User size={18} />
              ورود | ثبت‌نام
            </Link>
          )}
          <Link
            href="/cart"
            aria-label="سبد خرید"
            className="relative flex h-10 items-center gap-2 rounded-lg border border-digi-border px-3 text-[12px] font-bold transition-colors hover:border-brand hover:text-brand"
          >
            <ShoppingCart size={19} />
            <span className="hidden xl:inline">سبد خرید</span>
            {count > 0 && (
              <span className="absolute -top-2 left-2 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-black text-white ring-2 ring-[#fbf9f4]">
                {toFaDigits(count)}
              </span>
            )}
          </Link>
        </div>

        {/* اکشن موبایل */}
        <Link
          href="/cart"
          aria-label="سبد خرید"
          className="relative ms-auto grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-digi-border md:hidden"
        >
          <ShoppingCart size={20} />
          {count > 0 && (
            <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-black text-white ring-2 ring-[#fbf9f4]">
              {toFaDigits(count)}
            </span>
          )}
        </Link>
      </div>

      {/* جستجوی موبایل */}
      <form onSubmit={submitSearch} className="container-digi pb-2 md:hidden" role="search">
        <div className="relative">
          <Search size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="جستجو در آثار هنری"
            placeholder="جستجو در آثار هنری…"
            className="h-10 w-full rounded-xl bg-[#efe9dd] pe-10 ps-3 text-[13px] outline-none focus:ring-2 focus:ring-brand/20"
          />
        </div>
      </form>

      {/* ─── ناوبری + مگامنو ─── */}
      <div className="hidden border-t border-digi-border lg:block">
        <div className="container-digi flex h-11 items-center gap-6 text-[12.5px]">
          <div
            className="relative h-full"
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
          >
            <button
              className="flex h-full items-center gap-1.5 font-bold text-digi-text transition-colors hover:text-brand"
              aria-expanded={megaOpen}
            >
              <Menu size={17} />
              همه دسته‌بندی‌های هنر
              <ChevronDown size={14} className={`transition-transform ${megaOpen ? "rotate-180" : ""}`} />
            </button>
            {megaOpen && (
              <div className="absolute right-0 top-full z-30 flex w-[880px] overflow-hidden rounded-b-2xl border border-digi-border bg-white shadow-2xl">
                <div className="w-64 shrink-0 border-l border-digi-border bg-[#faf6ec] py-2">
                  {MEGA.map((cat, i) => {
                    const Icon = cat.icon;
                    const isActive = i === activeCat;
                    return (
                      <Link
                        key={cat.slug}
                        href={`/category/${cat.slug}`}
                        onMouseEnter={() => setActiveCat(i)}
                        className={`flex items-center gap-2.5 px-4 py-2.5 text-[12px] transition-colors ${
                          isActive ? "bg-white font-bold text-brand" : "text-digi-text hover:bg-white"
                        }`}
                      >
                        <span
                          className="grid h-8 w-8 place-items-center rounded-lg"
                          style={{ backgroundColor: `${cat.color}1a`, color: cat.color }}
                        >
                          <Icon size={17} />
                        </span>
                        <span className="flex-1">{cat.name}</span>
                        <ChevronLeft size={14} className={isActive ? "opacity-100" : "opacity-0"} />
                      </Link>
                    );
                  })}
                </div>
                <div className="flex-1 p-5">
                  <div className="mb-3 flex items-center justify-between border-b border-digi-border pb-3">
                    <span className="text-[13px] font-extrabold text-digi-text">{active.name}</span>
                    <Link href={`/category/${active.slug}`} className="text-[11px] font-bold text-brand hover:underline">
                      مشاهده همه آثار این دسته
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    {active.columns.map((col) => (
                      <div key={col.heading}>
                        <div className="mb-2 text-[11px] font-extrabold text-gray-400">{col.heading}</div>
                        <ul className="space-y-1.5">
                          {col.links.map((l) => (
                            <li key={l.label}>
                              <Link
                                href={`/search?q=${encodeURIComponent(l.q)}`}
                                className="text-[12px] text-digi-text transition-colors hover:text-brand"
                              >
                                {l.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link href="/shops" className="flex items-center gap-1 font-bold text-digi-text transition-colors hover:text-brand">
            <StoreIcon size={15} />
            فروشگاه‌های هنرمندان
          </Link>
          <Link href="/search?sort=sales" className="text-digi-muted transition-colors hover:text-brand">
            پرفروش‌ترین آثار
          </Link>
          <Link href="/search?sort=discount" className="flex items-center gap-1 text-digi-muted transition-colors hover:text-brand">
            <BadgePercent size={15} />
            آثار با تخفیف
          </Link>
        </div>
      </div>

      {/* ─── ناوبری پایین اپلیکیشن (موبایل) ─── */}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid h-14 grid-cols-5 border-t border-digi-border bg-[#fbf9f4]/95 backdrop-blur md:hidden">
        {[
          { href: "/", icon: Home, label: "خانه" },
          { href: "/shops", icon: Store, label: "فروشگاه‌ها" },
          { href: "/sell", icon: Package, label: "فروش اثر" },
          { href: "/cart", icon: ShoppingCart, label: "سبد خرید", badge: count },
          { href: user ? (user.role === "seller" ? "/seller" : user.role === "admin" ? "/admin" : "/profile") : "/auth/login", icon: User, label: user ? "حساب من" : "ورود" },
        ].map(({ href, icon: Icon, label, badge }) => (
          <Link
            key={label}
            href={href}
            className="relative flex flex-col items-center justify-center gap-0.5 text-digi-muted transition-colors active:text-brand"
          >
            <Icon size={19} />
            <span className="text-[9px] font-medium">{label}</span>
            {badge ? (
              <span className="absolute right-1/2 top-1 grid h-4 min-w-4 translate-x-4 place-items-center rounded-full bg-brand px-1 text-[9px] font-black text-white">
                {toFaDigits(badge)}
              </span>
            ) : null}
          </Link>
        ))}
      </nav>
    </header>
  );
}
