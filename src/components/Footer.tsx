"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  Send,
  Phone,
  Mail,
  MapPin,
  Camera,
  AtSign,
  Globe,
  Amphora,
  Banknote,
  ShieldCheck,
  Store,
} from "lucide-react";
import { useToast } from "@/lib/toast";

const columns: Array<{ title: string; links: Array<{ label: string; href: string }> }> = [
  {
    title: "هنربازار",
    links: [
      { label: "درباره هنربازار", href: "/about" },
      { label: "فروش در هنربازار", href: "/sell" },
      { label: "همه فروشگاه‌ها", href: "/shops" },
      { label: "منتخب سردبیر", href: "/featured" },
      { label: "راهنمای خرید", href: "/help" },
    ],
  },
  {
    title: "برای خریداران",
    links: [
      { label: "نحوه ثبت سفارش", href: "/help#order" },
      { label: "روش‌های ارسال و تحویل", href: "/help#shipping" },
      { label: "شیوه‌های پرداخت", href: "/help#payment" },
      { label: "ضمانت اصالت آثار", href: "/help#authenticity" },
      { label: "۷ روز مهلت تست و بازگشت", href: "/help#returns" },
      { label: "رهگیری سفارش", href: "/profile" },
    ],
  },
  {
    title: "برای هنرمندان",
    links: [
      { label: "شرایط فروشندگی", href: "/sell" },
      { label: "کمیسیون و تسویه حساب", href: "/sell#commission" },
      { label: "ثبت‌نام فروشنده", href: "/auth/register?role=seller" },
      { label: "پنل فروشندگان", href: "/seller" },
      { label: "پرسش‌های متداول", href: "/sell#faq" },
    ],
  },
];

/** آدرس صفحات اجتماعی — پس از ساخت حساب‌ها، فقط همین‌جا را به‌روز کنید */
const SOCIAL = [
  { icon: Camera, href: "https://www.instagram.com/honarbazar.ir", label: "اینستاگرام هنربازار" },
  { icon: Send, href: "https://t.me/honarbazar_ir", label: "کانال تلگرام هنربازار" },
  { icon: AtSign, href: "https://x.com/honarbazar_ir", label: "ایکس (توییتر) هنربازار" },
  { icon: Globe, href: "https://www.aparat.com/honarbazar", label: "آپارات هنربازار" },
];

export default function Footer() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  const subscribe = (e: FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      toast("لطفاً یک ایمیل معتبر وارد کنید");
      return;
    }
    setEmail("");
    toast("ایمیل شما در خبرنامه هنربازار ثبت شد");
  };

  return (
    <footer className="border-t border-digi-border bg-[#fbf9f4] text-digi-text">
      {/* ── نوار خبرنامه ── */}
      <div className="border-b border-digi-border">
        <div className="container-digi flex flex-col items-center justify-between gap-3 py-4 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-orange-100 text-brand">
              <Send size={20} />
            </div>
            <div>
              <div className="text-[13px] font-extrabold">خبرنامه هنربازار</div>
              <div className="text-[11px] text-digi-muted">تازه‌های کارگاه‌ها و آثار منتخب را از دست ندهید.</div>
            </div>
          </div>
          <form onSubmit={subscribe} className="flex w-full max-w-md gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ایمیل شما…"
              dir="ltr"
              className="digi-input flex-1 text-left"
              aria-label="ایمیل خبرنامه"
            />
            <button
              type="submit"
              className="shrink-0 rounded-lg bg-brand px-5 text-[12px] font-bold text-white transition hover:bg-brand-deep"
            >
              عضویت
            </button>
          </form>
        </div>
      </div>

      {/* ── ستون‌ها ── */}
      <div className="container-digi grid gap-8 py-8 md:grid-cols-12">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:col-span-8">
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="mb-3 text-[13px] font-extrabold">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-[11.5px] text-digi-muted transition-colors hover:text-brand">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div>
            <h3 className="mb-3 text-[13px] font-extrabold">ارتباط با ما</h3>
            <ul className="space-y-2 text-[11.5px] text-digi-muted">
              <li><a href="tel:+982188880000" className="flex items-center gap-1.5 transition-colors hover:text-brand" dir="ltr"><Phone size={13} /> 021-88880000</a></li>
              <li><a href="mailto:support@honarbazar.ir" className="flex items-center gap-1.5 transition-colors hover:text-brand" dir="ltr"><Mail size={13} /> support@honarbazar.ir</a></li>
              <li className="flex items-start gap-1.5"><MapPin size={13} className="mt-0.5 shrink-0" /> تهران، خیابان جمهوری، کوچه هنر، پلاک ۱۷</li>
              <li className="text-[10.5px] text-gray-400">پاسخگویی شنبه تا پنجشنبه، ۹ تا ۱۸</li>
            </ul>
          </div>
        </div>

        {/* باکس فروشندگان + نمادها */}
        <div className="md:col-span-4">
          <h3 className="mb-3 text-[13px] font-extrabold">هنرمندان بپیوندند</h3>
          <Link
            href="/sell"
            className="flex items-center gap-3 rounded-2xl border border-brand/30 bg-orange-50 p-4 transition-all hover:shadow-md"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand text-white">
              <Store size={22} />
            </span>
            <span>
              <span className="block text-[12px] font-extrabold text-brand-deep">بدون هزینه عضویت</span>
              <span className="mt-0.5 block text-[10px] leading-5 text-digi-muted">تنها ۱۰٪ کمیسیون از فروش واقعی — تسویه هفتگی</span>
            </span>
          </Link>
          <h3 className="mb-2 mt-5 text-[13px] font-extrabold">اعتماد و ضمانت</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { t: "ضمانت اصالت اثر", s: "دست‌ساز بودن" },
              { t: "زرین‌پال", s: "پرداخت امن" },
              { t: "ساماندهی", s: "وزارت فرهنگ و ارشاد" },
            ].map((b) => (
              <div
                key={b.t}
                className="flex h-16 w-24 flex-col items-center justify-center rounded-lg border border-digi-border bg-white p-1 text-center"
              >
                <ShieldCheck size={16} className="mb-1 text-emerald-dig" />
                <span className="text-[8px] font-bold leading-3">{b.t}</span>
                <span className="text-[7px] text-digi-muted">{b.s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── متن معرفی ── */}
      <div className="border-t border-digi-border">
        <div className="container-digi py-4">
          <p className="text-[11px] leading-6 text-digi-muted">
            <strong className="text-digi-text">هنربازار؛</strong> بازارچه آنلاین هنر و صنایع‌دستی ایران است؛ جایی که هنرمندان سراسر کشور — از سفالگران لالجین و گلیم‌بافان کردستان تا خاتم‌کاران اصفهان و سوزن‌دوزان بلوچستان — آثار دست‌ساز خود را مستقیماً به دست خریداران می‌رسانند. هر خرید یعنی حمایت مستقیم از هنرمند و ماندگاری هنر ایرانی.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-gray-400">
            <span>پرطرفدار: گلدان سفالی لالجینی</span>•<span>گلیم کردستان</span>•<span>فیروزه‌کوبی نیشابور</span>•<span>سوزن‌دوزی بلوچی</span>•<span>چرم دست‌دوز تبریز</span>•<span>قاب خاتم</span>•<span>تابلو رنگ روغن</span>
          </div>
        </div>
      </div>

      {/* ── نوار پایین ── */}
      <div className="border-t border-digi-border bg-white">
        <div className="container-digi flex h-12 flex-wrap items-center justify-between gap-2 text-[10.5px] text-digi-muted">
          <span className="flex items-center gap-1.5"><Amphora size={13} className="text-brand" /> © هنربازار؛ کلیه حقوق برای هنرمندان محفوظ است.</span>
          <span className="hidden md:inline">سهم هنرمندان از هر فروش: <Banknote size={12} className="inline text-emerald-dig" /> ۹۰٪ مبلغ کالا</span>
          <div className="flex items-center gap-2">
            {SOCIAL.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="grid h-7 w-7 place-items-center rounded-full border border-digi-border text-digi-muted transition-colors hover:border-brand hover:text-brand"
              >
                <Icon size={13} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
