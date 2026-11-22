import type { Metadata } from "next";
import ListingView from "@/components/ListingView";
import { HERO } from "@/lib/images";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "جستجو در کالاها",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const qRaw = sp.q;
  const q = (Array.isArray(qRaw) ? qRaw[0] : qRaw)?.trim() ?? "";

  return (
    <ListingView
      title={q ? `نتایج جستجو برای «${q}»` : "همه آثار هنربازار"}
      subtitle={q ? "نتایج بر اساس نام اثر و فروشگاه" : "مرور همه آثار دست‌ساز ثبت‌شده در هنربازار"}
      breadcrumb={["جستجو"]}
      basePath="/search"
      searchParams={sp}
      fixed={q ? { q } : {}}
      fixedQuery={q ? { q } : {}}
      bannerImage={HERO.bazaar}
    />
  );
}
