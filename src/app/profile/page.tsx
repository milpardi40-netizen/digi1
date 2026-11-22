import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Package,
  ChevronLeft,
  UserRound,
  Crown,
  ShoppingBag,
  MapPin,
} from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/db";
import { orders, orderItems, addresses } from "@/db/schema";
import { desc, eq, inArray } from "drizzle-orm";
import { formatPrice, formatDateFa, toFaDigits, formatCompactFa } from "@/lib/format";
import LogoutButton from "@/components/LogoutButton";
import ProfileAddresses from "@/components/ProfileAddresses";
import type { AddressRow } from "@/components/AddressForm";

export const dynamic = "force-dynamic";

const STATUS: Record<string, { label: string; className: string }> = {
  processing: { label: "در حال آماده‌سازی", className: "bg-amber-50 text-amber-700" },
  shipped: { label: "ارسال شده", className: "bg-blue-50 text-blue-700" },
  delivered: { label: "تحویل داده شده", className: "bg-emerald-50 text-emerald-700" },
  cancelled: { label: "لغو شده", className: "bg-red-50 text-brand" },
};

export default async function ProfilePage() {
  const user = await getSessionUser();
  if (!user) redirect("/auth/login?next=/profile");

  const [myOrders, myAddresses] = await Promise.all([
    db.select().from(orders).where(eq(orders.userId, user.id)).orderBy(desc(orders.createdAt)),
    db.select().from(addresses).where(eq(addresses.userId, user.id)).orderBy(desc(addresses.id)),
  ]);

  const orderIds = myOrders.map((o) => o.id);
  const items = orderIds.length
    ? await db.select().from(orderItems).where(inArray(orderItems.orderId, orderIds))
    : [];
  const itemsByOrder = new Map<number, typeof items>();
  for (const item of items) {
    const list = itemsByOrder.get(item.orderId) ?? [];
    list.push(item);
    itemsByOrder.set(item.orderId, list);
  }

  const totalPurchases = myOrders.reduce((acc, o) => acc + o.total, 0);
  const addressRows: AddressRow[] = myAddresses.map((a) => ({
    id: a.id,
    title: a.title,
    province: a.province,
    city: a.city,
    address: a.address,
    plaque: a.plaque,
    unit: a.unit,
    postalCode: a.postalCode,
    recipient: a.recipient,
    phone: a.phone,
  }));

  return (
    <div className="container-digi py-3 md:py-4">
      <nav className="mb-2 flex items-center gap-1 text-[10.5px] text-digi-muted" aria-label="breadcrumb">
        <Link href="/" className="hover:text-brand">خانه</Link>
        <ChevronLeft size={11} />
        <span className="text-digi-text">حساب کاربری</span>
      </nav>

      {/* ── کارت خوش‌آمدگویی ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-digi-border/60 bg-white p-5">
        <div className="flex items-center gap-4">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-brand to-[#ff7a45] text-2xl font-black text-white">
            {user.name.trim().charAt(0)}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[16px] font-black">{user.name}</h1>
              {user.role === "admin" && (
                <span className="flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[9px] font-bold text-amber-700">
                  <Crown size={11} /> مدیر
                </span>
              )}
            </div>
            <p className="mt-0.5 text-[11px] text-digi-muted" dir="ltr">{user.phone}</p>
            <p className="text-[10px] text-gray-400">عضویت از {formatDateFa(user.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden text-center sm:block">
            <div className="text-lg font-black tabular-nums text-brand">{toFaDigits(myOrders.length)}</div>
            <div className="text-[9.5px] text-digi-muted">سفارش ثبت‌شده</div>
          </div>
          <div className="hidden text-center sm:block">
            <div className="text-lg font-black tabular-nums text-brand">{formatCompactFa(totalPurchases)}</div>
            <div className="text-[9.5px] text-digi-muted">ارزش خریدهای شما</div>
          </div>
          <LogoutButton />
        </div>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-12">
        {/* ── سفارش‌های من ── */}
        <section className="rounded-2xl border border-digi-border/60 bg-white p-4 md:p-5 lg:col-span-8">
          <h2 className="mb-3 flex items-center gap-2 text-[13px] font-extrabold">
            <ShoppingBag size={17} className="text-brand" />
            سفارش‌های من
          </h2>

          {myOrders.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <Package size={44} className="text-gray-300" strokeWidth={1.2} />
              <p className="text-[12px] font-bold text-digi-muted">هنوز سفارشی ثبت نکرده‌اید.</p>
              <Link href="/featured" className="rounded-xl bg-brand px-6 py-2.5 text-[11.5px] font-bold text-white">
                رفتن به فروشگاه
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {myOrders.map((order) => {
                const list = itemsByOrder.get(order.id) ?? [];
                const status = STATUS[order.status] ?? STATUS.processing;
                const first = list[0];
                return (
                  <li key={order.id} className="overflow-hidden rounded-xl border border-digi-border/70">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-digi-border/60 bg-[#fafafa] px-4 py-2.5">
                      <div className="flex flex-wrap items-center gap-3 text-[10px] text-digi-muted">
                        <span className="font-mono font-bold text-digi-text" dir="ltr">#{toFaDigits(order.id)}</span>
                        <span>{formatDateFa(order.createdAt)}</span>
                        <span className={`rounded-md px-2 py-0.5 font-bold ${status.className}`}>{status.label}</span>
                      </div>
                      <span className="text-[11px] font-black text-brand">{formatPrice(order.total)} تومان</span>
                    </div>
                    <div className="flex items-center gap-3 p-3">
                      {first && (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={first.image}
                            alt={first.productName}
                            className="h-16 w-16 shrink-0 rounded-lg object-cover"
                            loading="lazy"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-1 text-[11px] font-bold leading-5">{first.productName}</p>
                            <p className="mt-0.5 text-[9.5px] text-digi-muted">
                              {toFaDigits(list.length)} قلم کالا در این سفارش
                            </p>
                          </div>
                        </>
                      )}
                      <Link
                        href={`/profile/orders/${order.id}`}
                        className="flex shrink-0 items-center gap-0.5 rounded-lg border border-digi-border px-3 py-2 text-[10px] font-bold transition hover:border-brand hover:text-brand"
                      >
                        جزئیات
                        <ChevronLeft size={12} />
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* ── آدرس‌ها ── */}
        <div className="lg:col-span-4">
          <ProfileAddresses initialAddresses={addressRows} />
          <div className="mt-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-[10px] leading-6 text-blue-900">
            <MapPin size={14} className="mb-1 text-blue-600" />
            آدرس‌های شما هنگام ثبت سفارش به‌صورت خودکار به فروشنده منتخب شما نمایش داده می‌شود و برای سایر کاربران قابل مشاهده نیست.
          </div>
        </div>
      </div>
    </div>
  );
}
