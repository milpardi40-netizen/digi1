import type { Metadata } from "next";
import Link from "next/link";
import { HeartHandshake, Store, ShieldCheck, Sprout, ArrowLeft, ChevronLeft } from "lucide-react";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { shops, products } from "@/db/schema";
import { HERO, px } from "@/lib/images";
import { toFaDigits } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "درباره هنربازار",
  description: "هنربازار بازارچه آنلاین هنر و صنایع‌دستی ایران است؛ پلی مستقیم میان هنرمندان کارگاه‌های سراسر کشور و دوستداران هنر.",
};

export default async function AboutPage() {
  const [[shopAgg], [productAgg]] = await Promise.all([
    db.select({ n: sql<number>`count(*)::int` }).from(shops),
    db.select({ n: sql<number>`count(*)::int` }).from(products),
  ]);

  return (
    <div className="pb-12">
      <div className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO.pottery} alt="هنرمند سفالگر" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-l from-[#2b1a0e]/95 via-[#2b1a0e]/75 to-[#2b1a0e]/30" />
        <div className="container-digi relative py-16 text-[#fbf7ee]">
          <nav aria-label="breadcrumb" className="mb-2 flex items-center gap-1 text-[10.5px] text-white/70">
            <Link href="/" className="hover:underline">خانه</Link>
            <ChevronLeft size={11} />
            <span>درباره ما</span>
          </nav>
          <h1 className="font-display text-4xl leading-[3.4rem]">هنر ایرانی، از دست هنرمند<br />تا خانه شما</h1>
          <p className="mt-3 max-w-xl text-[12.5px] leading-8 text-white/85">
            هنربازار با یک باور ساده شکل گرفت: هنرمند باید سهم واقعی هنرش را بگیرد. ما بازارچه‌ای آنلاین ساختیم تا سفالگر لالجین، گلیم‌باف کردستان، خاتم‌کار اصفهان و سوزن‌دوز بلوچ، بی‌واسطه با شما ارتباط بگیرند.
          </p>
        </div>
      </div>

      <div className="container-digi mt-6 grid grid-cols-3 gap-3">
        {[
          { v: toFaDigits(shopAgg.n), l: "کارگاه و فروشگاه هنری" },
          { v: toFaDigits(productAgg.n), l: "اثر دست‌ساز در ویترین" },
          { v: "۹۰٪", l: "سهم هنرمند از هر فروش" },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl border border-digi-border/60 bg-white p-5 text-center">
            <div className="font-display text-3xl text-brand">{s.v}</div>
            <div className="mt-1 text-[10.5px] text-digi-muted">{s.l}</div>
          </div>
        ))}
      </div>

      <section className="container-digi mt-8 grid items-center gap-6 md:grid-cols-2">
        <div className="grid grid-cols-2 gap-3">
          {[px(28271468, 400, 400), px(39365353, 400, 400), px(32980208, 400, 400), px(35251793, 400, 400)].map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={src} alt="اثر هنری" loading="lazy" className={`aspect-square w-full rounded-2xl object-cover shadow-md ${i % 2 ? "translate-y-6" : ""}`} />
          ))}
        </div>
        <div>
          <h2 className="font-display text-2xl text-digi-text">ارزش‌های ما</h2>
          <ul className="mt-4 space-y-4">
            {[
              { icon: HeartHandshake, t: "عدالت برای هنرمند", d: "بدون هزینه عضویت؛ تنها ۱۰٪ کمیسیون از فروش قطعی و تسویه هفتگی." },
              { icon: ShieldCheck, t: "اصالت بی‌چون‌وچرا", d: "فقط آثار دست‌ساز؛ همراه با گواهی اصالت و اعتبارسنجی فروشگاه‌ها." },
              { icon: Sprout, t: "پاسداری از میراث", d: "حمایت از هنرهای در معرض فراموشی مثل نمدمالی، خاتم و سوزن‌دوزی بلوچ." },
              { icon: Store, t: "ویترینی برای همه", d: "هر هنرمند در هر نقطه ایران می‌تواند در چند دقیقه فروشگاه خودش را بسازد." },
            ].map(({ icon: Icon, t, d }) => (
              <li key={t} className="flex gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-orange-50 text-brand"><Icon size={20} /></span>
                <span>
                  <span className="block text-[13px] font-extrabold">{t}</span>
                  <span className="mt-0.5 block text-[11px] leading-6 text-digi-muted">{d}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link href="/shops" className="flex items-center gap-1.5 rounded-xl bg-brand px-5 py-3 text-[12px] font-bold text-white hover:bg-brand-deep">
              آشنایی با هنرمندان <ArrowLeft size={15} />
            </Link>
            <Link href="/sell" className="rounded-xl border border-digi-border px-5 py-3 text-[12px] font-bold hover:border-brand hover:text-brand">
              به ما بپیوندید
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
