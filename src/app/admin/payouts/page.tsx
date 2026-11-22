import Link from "next/link";
import { Wallet, BadgeCheck, Clock } from "lucide-react";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { payoutRequests, shops } from "@/db/schema";
import { requireAdmin } from "@/lib/marketplace";
import { formatPrice, formatDateTimeFa, toFaDigits } from "@/lib/format";
import AdminNav from "@/components/AdminNav";
import { AdminPayoutPaidButton } from "@/components/AdminActions";

export const dynamic = "force-dynamic";

export default async function AdminPayoutsPage() {
  const admin = await requireAdmin();
  if (!admin) {
    return (
      <div className="container-digi py-20 text-center text-[13px] text-digi-muted">
        پنل مدیریت فقط برای مدیران هنربازار قابل مشاهده است. <Link href="/" className="font-bold text-brand">بازگشت به خانه</Link>
      </div>
    );
  }

  const rows = await db
    .select({ payout: payoutRequests, shopName: shops.name, shopSlug: shops.slug })
    .from(payoutRequests)
    .innerJoin(shops, eq(shops.id, payoutRequests.shopId))
    .orderBy(desc(payoutRequests.createdAt))
    .limit(100);

  const pending = rows.filter((r) => r.payout.status === "pending");
  const paid = rows.filter((r) => r.payout.status === "paid");
  const pendingTotal = pending.reduce((acc, r) => acc + r.payout.amount, 0);
  const paidTotal = paid.reduce((acc, r) => acc + r.payout.amount, 0);

  return (
    <div className="container-digi py-3 md:py-4">
      <AdminNav />
      <h1 className="flex items-center gap-2 font-display text-xl text-digi-text">
        <Wallet size={22} className="text-brand" />
        تسویه حساب فروشندگان
      </h1>

      {/* خلاصه */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-1 text-[9.5px] font-bold text-amber-800"><Clock size={12} /> در انتظار پرداخت ({toFaDigits(pending.length)})</div>
          <div className="mt-1 text-lg font-black tabular-nums text-amber-900">{formatPrice(pendingTotal)} <span className="text-[9px] font-medium">تومان</span></div>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center gap-1 text-[9.5px] font-bold text-emerald-800"><BadgeCheck size={12} /> واریزشده ({toFaDigits(paid.length)})</div>
          <div className="mt-1 text-lg font-black tabular-nums text-emerald-900">{formatPrice(paidTotal)} <span className="text-[9px] font-medium">تومان</span></div>
        </div>
      </div>

      <div className="mt-3 overflow-x-auto rounded-2xl border border-digi-border/60 bg-white">
        <table className="w-full min-w-[680px] text-right text-[10.5px]">
          <thead>
            <tr className="bg-[#faf6ec] text-digi-muted">
              <th className="px-4 py-2.5 font-extrabold">فروشگاه</th>
              <th className="px-4 py-2.5 font-extrabold">مبلغ تسویه</th>
              <th className="px-4 py-2.5 font-extrabold">تاریخ درخواست</th>
              <th className="px-4 py-2.5 font-extrabold">تاریخ واریز</th>
              <th className="px-4 py-2.5 font-extrabold">وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ payout, shopName, shopSlug }) => (
              <tr key={payout.id} className="border-t border-digi-border/60">
                <td className="px-4 py-2.5">
                  <Link href={`/shop/${shopSlug}`} className="font-bold hover:text-brand">{shopName}</Link>
                </td>
                <td className="px-4 py-2.5 tabular-nums font-bold">{formatPrice(payout.amount)}</td>
                <td className="px-4 py-2.5 text-digi-muted">{formatDateTimeFa(payout.createdAt)}</td>
                <td className="px-4 py-2.5 text-digi-muted">{payout.paidAt ? formatDateTimeFa(payout.paidAt) : "—"}</td>
                <td className="px-4 py-2.5">
                  {payout.status === "paid" ? (
                    <span className="rounded-md bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-700">واریز شد</span>
                  ) : (
                    <AdminPayoutPaidButton payoutId={payout.id} />
                  )}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-digi-muted">هنوز درخواست تسویه‌ای ثبت نشده است.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
