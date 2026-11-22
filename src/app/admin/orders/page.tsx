import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { orders, users } from "@/db/schema";
import { requireAdmin } from "@/lib/marketplace";
import { formatPrice, formatDateTimeFa, toFaDigits } from "@/lib/format";
import AdminNav from "@/components/AdminNav";
import { AdminOrderStatusSelect } from "@/components/AdminActions";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const admin = await requireAdmin();
  if (!admin) {
    return (
      <div className="container-digi py-20 text-center text-[13px] text-digi-muted">
        پنل مدیریت فقط برای مدیران هنربازار قابل مشاهده است. <Link href="/" className="font-bold text-brand">بازگشت به خانه</Link>
      </div>
    );
  }

  const rows = await db
    .select({ order: orders, buyerName: users.name, buyerPhone: users.phone })
    .from(orders)
    .innerJoin(users, eq(users.id, orders.userId))
    .orderBy(desc(orders.createdAt))
    .limit(100);

  return (
    <div className="container-digi py-3 md:py-4">
      <AdminNav />
      <h1 className="flex items-center gap-2 font-display text-xl text-digi-text">
        <ShoppingCart size={22} className="text-brand" />
        همه سفارش‌ها ({toFaDigits(rows.length)})
      </h1>

      <div className="mt-3 overflow-x-auto rounded-2xl border border-digi-border/60 bg-white">
        <table className="w-full min-w-[900px] text-right text-[10.5px]">
          <thead>
            <tr className="bg-[#faf6ec] text-digi-muted">
              <th className="px-4 py-2.5 font-extrabold">سفارش</th>
              <th className="px-4 py-2.5 font-extrabold">خریدار</th>
              <th className="px-4 py-2.5 font-extrabold">مبلغ کل</th>
              <th className="px-4 py-2.5 font-extrabold">کمیسیون</th>
              <th className="px-4 py-2.5 font-extrabold">سهم هنرمندان</th>
              <th className="px-4 py-2.5 font-extrabold">تاریخ</th>
              <th className="px-4 py-2.5 font-extrabold">وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ order, buyerName, buyerPhone }) => (
              <tr key={order.id} className="border-t border-digi-border/60">
                <td className="px-4 py-2.5 font-mono font-bold" dir="ltr">#{toFaDigits(order.id)}</td>
                <td className="px-4 py-2.5">
                  <span className="block font-bold">{buyerName}</span>
                  <span className="text-[9px] text-digi-muted" dir="ltr">{buyerPhone}</span>
                </td>
                <td className="px-4 py-2.5 tabular-nums">{formatPrice(order.total)}</td>
                <td className="px-4 py-2.5 tabular-nums text-emerald-700">{formatPrice(order.commission)}</td>
                <td className="px-4 py-2.5 tabular-nums text-blue-800">{formatPrice(order.sellerEarnings)}</td>
                <td className="px-4 py-2.5 text-digi-muted">{formatDateTimeFa(order.createdAt)}</td>
                <td className="px-4 py-2.5">
                  <AdminOrderStatusSelect orderId={order.id} status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
