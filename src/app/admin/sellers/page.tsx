import Link from "next/link";
import { BadgeCheck, Store, ChevronLeft } from "lucide-react";
import { desc, sql } from "drizzle-orm";
import { db } from "@/db";
import { shops, products } from "@/db/schema";
import { requireAdmin } from "@/lib/marketplace";
import { toFaDigits } from "@/lib/format";
import AdminNav from "@/components/AdminNav";
import { AdminVerifyButton, AdminCommissionInput } from "@/components/AdminActions";

export const dynamic = "force-dynamic";

export default async function AdminSellersPage() {
  const admin = await requireAdmin();
  if (!admin) {
    return (
      <div className="container-digi py-20 text-center text-[13px] text-digi-muted">
        پنل مدیریت فقط برای مدیران هنربازار قابل مشاهده است. <Link href="/" className="font-bold text-brand">بازگشت به خانه</Link>
      </div>
    );
  }

  const shopRows = await db
    .select({
      id: shops.id,
      name: shops.name,
      slug: shops.slug,
      city: shops.city,
      avatarColor: shops.avatarColor,
      verified: shops.verified,
      commissionPercent: shops.commissionPercent,
      createdAt: shops.createdAt,
      productsCount: sql<number>`count(${products.id})::int`,
      salesCount: sql<number>`coalesce(sum(${products.salesCount}), 0)::int`,
    })
    .from(shops)
    .leftJoin(products, sql`${products.shopId} = ${shops.id}`)
    .groupBy(shops.id)
    .orderBy(desc(shops.verified), desc(sql`coalesce(sum(${products.salesCount}), 0)`));

  return (
    <div className="container-digi py-3 md:py-4">
      <AdminNav />
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 font-display text-xl text-digi-text">
          <Store size={22} className="text-brand" />
          فروشگاه‌های هنرمندان ({toFaDigits(shopRows.length)})
        </h1>
        <Link href="/shops" className="flex items-center gap-0.5 text-[10.5px] font-bold text-brand hover:underline">
          مشاهده ویترین
          <ChevronLeft size={12} />
        </Link>
      </div>

      <div className="mt-3 overflow-x-auto rounded-2xl border border-digi-border/60 bg-white">
        <table className="w-full min-w-[760px] text-right text-[10.5px]">
          <thead>
            <tr className="bg-[#faf6ec] text-digi-muted">
              <th className="px-4 py-2.5 font-extrabold">فروشگاه</th>
              <th className="px-4 py-2.5 font-extrabold">شهر</th>
              <th className="px-4 py-2.5 font-extrabold">آثار</th>
              <th className="px-4 py-2.5 font-extrabold">فروش</th>
              <th className="px-4 py-2.5 font-extrabold">تأیید</th>
              <th className="px-4 py-2.5 font-extrabold">کمیسیون اختصاصی (٪)</th>
            </tr>
          </thead>
          <tbody>
            {shopRows.map((shop) => (
              <tr key={shop.id} className="border-t border-digi-border/60">
                <td className="px-4 py-2.5">
                  <Link href={`/shop/${shop.slug}`} className="flex items-center gap-2 font-bold hover:text-brand">
                    <span
                      className="grid h-8 w-8 place-items-center rounded-lg text-[12px] font-black text-white"
                      style={{ backgroundColor: shop.avatarColor }}
                    >
                      {shop.name.trim().charAt(0)}
                    </span>
                    <span className="line-clamp-1 max-w-44">{shop.name}</span>
                    {shop.verified && <BadgeCheck size={13} className="shrink-0 text-accent" />}
                  </Link>
                </td>
                <td className="px-4 py-2.5 text-digi-muted">{shop.city}</td>
                <td className="px-4 py-2.5 tabular-nums">{toFaDigits(shop.productsCount)}</td>
                <td className="px-4 py-2.5 tabular-nums">{toFaDigits(shop.salesCount)}</td>
                <td className="px-4 py-2.5">
                  <AdminVerifyButton shopId={shop.id} verified={shop.verified} />
                </td>
                <td className="px-4 py-2.5">
                  <AdminCommissionInput shopId={shop.id} value={shop.commissionPercent} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[9px] text-gray-400">کمیسیون اختصاصی خالی = استفاده از کمیسیون پیش‌فرض پلتفرم (قابل تنظیم در داشبورد).</p>
    </div>
  );
}
