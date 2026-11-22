import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { settings, shops, orderItems, orders, payoutRequests, products } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";

/** درصد کمیسیون پیش‌فرض پلتفرم از تنظیمات */
export async function getDefaultCommission(): Promise<number> {
  const [row] = await db.select().from(settings).where(eq(settings.key, "commission_percent")).limit(1);
  const n = row ? Number(row.value) : 10;
  return Number.isFinite(n) && n >= 0 && n <= 90 ? n : 10;
}

/** کمیسیون مؤثر برای یک فروشگاه (override یا پیش‌فرض) */
export function effectiveCommission(shop: { commissionPercent: number | null }, fallback: number): number {
  return shop.commissionPercent ?? fallback;
}

/** فروشگاه کاربر جاری (اگر فروشنده باشد) */
export async function getMyShop(userId: number) {
  const [shop] = await db.select().from(shops).where(eq(shops.userId, userId)).limit(1);
  return shop ?? null;
}

export type ShopStats = {
  productsCount: number;
  ordersCount: number;
  grossSales: number; // ناخالص فروش (تومان)
  commissionPaid: number; // کمیسیون کسرشده
  netEarnings: number; // سهم هنرمند
  pendingCount: number; // اقلام در انتظار ارسال
  availableForPayout: number; // مانده قابل درخواست تسویه (سفارش‌های تحویل‌شده − پرداخت‌شده‌ها)
};

/** آمار یک فروشگاه برای داشبورد فروشنده */
export async function getShopStats(shopId: number): Promise<ShopStats> {
  const [productCountRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(products)
    .where(eq(products.shopId, shopId));

  const [salesAgg] = await db
    .select({
      gross: sql<number>`coalesce(sum(${orderItems.price} * ${orderItems.quantity}), 0)::int`,
      net: sql<number>`coalesce(sum(${orderItems.earning}), 0)::int`,
      ordersCount: sql<number>`count(distinct ${orderItems.orderId})::int`,
      pendingCount: sql<number>`count(*) filter (where ${orderItems.sellerStatus} = 'pending')::int`,
    })
    .from(orderItems)
    .where(eq(orderItems.shopId, shopId));

  const grossSales = salesAgg?.gross ?? 0;
  const netEarnings = salesAgg?.net ?? 0;
  const commissionPaid = grossSales - netEarnings;

  // مانده قابل تسویه: درآمد اقلام سفارش‌های تحویل‌شده − مجموع تسویه‌های پرداخت‌شده
  const [deliveredAgg] = await db
    .select({ net: sql<number>`coalesce(sum(${orderItems.earning}), 0)::int` })
    .from(orderItems)
    .innerJoin(orders, eq(orders.id, orderItems.orderId))
    .where(sql`${orderItems.shopId} = ${shopId} and ${orders.status} = 'delivered'`);

  const [paidAgg] = await db
    .select({ paid: sql<number>`coalesce(sum(${payoutRequests.amount}), 0)::int` })
    .from(payoutRequests)
    .where(sql`${payoutRequests.shopId} = ${shopId} and ${payoutRequests.status} = 'paid'`);

  const [pendingAgg] = await db
    .select({ pending: sql<number>`coalesce(sum(${payoutRequests.amount}), 0)::int` })
    .from(payoutRequests)
    .where(sql`${payoutRequests.shopId} = ${shopId} and ${payoutRequests.status} = 'pending'`);

  const availableForPayout = Math.max(0, (deliveredAgg?.net ?? 0) - (paidAgg?.paid ?? 0) - (pendingAgg?.pending ?? 0));

  return {
    productsCount: productCountRow?.count ?? 0,
    ordersCount: salesAgg?.ordersCount ?? 0,
    grossSales,
    commissionPaid,
    netEarnings,
    pendingCount: salesAgg?.pendingCount ?? 0,
    availableForPayout,
  };
}

/** بررسی نقش ادمین */
export async function requireAdmin() {
  const user = await getSessionUser();
  return user?.role === "admin" ? user : null;
}
