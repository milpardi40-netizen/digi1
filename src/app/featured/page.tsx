import type { Metadata } from "next";
import ListingView from "@/components/ListingView";
import { HERO } from "@/lib/images";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "منتخب سردبیر هنربازار",
  description: "آثار دست‌چین‌شده توسط کارشناسان هنربازار از بهترین کارگاه‌های هنری ایران؛ هر اثر با گواهی اصالت.",
};

export default async function FeaturedPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  return (
    <ListingView
      title="منتخب سردبیر هنربازار"
      subtitle="آثاری که کارشناسان ما به آن‌ها اعتماد دارند — دست‌ساز، اصیل و با کیفیت"
      breadcrumb={["منتخب سردبیر"]}
      basePath="/featured"
      searchParams={sp}
      fixed={{ featured: true }}
      fixedQuery={{}}
      featuredTheme
      bannerImage={HERO.lighting}
    />
  );
}
