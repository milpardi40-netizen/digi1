import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { ChevronLeft, Pencil } from "lucide-react";
import { asc, eq, and } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { getMyShop } from "@/lib/marketplace";
import ProductForm from "@/components/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/auth/login?next=/seller");
  const shop = await getMyShop(user.id);
  if (!shop) redirect("/auth/register?role=seller");

  const { id } = await params;
  const productId = Number(id);
  if (!Number.isFinite(productId)) notFound();

  const [[product], cats] = await Promise.all([
    db
      .select()
      .from(products)
      .where(and(eq(products.id, productId), eq(products.shopId, shop.id)))
      .limit(1),
    db.select().from(categories).orderBy(asc(categories.sort)),
  ]);
  if (!product) notFound();

  return (
    <div className="container-digi py-3 md:py-4">
      <nav className="mb-2 flex items-center gap-1 text-[10.5px] text-digi-muted" aria-label="breadcrumb">
        <Link href="/" className="hover:text-brand">خانه</Link>
        <ChevronLeft size={11} />
        <Link href="/seller" className="hover:text-brand">پنل فروشنده</Link>
        <ChevronLeft size={11} />
        <span className="text-digi-text">ویرایش اثر</span>
      </nav>
      <h1 className="mb-3 flex items-center gap-2 font-display text-xl text-digi-text">
        <Pencil size={20} className="text-brand" />
        ویرایش اثر
      </h1>
      <ProductForm
        mode="edit"
        categories={cats.map((c) => ({ id: c.id, name: c.name }))}
        initial={{
          id: product.id,
          name: product.name,
          description: product.description,
          categoryId: product.categoryId,
          price: product.price,
          originalPrice: product.originalPrice,
          stock: product.stock,
          image: product.image,
          specs: product.specs,
        }}
      />
    </div>
  );
}
