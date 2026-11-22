import Link from "next/link";
import { Search, House } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-digi flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="select-none text-[96px] font-black leading-none text-brand/20">۴۰۴</div>
      <h1 className="-mt-8 text-lg font-black text-digi-text">این صفحه در هنربازار پیدا نشد</h1>
      <p className="max-w-sm text-[12px] leading-7 text-digi-muted">
        آدرسی که وارد کردید وجود ندارد یا حذف شده است. جستجو کنید یا به صفحه اصلی برگردید.
      </p>
      <form action="/search" className="flex w-full max-w-md gap-2">
        <div className="relative flex-1">
          <Search size={17} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            name="q"
            placeholder="جستجو در کالاها…"
            className="digi-input ps-10"
            aria-label="جستجو"
          />
        </div>
        <button type="submit" className="rounded-xl bg-brand px-5 text-[12px] font-bold text-white">جستجو</button>
      </form>
      <Link href="/" className="flex items-center gap-2 rounded-xl border border-digi-border px-6 py-2.5 text-[12px] font-bold text-digi-text hover:border-brand hover:text-brand">
        <House size={16} />
        بازگشت به صفحه اصلی
      </Link>
    </div>
  );
}
