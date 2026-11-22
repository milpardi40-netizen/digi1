import Link from "next/link";
import {
  Users,
  Store,
  Package,
  ShoppingCart,
  Banknote,
  Percent,
  BadgeCheck,
  Wallet,
  ChevronLeft,
  TrendingUp,
} from "lucide-react";
import { desc, sql, eq } from "drizzle-orm";
import { db } from "@/db";
import { users, shops, products, orders, payoutRequests } from "@/db/schema";
import { requireAdmin, getDefaultCommission } from "@/lib/marketplace";
import { formatPrice, formatDateFa, toFaDigits } from "@/lib/format";
import AdminNav from "@/components/AdminNav";
import {
  AdminSettingsForm,
  AdminVerifyButton,
  AdminOrderStatusSelect,
  AdminPayoutPaidButton,
} from "@/components/AdminActions";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();
  if (!admin) {
    return (
      <div className="container-digi flex flex-col items-center gap-4 py-20 text-center">
        <span className="grid h-20 w-20 place-items-center rounded-3xl bg-red-50 text-brand">
          <Store size={38} strokeWidth={1.4} />
        </span>
        <h1 className="font-display text-2xl text-digi-text">دسترسی غیرمجاز</h1>
        <p className="max-w-md text-[12px] leading-7 text-digi-muted">پنل مدیریت فقط برای مدیران هنربازار قابل مشاهده است.</p>
        <Link href="/" className="rounded-xl bg-brand px-8 py-3 text-[13px] font-bold text-white hover:bg-brand-deep">بازگشت به خانه</Link>
      </div>
    );
  }

  const [
    [usersAgg],
    [shopsAgg],
    [productsAgg],
    [ordersAgg],
    commission,
    recentOrders,
    pendingShops,
    pendingPayouts,
  ] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(users),
    db.select({ count: sql<number>`count(*)::int` }).from(shops),
    db.select({ count: sql<number>`count(*)::int` }).from(products),
    db.select({
      count: sql<number>`count(*)::int`,
      gmv: sql<number>`coalesce(sum(${orders.total}), 0)::int`,
      commission: sql<number>`coalesce(sum(${orders.commission}), 0)::int`,
      earnings: sql<number>`coalesce(sum(${orders.sellerEarnings}), 0)::int`,
    }).from(orders),
    getDefaultCommission(),
    db.select().from(orders).orderBy(desc(orders.createdAt)).limit(6),
    db.select().from(shops).where(eq(shops.verified, false)).orderBy(desc(shops.createdAt)).limit(6),
    db.select().from(payoutRequests).where(eq(payoutRequests.status, "pending")).orderBy(desc(payoutRequests.createdAt)).limit(5),
  ]);

  const stats = [
    { icon: Users, label: "کاربران", value: toFaDigits(usersAgg.count), color: "#6d28d9" },
    { icon: Store, label: "فروشگاه‌ها", value: toFaDigits(shopsAgg.count), color: "#0f766e" },
    { icon: Package, label: "آثار ثبت‌شده", value: toFaDigits(productsAgg.count), color: "#b4532a" },
    { icon: ShoppingCart, label: "سفارش‌ها", value: toFaDigits(ordersAgg.count), color: "#92400e" },
    { icon: TrendingUp, label: "حجم کل فروش (GMV)", value: `${formatPrice(ordersAgg.gmv)} ت`, color: "#d9a441" },
    { icon: Percent, label: "کمیسیون هنربازار", value: `${formatPrice(ordersAgg.commission)} ت`, color: "#be185d" },
  ];

  return (
    <div className="container-digi py-3 md:py-4">
      <AdminNav />

      {/* آمار پلتفرم */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="rounded-2xl border border-digi-border/60 bg-white p-3.5">
            <Icon size={18} style={{ color }} />
            <div className="mt-1.5 text-[13px] font-black leading-6 tabular-nums text-digi-text">{value}</div>
            <div className="text-[8.5px] leading-4 text-digi-muted">{label}</div>
          </div>
        ))}
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-12">
        {/* آخرین سفارش‌ها */}
        <section className="overflow-hidden rounded-2xl border border-digi-border/60 bg-white lg:col-span-8">
          <div className="flex items-center justify-between border-b border-digi-border p-4">
            <h2 className="flex items-center gap-2 text-[13px] font-extrabold">
              <ShoppingCart size={17} className="text-brand" />
              آخرین سفارش‌ها
            </h2>
            <Link href="/admin/orders" className="flex items-center gap-0.5 text-[10px] font-bold text-brand hover:underline">
              همه سفارش‌ها
              <ChevronLeft size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-right text-[10.5px]">
              <thead>
                <tr className="bg-[#faf6ec] text-digi-muted">
                  <th className="px-4 py-2 font-extrabold">سفارش</th>
                  <th className="px-4 py-2 font-extrabold">مبلغ</th>
                  <th className="px-4 py-2 font-extrabold">کمیسیون</th>
                  <th className="px-4 py-2 font-extrabold">تاریخ</th>
                  <th className="px-4 py-2 font-extrabold">وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-t border-digi-border/60">
                    <td className="px-4 py-2.5 font-mono font-bold" dir="ltr">#{toFaDigits(o.id)}</td>
                    <td className="px-4 py-2.5 tabular-nums">{formatPrice(o.total)}</td>
                    <td className="px-4 py-2.5 tabular-nums text-emerald-700">{formatPrice(o.commission)}</td>
                    <td className="px-4 py-2.5 text-digi-muted">{formatDateFa(o.createdAt)}</td>
                    <td className="px-4 py-2.5">
                      <AdminOrderStatusSelect orderId={o.id} status={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ستون کناری */}
        <div className="space-y-3 lg:col-span-4">
          {/* تنظیمات کمیسیون */}
          <section className="rounded-2xl border border-digi-border/60 bg-white p-5">
            <h2 className="flex items-center gap-2 text-[12px] font-extrabold">
              <Percent size={16} className="text-brand" />
              تنظیمات کمیسیون پلتفرم
            </h2>
            <p className="mb-3 mt-1 text-[9px] text-digi-muted">روی همه فروشگاه‌ها اعمال می‌شود (مگر فروشگاه‌های با کمیسیون اختصاصی).</p>
            <AdminSettingsForm initial={commission} />
            <div className="mt-3 rounded-xl bg-[#faf6ec] p-3 text-[9px] leading-5 text-digi-muted">
              حجم فروش: {formatPrice(ordersAgg.gmv)} تومان · سهم هنرمندان: {formatPrice(ordersAgg.earnings)} تومان · سهم هنربازار: {formatPrice(ordersAgg.commission)} تومان
            </div>
          </section>

          {/* فروشگاه‌های در انتظار تأیید */}
          <section className="rounded-2xl border border-digi-border/60 bg-white p-5">
            <h2 className="flex items-center gap-2 text-[12px] font-extrabold">
              <BadgeCheck size={16} className="text-accent" />
              در انتظار تأیید ({toFaDigits(pendingShops.length)})
            </h2>
            {pendingShops.length === 0 ? (
              <p className="mt-2 text-[10.5px] text-digi-muted">همه فروشگاه‌ها تأیید شده‌اند.</p>
            ) : (
              <ul className="mt-2 divide-y divide-digi-border/60">
                {pendingShops.map((shop) => (
                  <li key={shop.id} className="flex items-center justify-between gap-2 py-2.5">
                    <div className="min-w-0">
                      <Link href={`/shop/${shop.slug}`} className="line-clamp-1 text-[10.5px] font-bold hover:text-brand">
                        {shop.name}
                      </Link>
                      <p className="text-[9px] text-digi-muted">{shop.city}</p>
                    </div>
                    <AdminVerifyButton shopId={shop.id} verified={shop.verified} />
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* تسویه‌های در انتظار */}
          <section className="rounded-2xl border border-digi-border/60 bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-[12px] font-extrabold">
                <Wallet size={16} className="text-brand" />
                تسویه‌های در انتظار ({toFaDigits(pendingPayouts.length)})
              </h2>
              <Link href="/admin/payouts" className="text-[9.5px] font-bold text-brand hover:underline">همه</Link>
            </div>
            {pendingPayouts.length === 0 ? (
              <p className="mt-2 text-[10.5px] text-digi-muted">درخواست تسویه‌ای ثبت نشده است.</p>
            ) : (
              <ul className="mt-2 divide-y divide-digi-border/60">
                {pendingPayouts.map((payout) => (
                  <li key={payout.id} className="flex items-center justify-between gap-2 py-2.5">
                    <div className="text-[10px]">
                      <p className="tabular-nums font-bold">{formatPrice(payout.amount)} تومان</p>
                      <p className="text-[8.5px] text-gray-400">{formatDateFa(payout.createdAt)}</p>
                    </div>
                    <AdminPayoutPaidButton payoutId={payout.id} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>

      <p className="mt-4 flex items-center justify-center gap-1 text-[9px] text-gray-400">
        <Banknote size={11} />
        هنربازار تنها از فروش قطعی کمیسیون می‌گیرد؛ سهم هنرمندان همیشه محفوظ است.
      </p>
    </div>
  );
}
