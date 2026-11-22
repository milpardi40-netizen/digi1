"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Loader2, Plus, PackageOpen } from "lucide-react";
import { useToast } from "@/lib/toast";
import { formatPrice, toFaDigits } from "@/lib/format";

export type SellerProductRow = {
  id: number;
  name: string;
  slug: string;
  image: string;
  price: number;
  stock: number;
  salesCount: number;
  isFeatured: boolean;
};

export default function SellerProductList({ products }: { products: SellerProductRow[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const remove = async (id: number, name: string) => {
    if (!window.confirm(`«${name}» حذف شود؟ این عمل قابل بازگشت نیست.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/seller/products/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast(data.error ?? "خطا در حذف اثر");
        return;
      }
      toast("اثر حذف شد");
      router.refresh();
    } catch {
      toast("ارتباط با سرور برقرار نشد");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="rounded-2xl border border-digi-border/60 bg-white">
      <div className="flex items-center justify-between border-b border-digi-border p-4">
        <h2 className="flex items-center gap-2 text-[13px] font-extrabold">
          <PackageOpen size={17} className="text-brand" />
          آثار من ({toFaDigits(products.length)})
        </h2>
        <Link
          href="/seller/products/new"
          className="flex items-center gap-1 rounded-lg bg-brand px-3 py-2 text-[10.5px] font-bold text-white transition hover:bg-brand-deep"
        >
          <Plus size={14} />
          ثبت اثر جدید
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-center">
          <p className="text-[12px] font-bold text-digi-muted">هنوز اثری ثبت نکرده‌اید.</p>
          <Link href="/seller/products/new" className="text-[11px] font-bold text-brand hover:underline">
            اولین اثر خود را ثبت کنید
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-digi-border/60">
          {products.map((p) => (
            <li key={p.id} className="flex items-center gap-3 p-3">
              <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl border border-digi-border/60 bg-[#faf6ec]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt={p.name} className="h-full w-full object-cover" loading="lazy" />
              </span>
              <div className="min-w-0 flex-1">
                <Link href={`/product/${p.slug}`} className="line-clamp-1 text-[11px] font-bold leading-5 hover:text-brand">
                  {p.name}
                  {p.isFeatured && <span className="ms-1 rounded bg-amber-100 px-1 text-[8px] font-bold text-amber-800">منتخب</span>}
                </Link>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[9px] text-digi-muted">
                  <span className="tabular-nums">{formatPrice(p.price)} تومان</span>
                  <span>موجودی: {toFaDigits(p.stock)}</span>
                  <span>فروش: {toFaDigits(p.salesCount)}</span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Link
                  href={`/seller/products/${p.id}/edit`}
                  aria-label="ویرایش اثر"
                  className="grid h-9 w-9 place-items-center rounded-lg border border-digi-border text-digi-muted transition hover:border-brand hover:text-brand"
                >
                  <Pencil size={15} />
                </Link>
                <button
                  onClick={() => remove(p.id, p.name)}
                  disabled={deletingId === p.id}
                  aria-label="حذف اثر"
                  className="grid h-9 w-9 place-items-center rounded-lg border border-digi-border text-digi-muted transition hover:border-brand hover:bg-orange-50 hover:text-brand disabled:opacity-50"
                >
                  {deletingId === p.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
