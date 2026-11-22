import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { categories } from "@/db/schema";
import ListingView from "@/components/ListingView";
import { CATEGORY_BANNERS } from "@/lib/images";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [cat] = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return { title: cat ? cat.name : "دسته‌بندی" };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const [cat] = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  if (!cat) notFound();
  const sp = await searchParams;

  return (
    <ListingView
      title={cat.name}
      subtitle={`خرید مستقیم ${cat.name} از هنرمندان و کارگاه‌های سراسر ایران`}
      breadcrumb={[cat.name]}
      basePath={`/category/${slug}`}
      searchParams={sp}
      fixed={{ category: slug }}
      fixedQuery={{}}
      bannerImage={CATEGORY_BANNERS[slug]}
    />
  );
}
