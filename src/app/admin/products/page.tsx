import Link from "next/link";
import { Package, ChevronLeft } from "lucide-react";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { products, shops } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/marketplace";
import { formatPrice, toFaDigits } from "@/lib/format";
import AdminNav from "@/components/AdminNav";
import { AdminFeatureButton, AdminDeleteProduct } from "@/components/AdminActions";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const admin = await requireAdmin();
  if (!admin) {
    return (
      <div className="container-digi py-20 text-center text-[13px] text-digi-muted">
        پنل مدیریت فقط برای مدیران هنربازار قابل مشاهده است. <Link href="/" className="font-bold text-brand">بازگشت به خانه</Link>
      </div>
    );
  }

  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      image: products.image,
      price: products.price,
      salesCount: products.salesCount,
      stock: products.stock,
      isFeatured: products.isFeatured,
      shopName: shops.name,
      shopSlug: shops.slug,
    })
    .from(products)
    .innerJoin(shops, eq(shops.id, products.shopId))
    .orderBy(desc(products.createdAt));

  return (
    <div className="container-digi py-3 md:py-4">
      <AdminNav />
      <h1 className="flex items-center gap-2 font-display text-xl text-digi-text">
        <Package size={22} className="text-brand" />
        همه آثار هنربازار ({toFaDigits(rows.length)})
      </h1>

      <div className="mt-3 overflow-x-auto rounded-2xl border border-digi-border/60 bg-white">
        <table className="w-full min-w-[820px] text-right text-[10.5px]">
          <thead>
            <tr className="bg-[#faf6ec] text-digi-muted">
              <th className="px-4 py-2.5 font-extrabold">اثر</th>
              <th className="px-4 py-2.5 font-extrabold">هنرمند</th>
              <th className="px-4 py-2.5 font-extrabold">قیمت</th>
              <th className="px-4 py-2.5 font-extrabold">موجودی</th>
              <th className="px-4 py-2.5 font-extrabold">فروش</th>
              <th className="px-4 py-2.5 font-extrabold">منتخب سردبیر</th>
              <th className="px-4 py-2.5 font-extrabold">حذف</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-t border-digi-border/60">
                <td className="px-4 py-2">
                  <Link href={`/product/${p.slug}`} className="flex items-center gap-2 hover:text-brand">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt={p.name} className="h-11 w-11 rounded-lg object-cover" loading="lazy" />
                    <span className="line-clamp-1 max-w-56 font-bold">{p.name}</span>
                  </Link>
                </td>
                <td className="px-4 py-2">
                  <Link href={`/shop/${p.shopSlug}`} className="line-clamp-1 max-w-36 text-digi-muted hover:text-brand">
                    {p.shopName}
                  </Link>
                </td>
                <td className="px-4 py-2 tabular-nums">{formatPrice(p.price)}</td>
                <td className="px-4 py-2 tabular-nums">{toFaDigits(p.stock)}</td>
                <td className="px-4 py-2 tabular-nums">{toFaDigits(p.salesCount)}</td>
                <td className="px-4 py-2">
                  <AdminFeatureButton productId={p.id} featured={p.isFeatured} />
                </td>
                <td className="px-4 py-2">
                  <AdminDeleteProduct productId={p.id} name={p.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[9px] text-gray-400">
        «منتخب سردبیر» یعنی اثر در صفحه اصلی و صفحه /featured برجسته می‌شود.
        <Link href="/featured" className="ms-1 inline-flex items-center gap-0.5 font-bold text-brand hover:underline">مشاهده منتخب‌ها <ChevronLeft size={10} /></Link>
      </p>
    </div>
  );
}
