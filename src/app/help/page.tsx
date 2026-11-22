import type { Metadata } from "next";
import Link from "next/link";
import {
  ShoppingCart,
  Truck,
  RotateCcw,
  ShieldCheck,
  CreditCard,
  Headset,
  ChevronLeft,
  LifeBuoy,
} from "lucide-react";
import { HERO } from "@/lib/images";

export const metadata: Metadata = {
  title: "راهنمای خرید از هنربازار",
  description: "نحوه ثبت سفارش، روش‌های ارسال، شیوه‌های پرداخت، ضمانت اصالت آثار و رویه بازگشت کالا در هنربازار.",
};

const SECTIONS = [
  {
    id: "order",
    icon: ShoppingCart,
    title: "نحوه ثبت سفارش",
    items: [
      "اثر دلخواه را از دسته‌بندی‌ها، جستجو یا فروشگاه هنرمندان پیدا کنید و «افزودن به سبد خرید» را بزنید.",
      "در سبد خرید تعداد را تنظیم کنید و در صورت داشتن کد تخفیف (مثل HONAR10) آن را اعمال کنید.",
      "روی «ادامه فرایند خرید» بزنید؛ اگر وارد نشده‌اید، با شماره موبایل وارد شوید یا ثبت‌نام کنید.",
      "آدرس تحویل را انتخاب یا اضافه کنید، روش پرداخت را برگزینید و سفارش را نهایی کنید.",
      "وضعیت سفارش را همیشه از «حساب کاربری ← سفارش‌های من» پیگیری کنید.",
    ],
  },
  {
    id: "shipping",
    icon: Truck,
    title: "روش‌های ارسال و تحویل",
    items: [
      "سفارش‌های بالای ۲٬۰۰۰٬۰۰۰ تومان ارسال رایگان دارند؛ زیر این مبلغ، هزینه ارسال ۴۵٬۰۰۰ تومان است.",
      "هنرمند اثر را ظرف ۱ تا ۳ روز کاری آماده و با جعبه محافظ بسته‌بندی می‌کند.",
      "تحویل در تهران با پیک اکسپرس و در سایر شهرها با پست پیشتاز ۲ تا ۴ روزه انجام می‌شود.",
      "آثار شکستنی (سفال، شیشه، لوستر) با بیمه کامل تا سقف ارزش اثر ارسال می‌شوند.",
    ],
  },
  {
    id: "payment",
    icon: CreditCard,
    title: "شیوه‌های پرداخت",
    items: [
      "پرداخت اینترنتی امن از طریق درگاه‌های شاپرکی (زرین‌پال، آیدی‌پی، شاپرک) با همه کارت‌های بانکی.",
      "اطلاعات کارت شما فقط نزد بانک ثبت می‌شود و در سرورهای هنربازار ذخیره نمی‌شود.",
      "۹۰٪ مبلغ هر اثر مستقیماً سهم هنرمند است و ۱۰٪ کمیسیون هنربازار بابت خدمات پلتفرم کسر می‌شود.",
    ],
  },
  {
    id: "authenticity",
    icon: ShieldCheck,
    title: "ضمانت اصالت آثار",
    items: [
      "همه آثار هنربازار دست‌ساز و متعلق به خود هنرمند هستند؛ آثار چاپ انبوه یا ماشینی پذیرفته نمی‌شوند.",
      "فروشگاه‌های دارای نشان «تأییدشده» توسط کارشناسان هنربازار اعتبارسنجی شده‌اند.",
      "هر اثر همراه با برگه گواهی دست‌ساز بودن و شماره سریال کارگاه ارسال می‌شود.",
      "در صورت اثبات عدم اصالت، کل مبلغ بدون قید و شرط بازگردانده می‌شود.",
    ],
  },
  {
    id: "returns",
    icon: RotateCcw,
    title: "۷ روز مهلت تست و بازگشت کالا",
    items: [
      "تا ۷ روز پس از تحویل، در صورت مغایرت اثر با توضیحات یا آسیب در ارسال، درخواست مرجوعی ثبت کنید.",
      "اثر باید در بسته‌بندی اصلی و بدون استفاده بازگردانده شود.",
      "اگر مغایرت یا آسیب تأیید شود، هزینه ارسال برگشت با هنربازار/فروشنده است؛ در غیر این صورت با خریدار.",
      "مبلغ مرجوعی حداکثر ۷۲ ساعت پس از دریافت اثر به حساب شما بازگردانده می‌شود.",
    ],
  },
];

export default function HelpPage() {
  return (
    <div className="pb-12">
      {/* هیرو */}
      <div className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO.bazaar} alt="بازار صنایع‌دستی" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-l from-[#2b1a0e]/95 via-[#2b1a0e]/80 to-[#2b1a0e]/50" />
        <div className="container-digi relative py-12 text-[#fbf7ee]">
          <nav aria-label="breadcrumb" className="mb-2 flex items-center gap-1 text-[10.5px] text-white/70">
            <Link href="/" className="hover:underline">خانه</Link>
            <ChevronLeft size={11} />
            <span>راهنمای خرید</span>
          </nav>
          <h1 className="flex items-center gap-3 font-display text-3xl">
            <LifeBuoy size={30} className="text-saffron" />
            راهنمای خرید از هنربازار
          </h1>
          <p className="mt-2 max-w-xl text-[12px] leading-7 text-white/80">
            هر آنچه برای خرید مطمئن یک اثر دست‌ساز لازم دارید؛ از ثبت سفارش تا تحویل، پرداخت، ضمانت اصالت و بازگشت کالا.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {SECTIONS.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-[10.5px] font-bold backdrop-blur transition hover:bg-white/20">
                {s.title}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* بخش‌ها */}
      <div className="container-digi mt-6 grid gap-3 lg:grid-cols-12">
        <div className="space-y-3 lg:col-span-8">
          {SECTIONS.map(({ id, icon: Icon, title, items }) => (
            <section key={id} id={id} className="scroll-mt-28 rounded-2xl border border-digi-border/60 bg-white p-5 md:p-6">
              <h2 className="flex items-center gap-2.5 text-[15px] font-extrabold text-digi-text">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-50 text-brand">
                  <Icon size={20} />
                </span>
                {title}
              </h2>
              <ol className="mt-4 space-y-2.5">
                {items.map((item, i) => (
                  <li key={i} className="flex gap-3 text-[12px] leading-7 text-digi-muted">
                    <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#efe7d8] text-[10px] font-black text-digi-text">
                      {(i + 1).toLocaleString("fa-IR")}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>

        {/* کناری */}
        <aside className="h-fit space-y-3 lg:sticky lg:top-28 lg:col-span-4">
          <div className="rounded-2xl border border-digi-border/60 bg-white p-5">
            <h2 className="flex items-center gap-2 text-[13px] font-extrabold">
              <Headset size={17} className="text-brand" />
              پشتیبانی هنربازار
            </h2>
            <ul className="mt-3 space-y-2 text-[11.5px]">
              <li>
                <a href="tel:+982188880000" className="flex items-center justify-between rounded-lg bg-[#faf6ec] px-3 py-2 transition hover:bg-orange-50">
                  <span className="text-digi-muted">تلفن</span>
                  <span className="font-bold" dir="ltr">021-88880000</span>
                </a>
              </li>
              <li>
                <a href="mailto:support@honarbazar.ir" className="flex items-center justify-between rounded-lg bg-[#faf6ec] px-3 py-2 transition hover:bg-orange-50">
                  <span className="text-digi-muted">ایمیل</span>
                  <span className="font-bold" dir="ltr">support@honarbazar.ir</span>
                </a>
              </li>
            </ul>
            <p className="mt-2 text-[10px] text-gray-400">شنبه تا پنجشنبه، ۹ تا ۱۸</p>
          </div>
          <div className="rounded-2xl border border-digi-border/60 bg-white p-5 text-[11.5px]">
            <h2 className="text-[13px] font-extrabold">لینک‌های کاربردی</h2>
            <ul className="mt-3 space-y-2">
              {[
                { href: "/profile", label: "رهگیری سفارش‌های من" },
                { href: "/cart", label: "سبد خرید" },
                { href: "/featured", label: "منتخب سردبیر" },
                { href: "/sell", label: "فروش آثار در هنربازار" },
                { href: "/about", label: "درباره هنربازار" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="flex items-center justify-between text-digi-muted transition hover:text-brand">
                    {l.label}
                    <ChevronLeft size={13} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
