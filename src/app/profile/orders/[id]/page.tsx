import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  CheckCircle2,
  Package,
  Truck,
  Home,
  Ban,
  ShoppingBag,
} from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { formatPrice, toFaDigits, formatDateTimeFa } from "@/lib/format";

export const dynamic = "force-dynamic";

const TIMELINE = [
  { key: "placed", label: "ثبت سفارش", icon: CheckCircle2 },
  { key: "processing", label: "آماده‌سازی", icon: Package },
  { key: "shipped", label: "ارسال", icon: Truck },
  { key: "delivered", label: "تحویل", icon: Home },
];

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/auth/login?next=/profile");

  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isFinite(orderId)) notFound();

  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.userId, user.id)))
    .limit(1);
  if (!order) notFound();

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  const stage =
    order.status === "delivered" ? 4 : order.status === "shipped" ? 3 : order.status === "processing" ? 2 : 1;
  const cancelled = order.status === "cancelled";

  return (
    <div className="container-digi py-3 md:py-4">
      <nav className="mb-2 flex items-center gap-1 text-[10.5px] text-digi-muted" aria-label="breadcrumb">
        <Link href="/" className="hover:text-brand">خانه</Link>
        <ChevronLeft size={11} />
        <Link href="/profile" className="hover:text-brand">سفارش‌های من</Link>
        <ChevronLeft size={11} />
        <span className="text-digi-text">سفارش #{toFaDigits(order.id)}</span>
      </nav>

      <div className="rounded-2xl border border-digi-border/60 bg-white">
        {/* سربرگ سفارش */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-digi-border p-5">
          <div>
            <h1 className="flex items-center gap-2 text-[16px] font-black">
              <ShoppingBag size={19} className="text-brand" />
              سفارش #{toFaDigits(order.id)}
            </h1>
            <p className="mt-1 text-[10.5px] text-digi-muted">ثبت‌شده در {formatDateTimeFa(order.createdAt)}</p>
          </div>
          {order.promoCode && (
            <span className="rounded-lg bg-red-50 px-3 py-1.5 font-mono text-[11px] font-bold text-brand" dir="ltr">
              کد تخفیف: {order.promoCode}
            </span>
          )}
        </div>

        {/* تایم‌لاین وضعیت */}
        {cancelled ? (
          <div className="flex items-center gap-2 border-b border-digi-border bg-red-50 px-5 py-4 text-[12px] font-bold text-brand">
            <Ban size={18} />
            این سفارش لغو شده است.
          </div>
        ) : (
          <div className="border-b border-digi-border px-5 py-6">
            <ol className="flex items-center">
              {TIMELINE.map(({ key, label, icon: Icon }, i) => {
                const step = i + 1;
                const done = stage >= step;
                const current = stage === step;
                return (
                  <li key={key} className="flex flex-1 items-center last:flex-none">
                    <div className="flex flex-col items-center gap-1.5">
                      <span
                        className={`grid h-11 w-11 place-items-center rounded-full border-2 transition-all ${
                          done
                            ? current
                              ? "border-brand bg-brand text-white shadow-[0_0_0_4px_rgba(239,57,78,0.15)]"
                              : "border-emerald-dig bg-emerald-dig text-white"
                            : "border-gray-200 bg-white text-gray-300"
                        }`}
                      >
                        <Icon size={19} />
                      </span>
                      <span className={`text-[9.5px] font-bold ${done ? "text-digi-text" : "text-gray-400"}`}>
                        {label}
                      </span>
                    </div>
                    {i < TIMELINE.length - 1 && (
                      <div className={`mx-1 mb-6 h-1 flex-1 rounded-full ${stage > step ? "bg-emerald-dig" : "bg-gray-200"}`} />
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        )}

        {/* اقلام + جمع‌بندی */}
        <div className="grid gap-0 md:grid-cols-12">
          <div className="md:col-span-8 md:border-l md:border-digi-border">
            <h2 className="border-b border-digi-border/70 px-5 py-3 text-[11px] font-extrabold text-digi-muted">
              اقلام سفارش ({toFaDigits(items.length)})
            </h2>
            <ul className="divide-y divide-digi-border/70">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-3 px-5 py-3">
                  <span className="grid h-20 w-20 shrink-0 place-items-center rounded-xl border border-digi-border/60 bg-[#fafafa]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.productName} className="h-16 w-16 object-cover" loading="lazy" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-[11.5px] font-bold leading-5">{item.productName}</p>
                    <p className="mt-1 text-[9.5px] text-digi-muted">تعداد: {toFaDigits(item.quantity)}</p>
                  </div>
                  <span className="shrink-0 text-[11px] font-bold tabular-nums">{formatPrice(item.price * item.quantity)} تومان</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 md:col-span-4">
            <h2 className="text-[11px] font-extrabold text-digi-muted">آدرس تحویل</h2>
            {order.addressSnapshot?.address ? (
              <div className="mt-2 rounded-xl bg-[#fafafa] p-3 text-[10.5px] leading-6 text-digi-text">
                <strong>{order.addressSnapshot.recipient}</strong>
                <br />
                {order.addressSnapshot.province}، {order.addressSnapshot.city} — {order.addressSnapshot.address}
                {order.addressSnapshot.plaque ? `، پلاک ${order.addressSnapshot.plaque}` : ""}
                {order.addressSnapshot.unit ? `، واحد ${order.addressSnapshot.unit}` : ""}
                <br />
                <span dir="ltr">{order.addressSnapshot.phone}</span>
              </div>
            ) : (
              <p className="mt-2 text-[10.5px] text-digi-muted">آدرسی ثبت نشده است.</p>
            )}

            <h2 className="mt-5 text-[11px] font-extrabold text-digi-muted">جزئیات پرداخت</h2>
            <dl className="mt-2 space-y-1.5 text-[11px] text-digi-text">
              <div className="flex justify-between"><dt className="text-digi-muted">جمع کالاها</dt><dd className="tabular-nums">{formatPrice(subtotal)}</dd></div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-dig"><dt>تخفیف</dt><dd className="tabular-nums">- {formatPrice(order.discount)}</dd></div>
              )}
              <div className="flex justify-between text-digi-muted"><dt>ارسال</dt><dd>{order.shipping === 0 ? "رایگان" : formatPrice(order.shipping)}</dd></div>
              <div className="my-2 border-t border-dashed border-digi-border" />
              <div className="flex justify-between font-black"><dt>مبلغ پرداختی</dt><dd className="tabular-nums text-brand">{formatPrice(order.total)} تومان</dd></div>
            </dl>

            <Link href="/profile" className="mt-5 flex h-11 items-center justify-center gap-1 rounded-xl border border-digi-border text-[11px] font-bold transition hover:border-brand hover:text-brand">
              بازگشت به سفارش‌های من
              <ChevronLeft size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
