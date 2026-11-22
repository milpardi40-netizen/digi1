import Link from "next/link";
import {
  Store,
  BadgeCheck,
  Clock,
  ChevronLeft,
  Package,
  ShoppingBag,
  Banknote,
  Percent,
  Wallet,
  Truck,
  ExternalLink,
  Info,
  LayoutDashboard,
} from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/db";
import { orders, orderItems, payoutRequests, products } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { getMyShop, getShopStats, getDefaultCommission } from "@/lib/marketplace";
import { formatPrice, formatDateFa, toFaDigits } from "@/lib/format";
import PayoutSection, { type PayoutRow } from "@/components/PayoutSection";
import SellerProductList, { type SellerProductRow } from "@/components/SellerProductList";
import SellerOrderList, { type SellerOrderItemRow } from "@/components/SellerOrderList";

export const dynamic = "force-dynamic";

export default async function SellerDashboardPage() {
  const user = await getSessionUser();
  if (!user) {
    return (
      <div className="container-digi flex flex-col items-center gap-4 py-20 text-center">
        <span className="grid h-20 w-20 place-items-center rounded-3xl bg-orange-50 text-brand">
          <Store size={38} strokeWidth={1.4} />
        </span>
        <h1 className="font-display text-2xl text-digi-text">ورود به پنل فروشنده</h1>
        <p className="max-w-md text-[12px] leading-7 text-digi-muted">برای مدیریت فروشگاه، ثبت اثر جدید و پیگیری تسویه‌حساب‌ها ابتدا وارد حساب خود شوید.</p>
        <Link href="/auth/login?next=/seller" className="rounded-xl bg-brand px-8 py-3 text-[13px] font-bold text-white hover:bg-brand-deep">ورود به حساب</Link>
      </div>
    );
  }

  const shop = await getMyShop(user.id);

  /* کاربر لاگین است ولی فروشنده نیست */
  if (!shop) {
    return (
      <div className="container-digi flex flex-col items-center gap-4 py-20 text-center">
        <span className="grid h-20 w-20 place-items-center rounded-3xl bg-orange-50 text-brand">
          <Store size={38} strokeWidth={1.4} />
        </span>
        <h1 className="font-display text-2xl text-digi-text">شما هنوز فروشنده هنربازار نیستید</h1>
        <p className="max-w-md text-[12px] leading-7 text-digi-muted">
          با ساخت فروشگاه در هنربازار می‌توانید آثار دست‌ساز خود را به هزاران خریدار از سراسر ایران بفروشید — کاملاً رایگان.
        </p>
        <div className="flex gap-2">
          <Link href="/auth/register?role=seller" className="rounded-xl bg-brand px-6 py-3 text-[12px] font-bold text-white hover:bg-brand-deep">
            ساخت فروشگاه — رایگان
          </Link>
          <Link href="/sell" className="rounded-xl border border-digi-border px-6 py-3 text-[12px] font-bold hover:border-brand hover:text-brand">
            شرایط فروشندگی
          </Link>
        </div>
      </div>
    );
  }

  const [stats, defaultCommission, myProducts, myItemsRaw, payoutRows] = await Promise.all([
    getShopStats(shop.id),
    getDefaultCommission(),
    db.select().from(products).where(eq(products.shopId, shop.id)).orderBy(desc(products.createdAt)),
    db
      .select({ item: orderItems, order: orders })
      .from(orderItems)
      .innerJoin(orders, eq(orders.id, orderItems.orderId))
      .where(eq(orderItems.shopId, shop.id))
      .orderBy(desc(orders.createdAt))
      .limit(30),
    db.select().from(payoutRequests).where(eq(payoutRequests.shopId, shop.id)).orderBy(desc(payoutRequests.createdAt)),
  ]);

  const effectivePct = shop.commissionPercent ?? defaultCommission;

  const productRows: SellerProductRow[] = myProducts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    image: p.image,
    price: p.price,
    stock: p.stock,
    salesCount: p.salesCount,
    isFeatured: p.isFeatured,
  }));

  const orderItemRows: SellerOrderItemRow[] = myItemsRaw.map(({ item, order }) => ({
    id: item.id,
    orderId: item.orderId,
    productName: item.productName,
    image: item.image,
    quantity: item.quantity,
    earning: item.earning,
    sellerStatus: item.sellerStatus,
    createdAt: order.createdAt.toISOString(),
    orderStatus: order.status,
    buyerCity: (order.addressSnapshot as Record<string, string>)?.city ?? "",
  }));

  const payouts: PayoutRow[] = payoutRows.map((r) => ({
    id: r.id,
    amount: r.amount,
    status: r.status,
    createdAt: r.createdAt.toISOString(),
    paidAt: r.paidAt ? r.paidAt.toISOString() : null,
  }));

  const statCards = [
    { icon: Package, label: "آثار در ویترین", value: toFaDigits(stats.productsCount), color: "#b4532a" },
    { icon: ShoppingBag, label: "سفارش‌های دریافتی", value: toFaDigits(stats.ordersCount), color: "#0f766e" },
    { icon: Banknote, label: "ناخالص فروش", value: formatPrice(stats.grossSales), suffix: "تومان", color: "#92400e" },
    { icon: Percent, label: `کمیسیون هنربازار (${toFaDigits(effectivePct)}٪)`, value: formatPrice(stats.commissionPaid), suffix: "تومان", color: "#be185d" },
    { icon: Wallet, label: "سهم خالص شما", value: formatPrice(stats.netEarnings), suffix: "تومان", color: "#2e7d4f", highlight: true },
    { icon: Truck, label: "در انتظار ارسال", value: toFaDigits(stats.pendingCount), color: "#d9a441" },
  ];

  return (
    <div className="container-digi py-3 md:py-4">
      <nav className="mb-2 flex items-center gap-1 text-[10.5px] text-digi-muted" aria-label="breadcrumb">
        <Link href="/" className="hover:text-brand">خانه</Link>
        <ChevronLeft size={11} />
        <span className="text-digi-text">پنل فروشنده</span>
      </nav>

      {/* ── سربرگ فروشگاه ── */}
      <div className="flex flex-col gap-4 rounded-2xl border border-digi-border/60 bg-white p-5 md:flex-row md:items-center">
        <span
          className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-3xl font-black text-white"
          style={{ backgroundColor: shop.avatarColor }}
        >
          {shop.name.trim().charAt(0)}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="flex flex-wrap items-center gap-2 font-display text-xl text-digi-text">
            {shop.name}
            {shop.verified ? (
              <span className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                <BadgeCheck size={13} />
                فروشگاه تأییدشده
              </span>
            ) : (
              <span className="flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                <Clock size={13} />
                در انتظار تأیید هنربازار
              </span>
            )}
          </h1>
          <p className="mt-1 text-[10.5px] text-digi-muted">
            {shop.city} · عضویت از {formatDateFa(shop.createdAt)} · کمیسیون شما: {toFaDigits(effectivePct)}٪
          </p>
        </div>
        <Link
          href={`/shop/${shop.slug}`}
          className="flex h-11 shrink-0 items-center gap-1.5 rounded-xl border border-digi-border px-4 text-[11px] font-bold transition hover:border-brand hover:text-brand"
        >
          مشاهده فروشگاه من
          <ExternalLink size={13} />
        </Link>
      </div>

      {/* ── کارت‌های آمار ── */}
      <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
        {statCards.map(({ icon: Icon, label, value, suffix, color, highlight }) => (
          <div
            key={label}
            className={`rounded-2xl border p-3.5 ${
              highlight ? "border-emerald-200 bg-emerald-50/60" : "border-digi-border/60 bg-white"
            }`}
          >
            <Icon size={18} style={{ color }} />
            <div className="mt-1.5 text-[13px] font-black leading-6 tabular-nums text-digi-text">
              {value}
              {suffix && <span className="text-[8.5px] font-medium text-digi-muted"> {suffix}</span>}
            </div>
            <div className="text-[8.5px] leading-4 text-digi-muted">{label}</div>
          </div>
        ))}
      </div>

      {/* ── محتوای اصلی ── */}
      <div className="mt-3 grid gap-3 lg:grid-cols-12">
        <div className="space-y-3 lg:col-span-8">
          <SellerProductList products={productRows} />
          <SellerOrderList items={orderItemRows} />
        </div>
        <div className="h-fit space-y-3 lg:col-span-4">
          <PayoutSection available={stats.availableForPayout} requests={payouts} />
          <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-[10px] leading-6 text-blue-900">
            <p className="flex items-center gap-1.5 font-extrabold">
              <Info size={14} />
              سهم هنرمندان چگونه محاسبه می‌شود؟
            </p>
            <p className="mt-1.5">
              از مبلغ نهایی هر قلم کالا (پس از کسر تخفیف)، {toFaDigits(effectivePct)}٪ سهم هنربازار و بقیه سهم شماست.
              سهم شما در هر قلم سفارش مشخص است و پس از تحویل به خریدار قابل درخواست تسویه می‌شود.
            </p>
            <Link href="/sell#commission" className="mt-1.5 inline-flex items-center gap-1 font-bold text-blue-700 hover:underline">
              جزئیات کمیسیون و تسویه
              <ChevronLeft size={11} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
