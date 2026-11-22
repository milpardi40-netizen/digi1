import Link from "next/link";
import { ChevronLeft, PlusCircle } from "lucide-react";
import { asc } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { getMyShop } from "@/lib/marketplace";
import ProductForm from "@/components/ProductForm";

export const dynamic = "force-dynamic";

const SUGGESTED = [
  "https://images.pexels.com/photos/29286721/pexels-photo-29286721.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "https://images.pexels.com/photos/34084601/pexels-photo-34084601.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "https://images.pexels.com/photos/135486/pexels-photo-135486.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "https://images.pexels.com/photos/35251793/pexels-photo-35251793.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "https://images.pexels.com/photos/21326994/pexels-photo-21326994.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "https://images.pexels.com/photos/16484131/pexels-photo-16484131.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "https://images.pexels.com/photos/30563520/pexels-photo-30563520.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "https://images.pexels.com/photos/34391573/pexels-photo-34391573.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "https://images.pexels.com/photos/28855659/pexels-photo-28855659.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "https://images.pexels.com/photos/30529136/pexels-photo-30529136.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "https://images.pexels.com/photos/14779248/pexels-photo-14779248.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "https://images.pexels.com/photos/40675534/pexels-photo-40675534.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
];

export default async function NewProductPage() {
  const user = await getSessionUser();
  if (!user) redirect("/auth/login?next=/seller/products/new");
  const shop = await getMyShop(user.id);
  if (!shop) redirect("/auth/register?role=seller");

  const cats = await db.select().from(categories).orderBy(asc(categories.sort));

  return (
    <div className="container-digi py-3 md:py-4">
      <nav className="mb-2 flex items-center gap-1 text-[10.5px] text-digi-muted" aria-label="breadcrumb">
        <Link href="/" className="hover:text-brand">خانه</Link>
        <ChevronLeft size={11} />
        <Link href="/seller" className="hover:text-brand">پنل فروشنده</Link>
        <ChevronLeft size={11} />
        <span className="text-digi-text">ثبت اثر جدید</span>
      </nav>
      <h1 className="mb-3 flex items-center gap-2 font-display text-xl text-digi-text">
        <PlusCircle size={22} className="text-brand" />
        ثبت اثر جدید در ویترین
      </h1>
      <ProductForm mode="new" categories={cats.map((c) => ({ id: c.id, name: c.name }))} suggestedImages={SUGGESTED} />
    </div>
  );
}
