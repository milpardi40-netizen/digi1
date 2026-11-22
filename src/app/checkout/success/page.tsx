import Link from "next/link";
import { CheckCircle2, Package, Truck, MapPin, Home, ClipboardList, HeartHandshake } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { formatPrice, toFaDigits, formatDateTimeFa } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const sp = await searchParams;
  const user = await getSessionUser();
  const orderId = Number(sp.id);

  let order: (typeof orders.$inferSelect) | null = null;
  let items: (typeof orderItems.$inferSelect)[] = [];

  if (user && Number.isFinite(orderId)) {
    const [row] = await db
      .select()
      .from(orders)
      .where(and(eq(orders.id, orderId), eq(orders.userId, user.id)))
      .limit(1);
    if (row) {
      order = row;
      items = await db.select().from(orderItems).where(eq(orderItems.orderId, row.id));
    }
  }

  return (
    <div className="container-digi flex flex-col items-center py-10">
      <div className="w-full max-w-2xl rounded-3xl border border-digi-border/60 bg-white p-6 text-center shadow-sm md:p-10">
        {/* تیک انیمیشنی موفقیت */}
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-50 check-pop">
          <CheckCircle2 size={52} className="text-emerald-dig" strokeWidth={1.6} />
        </div>
        <h1 className="mt-4 text-xl font-black text-digi-text">سفارش شما با موفقیت ثبت شد!</h1>
        <p className="mt-1 text-[11.5px] leading-6 text-digi-muted">
          از خرید شما سپاسگزاریم. پیامک تأیید سفارش تا لحظاتی دیگر به شماره شما ارسال می‌شود.
        </p>

        {order && (
          <>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="rounded-lg bg-gray-100 px-3 py-1.5 font-mono text-[12px] font-bold text-digi-text" dir="ltr">
                #{toFaDigits(order.id)}
              </span>
              <span className="flex items-center gap-1 rounded-lg bg-amber-50 px-3 py-1.5 text-[10.5px] font-bold text-amber-700">
                <Package size={13} />
                در حال آماده‌سازی
              </span>
              <span className="text-[10.5px] text-digi-muted">{formatDateTimeFa(order.createdAt)}</span>
            </div>

            {/* آدرس */}
            {order.addressSnapshot?.address && (
              <div className="mt-4 flex items-start gap-2 rounded-xl bg-[#fafafa] p-3 text-right text-[11px] leading-6 text-digi-muted">
                <MapPin size={16} className="mt-1 shrink-0 text-brand" />
                <span>
                  <strong className="text-digi-text">{order.addressSnapshot.recipient}</strong>
                  {" — "}
                  {order.addressSnapshot.province}، {order.addressSnapshot.city} — {order.addressSnapshot.address}
                </span>
              </div>
            )}

            {/* اقلام */}
            <ul className="mt-3 divide-y divide-digi-border/70 rounded-xl border border-digi-border/60 text-right">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-3 p-2.5">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-[#fafafa]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.productName} className="h-12 w-12 object-cover" />
                  </span>
                  <span className="line-clamp-1 flex-1 text-[11px] leading-5 text-digi-text">{item.productName}</span>
                  <span className="shrink-0 text-[10px] text-digi-muted">×{toFaDigits(item.quantity)}</span>
                  <span className="shrink-0 text-[10.5px] font-bold tabular-nums">{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>

            {order.sellerEarnings > 0 && (
              <div className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-[10.5px] font-bold text-emerald-800">
                <HeartHandshake size={14} />
                از این خرید {formatPrice(order.sellerEarnings)} مستقیماً به هنرمند(ان) این آثار می‌رسد
              </div>
            )}
            <div className="mt-3 flex items-center justify-between border-t border-digi-border pt-3 text-[12px]">
              <span className="font-bold text-digi-muted">مبلغ پرداخت‌شده</span>
              <span className="text-[15px] font-black tabular-nums text-brand">
                {formatPrice(order.total)} <span className="text-[10px] font-medium">تومان</span>
              </span>
            </div>
          </>
        )}

        {/* دکمه‌ها */}
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <Link href="/profile" className="flex items-center justify-center gap-2 rounded-xl border border-digi-border px-6 py-3 text-[12px] font-bold text-digi-text transition hover:border-brand hover:text-brand">
            <ClipboardList size={17} />
            پیگیری سفارش‌های من
          </Link>
          <Link href="/" className="flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-[12px] font-bold text-white transition hover:bg-brand-deep">
            <Home size={17} />
            بازگشت به صفحه اصلی
          </Link>
        </div>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-[9.5px] text-gray-400">
          <Truck size={12} />
          پشتیبانی و رهگیری سفارش از طریق بخش «سفارش‌های من» و شماره ۰۲۱-۸۸۸۸۰۰۰۰ هنربازار
        </p>
      </div>
    </div>
  );
}
