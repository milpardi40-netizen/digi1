"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Truck, PackageCheck, Inbox } from "lucide-react";
import { useToast } from "@/lib/toast";
import { formatPrice, formatDateFa, toFaDigits } from "@/lib/format";

export type SellerOrderItemRow = {
  id: number;
  orderId: number;
  productName: string;
  image: string;
  quantity: number;
  earning: number;
  sellerStatus: string;
  createdAt: string;
  orderStatus: string;
  buyerCity: string;
};

export default function SellerOrderList({ items }: { items: SellerOrderItemRow[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [shippingId, setShippingId] = useState<number | null>(null);

  const ship = async (itemId: number) => {
    setShippingId(itemId);
    try {
      const res = await fetch("/api/seller/orders/ship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast(data.error ?? "خطا در ثبت ارسال");
        return;
      }
      toast("قلم سفارش به‌عنوان «ارسال شد» ثبت شد");
      router.refresh();
    } catch {
      toast("ارتباط با سرور برقرار نشد");
    } finally {
      setShippingId(null);
    }
  };

  return (
    <section className="rounded-2xl border border-digi-border/60 bg-white">
      <div className="flex items-center justify-between border-b border-digi-border p-4">
        <h2 className="flex items-center gap-2 text-[13px] font-extrabold">
          <Inbox size={17} className="text-brand" />
          سفارش‌های دریافتی ({toFaDigits(items.length)})
        </h2>
        <span className="text-[9px] text-digi-muted">ارسال را هر قلم جدا ثبت کنید</span>
      </div>

      {items.length === 0 ? (
        <p className="py-12 text-center text-[12px] text-digi-muted">هنوز سفارشی برای آثار شما ثبت نشده است.</p>
      ) : (
        <ul className="divide-y divide-digi-border/60">
          {items.map((item) => {
            const shipped = item.sellerStatus === "shipped";
            return (
              <li key={item.id} className="flex items-center gap-3 p-3">
                <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl border border-digi-border/60 bg-[#faf6ec]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.productName} className="h-full w-full object-cover" loading="lazy" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-[10.5px] font-bold leading-5 text-digi-text">{item.productName}</p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[9px] text-digi-muted">
                    <span>سفارش #{toFaDigits(item.orderId)}</span>
                    <span>·</span>
                    <span>{toFaDigits(item.quantity)} عدد</span>
                    <span>·</span>
                    <span>تحویل به: {item.buyerCity || "—"}</span>
                    <span>·</span>
                    <span>{formatDateFa(item.createdAt)}</span>
                  </div>
                  <div className="mt-0.5 text-[9px] font-bold text-emerald-700">
                    سهم شما: {formatPrice(item.earning)} تومان
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-center gap-1">
                  {shipped ? (
                    <span className="flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1.5 text-[9px] font-bold text-blue-700">
                      <PackageCheck size={13} />
                      ارسال شد
                    </span>
                  ) : (
                    <button
                      onClick={() => ship(item.id)}
                      disabled={shippingId === item.id}
                      className="flex items-center gap-1 rounded-lg bg-accent px-3 py-1.5 text-[9px] font-bold text-white transition hover:bg-accent-dark disabled:opacity-60"
                    >
                      {shippingId === item.id ? <Loader2 size={13} className="animate-spin" /> : <Truck size={13} />}
                      آماده ارسال شد
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
