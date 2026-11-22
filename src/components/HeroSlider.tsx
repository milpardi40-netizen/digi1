"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { HERO } from "@/lib/images";

type Slide = {
  kicker: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  image: string;
  overlay: string;
  chip?: string;
};

const SLIDES: Slide[] = [
  {
    kicker: "بازارچه آنلاین هنر ایران",
    title: "هنر دست هنرمند؛ مستقیم از کارگاه",
    subtitle: "سفال لالجین، گلیم کردستان، فیروزه نیشابور و خاتم اصفهان — بدون واسطه، با گواهی اصالت",
    cta: "مشاهده منتخب سردبیر",
    href: "/featured",
    image: HERO.bazaar,
    overlay: "from-[#2b1a0e]/95 via-[#2b1a0e]/70 to-transparent",
    chip: "۱۲ کارگاه هنری از ۸ استان",
  },
  {
    kicker: "سفال لالجین",
    title: "از خاک تا لعاب فیروزه‌ای",
    subtitle: "هر گلدان روی چرخ استاد رضایی شکل می‌گیرد؛ شماره‌دار و امضاشده",
    cta: "خرید از گالری لالجین",
    href: "/shop/laljin-pottery",
    image: HERO.pottery,
    overlay: "from-[#0b2b28]/95 via-[#0b2b28]/65 to-transparent",
    chip: "ارسال با بسته‌بندی ضدضربه",
  },
  {
    kicker: "کالکشن نور — کارگاه چراغ‌چی",
    title: "لوستر و فانوس موزائیک دست‌ساز",
    subtitle: "هزاران تکه شیشه رنگی، یک‌به‌یک با دست استادکاران اصفهان چیده شده",
    cta: "دیدن صنایع روشنایی",
    href: "/category/lighting",
    image: HERO.lighting,
    overlay: "from-[#1f1405]/95 via-[#1f1405]/65 to-transparent",
    chip: "ضمانت ۱ ساله کارگاه",
  },
  {
    kicker: "فرش و گلیم دستباف",
    title: "روایت روستا، روی دیوار خانه شما",
    subtitle: "پشم دست‌ریس و رنگ‌های گیاهی روناس و نیل؛ از کردستان تا شیراز",
    cta: "مشاهده فرش و گلیم",
    href: "/category/carpet",
    image: HERO.carpet,
    overlay: "from-[#3a0f0c]/95 via-[#3a0f0c]/65 to-transparent",
    chip: "بدون رنگ شیمیایی",
  },
  {
    kicker: "خوشنویسی و نقاشی",
    title: "قلم نی، مرکب سنتی، امضای هنرمند",
    subtitle: "تابلوهای نستعلیق و رنگ روغن اورجینال با گواهی اصالت امضاشده",
    cta: "بازدید از نگارستان",
    href: "/shop/negarestan-art",
    image: HERO.calligraphy,
    overlay: "from-[#2a0a0a]/95 via-[#2a0a0a]/60 to-transparent",
    chip: "گواهی اصالت امضاشده",
  },
];

const AUTOPLAY_MS = 6000;

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i + dir + SLIDES.length) % SLIDES.length),
    []
  );

  useEffect(() => {
    if (paused) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), AUTOPLAY_MS);
    return () => window.clearInterval(t);
  }, [paused]);

  return (
    <div
      className="relative h-56 w-full select-none overflow-hidden rounded-2xl bg-[#2b1a0e] sm:h-64 lg:h-80"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="کالکشن‌های ویژه هنربازار"
    >
      {SLIDES.map((slide, i) => {
        const active = i === index;
        return (
          <Link
            key={i}
            href={slide.href}
            aria-hidden={!active}
            tabIndex={active ? 0 : -1}
            className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
              active ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"
            }`}
          >
            {/* عکس پس‌زمینه با زوم آرام (Ken Burns) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.image}
              alt={slide.title}
              loading={i === 0 ? "eager" : "lazy"}
              className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[7000ms] ease-out ${
                active ? "scale-110" : "scale-100"
              }`}
            />
            {/* گرادیان خوانایی از سمت راست (RTL) */}
            <div className={`absolute inset-0 bg-gradient-to-l ${slide.overlay}`} />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />

            <div
              className={`relative flex h-full flex-col justify-center gap-2 p-6 transition-all duration-700 sm:max-w-lg sm:p-10 ${
                active ? "translate-y-0 opacity-100 delay-200" : "translate-y-4 opacity-0"
              }`}
            >
              <span className="w-fit rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[10px] font-bold tracking-wide text-saffron backdrop-blur-sm sm:text-[11px]">
                {slide.kicker}
              </span>
              <h2 className="font-display text-2xl leading-9 text-[#fbf7ee] drop-shadow sm:text-[34px] sm:leading-[3rem]">
                {slide.title}
              </h2>
              <p className="hidden max-w-sm text-[11.5px] leading-6 text-white/85 sm:block">{slide.subtitle}</p>
              <div className="mt-1 flex items-center gap-3 sm:mt-3">
                <span className="flex items-center gap-1.5 rounded-xl bg-[#fbf7ee] px-4 py-2.5 text-[11px] font-extrabold text-[#2b1a0e] shadow-lg transition-transform hover:scale-105 sm:text-xs">
                  {slide.cta}
                  <ArrowLeft size={14} />
                </span>
                {slide.chip && (
                  <span className="hidden text-[10px] font-medium text-white/80 md:inline">{slide.chip}</span>
                )}
              </div>
            </div>
          </Link>
        );
      })}

      <button
        onClick={() => go(-1)}
        aria-label="اسلاید قبلی"
        className="absolute right-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/30 md:grid"
      >
        <ChevronRight size={20} />
      </button>
      <button
        onClick={() => go(1)}
        aria-label="اسلاید بعدی"
        className="absolute left-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/30 md:grid"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`اسلاید ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? "w-7 bg-saffron" : "w-1.5 bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
