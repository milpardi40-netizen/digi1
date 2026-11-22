import type { Metadata } from "next";
import Link from "next/link";
import { HERO, px } from "@/lib/images";
import {
  UserPlus,
  Upload,
  Banknote,
  CheckCircle2,
  X,
  Camera,
  Truck,
  BarChart3,
  ShieldCheck,
  BadgeCheck,
  Headset,
  ChevronLeft,
  Amphora,
  ArrowLeft,
  Store,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "فروش در هنربازار — بدون هزینه عضویت، فقط ۱۰٪ کمیسیون",
  description:
    "هنرمند هستید؟ آثار دست‌ساز خود را در هنربازار بفروشید: بدون هزینه عضویت، تسویه هفتگی، بسته‌بندی و ارسال با بیمه، پنل فروش حرفه‌ای و دسترسی به هزاران خریدار هنر دوست.",
};

const FAQ = [
  {
    q: "شرایط فروشندگی در هنربازار چیست؟",
    a: "هر هنرمندی که اثر دست‌ساز اصیل تولید می‌کند می‌تواند فروشنده شود؛ کافی است ثبت‌نام کنید، فروشگاه بسازید و اولین اثر خود را با عکس و توضیحات ثبت کنید. آثار باید اصیل، دست‌ساز و متعلق به خود هنرمند باشند.",
  },
  {
    q: "کمیسیون هنربازار چقدر است و چطور کسر می‌شود؟",
    a: "تنها ۱۰٪ از مبلغ نهایی هر فروش قطعی (پس از کسر تخفیف) به‌عنوان کمیسیون کسر می‌شود؛ یعنی ۹۰٪ مبلغ مستقیماً سهم شماست. اگر فروشگاه شما حجم فروش بالایی داشته باشد، کمیسیون اختصاصی کمتری اعمال می‌شود. هیچ هزینه عضویت یا هزینه ماهانه‌ای وجود ندارد.",
  },
  {
    q: "تسویه حساب با فروشندگان چطور انجام می‌شود؟",
    a: "مانده قابل برداشت شما از سفارش‌های تحویل‌داده‌شده محاسبه می‌شود. هر هفته می‌توانید از پنل فروشنده درخواست تسویه ثبت کنید؛ پس از تأیید ادمین هنربازار، مبلغ به حساب شما واریز می‌شود.",
  },
  {
    q: "ارسال سفارش با چه کسی است؟",
    a: "هنرمند سفارش را آماده و هنرمندانه بسته‌بندی می‌کند و هنربازار هماهنگی پیک/پست را انجام می‌دهد؛ بسته‌ها با بیمه و جعبه محافظ مناسب آثار هنری ارسال می‌شوند. هزینه ارسال از خریدار دریافت می‌شود و مستقیماً سهم شماست.",
  },
  {
    q: "اگر مشتری اثر را مرجوع کند چه می‌شود؟",
    a: "خریدار تا ۷ روز پس از تحویل، در صورت مغایرت اثر با توضیحات می‌تواند درخواست مرجوعی ثبت کند. هنربازار میانجی‌گری می‌کند؛ اگر اثر سالم باشد هزینه ارسال با خریدار است و در غیر این صورت با فروشنده.",
  },
  {
    q: "آیا آثار چاپ‌شده یا آثار دیگران را هم می‌توان فروخت؟",
    a: "خیر؛ هنربازار فقط آثار دست‌ساز اصیل خود هنرمند را می‌پذیرد. آثار چاپ انبوه، ماشینی یا آثار هنرمندان دیگر بدون اجازه کتبی، از فروشگاه حذف و حساب فروشنده تعلیق می‌شود.",
  },
];

export default function SellPage() {
  return (
    <div className="pb-16">
      {/* ── هیرو ── */}
      <div className="relative overflow-hidden bg-[#2b2118]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO.pottery} alt="دستان سفالگر در کارگاه" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-l from-[#2b2118] via-[#2b2118]/85 to-[#2b2118]/40" />
        <div className="container-digi relative grid items-center gap-8 py-12 lg:grid-cols-12 lg:py-16">
          <div className="lg:col-span-7">
            <span className="flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[10.5px] font-bold text-saffron backdrop-blur">
              <Sparkles size={13} />
              هنرمندان سراسر ایران، به هنربازار بپیوندید
            </span>
            <h1 className="mt-4 font-display text-3xl leading-[3rem] text-[#fbf7ee] sm:text-4xl sm:leading-[3.6rem]">
              اثرتان را به هزاران<br />خانه‌ی ایرانی برسانید
            </h1>
            <p className="mt-4 max-w-lg text-[12.5px] leading-8 text-white/85">
              هنربازار بازارچه آنلاین هنر و صنایع‌دستی ایران است؛ جایی که سفالگر لالجین، گلیم‌باف کردستان و خاتم‌کار اصفهان مستقیماً با خریدار ارتباط می‌گیرد — بدون واسطه، با قیمت کارگاه و با ضمانت اصالت.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/auth/register?role=seller"
                className="flex h-12 items-center gap-2 rounded-xl bg-saffron px-6 text-[13px] font-extrabold text-[#2b2118] shadow-lg transition hover:brightness-105"
              >
                شروع فروشندگی — رایگان
                <ArrowLeft size={17} />
              </Link>
              <a href="#commission" className="text-[12px] font-bold text-white/85 underline-offset-4 hover:underline">
                کمیسیون و شرایط را ببینید
              </a>
            </div>
            <div className="mt-6 flex flex-wrap gap-4 text-[10px] text-white/70">
              {["۰٪ هزینه عضویت", "۱۰٪ کمیسیون از فروش قطعی", "تسویه هفتگی", "پنل فروش حرفه‌ای"].map((t) => (
                <span key={t} className="flex items-center gap-1">
                  <CheckCircle2 size={13} className="text-saffron" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* کولاژ تصاویر آثار */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="relative mx-auto h-80 w-80 drop-shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={px(28271468, 400, 400)}
                alt="کاسه‌های فیروزه‌ای لالجین"
                className="absolute left-0 top-6 h-44 w-44 rounded-2xl border-4 border-[#2b2118] object-cover shadow-2xl"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={px(32980208, 400, 400)}
                alt="فانوس‌های موزائیک"
                className="absolute right-0 top-0 h-36 w-36 rounded-2xl border-4 border-[#2b2118] object-cover shadow-2xl"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={px(11135840, 400, 400)}
                alt="خوشنویسی نستعلیق"
                className="absolute bottom-4 right-16 h-40 w-40 rounded-2xl border-4 border-[#2b2118] object-cover shadow-2xl"
              />
              <div className="absolute bottom-24 left-2 rounded-xl bg-white/95 px-3 py-2 text-[9px] font-bold text-digi-text shadow-lg backdrop-blur">
                <span className="text-brand">۲۵۰+ اثر</span> فروخته‌شده این ماه
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── سه قدم ── */}
      <section className="container-digi mt-12">
        <h2 className="text-center font-display text-xl text-digi-text md:text-2xl">سه قدم تا اولین فروش</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {[
            { icon: UserPlus, step: "۱", title: "عضو شوید و فروشگاه بسازید", desc: "ثبت‌نام با شماره موبایل؛ نام فروشگاه و شهرتان را انتخاب کنید — کمتر از ۲ دقیقه." },
            { icon: Upload, step: "۲", title: "اثرتان را ثبت کنید", desc: "عکس باکیفیت، توضیح صادقانه، قیمت منصفانه و مشخصات فنی؛ اثر همان لحظه در ویترین قرار می‌گیرد." },
            { icon: Banknote, step: "۳", title: "فروش و تسویه هفتگی", desc: "با هر فروش، ۹۰٪ مبلغ سهم شماست؛ از پنل فروشنده درخواست تسویه دهید و هفتگی واریز بگیرید." },
          ].map(({ icon: Icon, step, title, desc }) => (
            <div key={step} className="relative rounded-2xl border border-digi-border/60 bg-white p-6 text-center">
              <span className="absolute right-4 top-4 text-[34px] font-black leading-none text-digi-border">{step}</span>
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-orange-50 text-brand">
                <Icon size={26} strokeWidth={1.6} />
              </span>
              <h3 className="mt-4 text-[13px] font-extrabold">{title}</h3>
              <p className="mt-1.5 text-[10.5px] leading-6 text-digi-muted">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── کمیسیون و شفافیت ── */}
      <section id="commission" className="container-digi mt-10 scroll-mt-24">
        <div className="grid gap-4 md:grid-cols-12">
          <div className="rounded-2xl border border-digi-border/60 bg-white p-6 md:col-span-7">
            <h2 className="font-display text-lg text-digi-text">هزینه‌ها؛ شفاف و صادقانه</h2>
            <p className="mt-1 text-[10.5px] text-digi-muted">ما فقط وقتی پول درمی‌آوریم که شما پول دربیاورید؛ هیچ هزینه پنهانی وجود ندارد.</p>
            <div className="mt-4 overflow-hidden rounded-xl border border-digi-border/70">
              <table className="w-full text-right text-[11.5px]">
                <thead>
                  <tr className="bg-[#faf6ec] text-digi-muted">
                    <th className="px-4 py-2.5 font-extrabold">مورد</th>
                    <th className="px-4 py-2.5 font-extrabold">هنربازار</th>
                    <th className="px-4 py-2.5 font-extrabold">گالری فیزیکی</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["هزینه عضویت", "رایگان", "معمولاً ۵–۲۰ میلیون تومان"],
                    ["کمیسیون فروش", "۱۰٪ از فروش قطعی", "۳۰ تا ۵۰٪"],
                    ["هزینه ماهانه", "ندارد", "اجاره و شارژ غرفه"],
                    ["تسویه", "هفتگی، از پنل شما", "ماهانه یا پس از فروش"],
                    ["ویترین آنلاین ۲۴/۷", "دارد", "محدود به ساعات کار"],
                    ["مخاطب", "هزاران خریدار از سراسر کشور", "بازدیدکنندگان همان محل"],
                  ].map(([a, b, c]) => (
                    <tr key={a} className="border-t border-digi-border/60">
                      <td className="px-4 py-2.5 font-bold text-digi-text">{a}</td>
                      <td className="px-4 py-2.5 text-emerald-700">{b}</td>
                      <td className="px-4 py-2.5 text-digi-muted">{c}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 p-6 md:col-span-5">
            <h3 className="flex items-center gap-2 text-[13px] font-extrabold text-brand-deep">
              <BadgeCheck size={18} />
              نشان فروشگاه تأییدشده
            </h3>
            <p className="mt-2 text-[10.5px] leading-6 text-digi-muted">
              پس از بررسی نمونه‌آثار توسط تیم هنربازار، نشان آبی «فروشگاه تأییدشده» می‌گیرید؛ خریداران به فروشگاه‌های تأییدشده ۳ برابر بیشتر اعتماد می‌کنند و نرخ تبدیل بالاتری دارند.
            </p>
            <h3 className="mt-5 flex items-center gap-2 text-[13px] font-extrabold text-brand-deep">
              <Banknote size={18} />
              نمونه محاسبه تسویه
            </h3>
            <div className="mt-2 rounded-xl border border-saffron/40 bg-white p-4 text-[10.5px] leading-7 text-digi-text">
              فرض کنید اثرتان را <strong>۸٬۵۰۰٬۰۰۰ تومان</strong> بفروشید:
              <div className="mt-1 flex justify-between border-t border-dashed border-digi-border pt-1">
                <span>کمیسیون هنربازار (۱۰٪)</span>
                <strong className="text-brand">۸۵۰٬۰۰۰</strong>
              </div>
              <div className="flex justify-between">
                <span>سهم خالص شما</span>
                <strong className="text-emerald-700">۷٬۶۵۰٬۰۰۰ تومان</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── خدمات و ابزارها ── */}
      <section className="container-digi mt-10">
        <h2 className="text-center font-display text-xl text-digi-text md:text-2xl">ابزارهای رشد شما در هنربازار</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
          {[
            { icon: Camera, t: "ویترین حرفه‌ای", d: "عکس، توضیح و مشخصات هر اثر با چیدمان استاندارد نمایش داده می‌شود." },
            { icon: Truck, t: "ارسال مطمئن", d: "بسته‌بندی محافظ + بیمه کالا تا سقف ارزش اثر؛ تحویل در تهران اکسپرس است." },
            { icon: BarChart3, t: "پنل فروش حرفه‌ای", d: "آمار فروش، بازدید، موجودی، سهم خالص و درخواست تسویه — همه در یک‌جا." },
            { icon: ShieldCheck, t: "گواهی اصالت", d: "هر اثر با برگه گواهی دست‌ساز بودن و شماره سریال ارسال می‌شود." },
            { icon: BadgeCheck, t: "اعتبارسنجی آثار", d: "تیم محتوا اصالت آثار جدید را پیش از انتشار بررسی می‌کند." },
            { icon: Headset, t: "پشتیبانی هنرمندان", d: "تیم پشتیبانی اختصاصی فروشندگان از شنبه تا پنجشنبه، ۹ صبح تا ۶ عصر." },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="rounded-2xl border border-digi-border/60 bg-white p-4 md:p-5">
              <Icon size={22} className="text-brand" strokeWidth={1.6} />
              <h3 className="mt-2 text-[12px] font-extrabold">{t}</h3>
              <p className="mt-1 text-[9.5px] leading-5 text-digi-muted">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── پرسش‌های متداول ── */}
      <section id="faq" className="container-digi mt-10 scroll-mt-24">
        <h2 className="font-display text-xl text-digi-text md:text-2xl">پرسش‌های متداول هنرمندان</h2>
        <div className="mt-4 divide-y divide-digi-border overflow-hidden rounded-2xl border border-digi-border/60 bg-white">
          {FAQ.map((item) => (
            <details key={item.q} className="group">
              <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-4 text-[12px] font-extrabold text-digi-text transition-colors hover:bg-[#faf6ec] [&::-webkit-details-marker]:hidden">
                {item.q}
                <ChevronLeft size={17} className="shrink-0 transition-transform group-open:rotate-90" />
              </summary>
              <div className="border-t border-digi-border/60 bg-[#fbf9f4] px-5 py-4 text-[11px] leading-7 text-digi-muted">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ── فراخوان نهایی ── */}
      <section className="container-digi mt-10">
        <div className="relative flex flex-col items-center gap-4 overflow-hidden rounded-3xl bg-[#2b2118] px-6 py-12 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO.lighting} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-30" />
          <Amphora size={36} className="relative text-saffron" strokeWidth={1.3} />
          <h2 className="relative font-display text-2xl text-[#fbf7ee]">هنر شما لایق دیده‌شدن است</h2>
          <p className="relative max-w-md text-[11px] leading-6 text-white/70">
            امروز ثبت‌نام کنید و همین امروز اولین اثرتان را در معرض هزاران خریدار هنر دوست قرار دهید.
          </p>
          <Link
            href="/auth/register?role=seller"
            className="relative flex h-12 items-center gap-2 rounded-xl bg-saffron px-8 text-[13px] font-extrabold text-[#2b2118] transition hover:brightness-105"
          >
            <Store size={18} />
            ساخت فروشگاه — کاملاً رایگان
          </Link>
          <p className="relative text-[9px] text-white/50">حساب آزمایشی فروشنده: 09120000001 / seller123</p>
        </div>
      </section>
    </div>
  );
}
