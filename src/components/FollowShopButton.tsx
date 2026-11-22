"use client";

import { useEffect, useState } from "react";
import { Check, Plus } from "lucide-react";
import { useToast } from "@/lib/toast";

export default function FollowShopButton({ slug, shopName }: { slug: string; shopName: string }) {
  const { toast } = useToast();
  const [following, setFollowing] = useState(false);
  const KEY = "honarbazar-following";

  useEffect(() => {
    try {
      const list: string[] = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      setFollowing(list.includes(slug));
    } catch {
      /* ignore */
    }
  }, [slug]);

  const toggle = () => {
    try {
      const list: string[] = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      const next = list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug];
      localStorage.setItem(KEY, JSON.stringify(next));
      setFollowing(!following);
      toast(!following ? `«${shopName}» را دنبال می‌کنید؛ آثار جدید را به شما اطلاع می‌دهیم` : "دنبال‌کردن فروشگاه لغو شد");
    } catch {
      /* ignore */
    }
  };

  return (
    <button
      onClick={toggle}
      aria-pressed={following}
      className={`flex h-11 items-center gap-2 rounded-xl px-5 text-[12px] font-bold transition-all ${
        following
          ? "border border-emerald-dig bg-emerald-50 text-emerald-dig"
          : "bg-brand text-white hover:bg-brand-deep"
      }`}
    >
      {following ? <Check size={17} /> : <Plus size={17} />}
      {following ? "این فروشگاه را دنبال می‌کنید" : "دنبال کردن فروشگاه"}
    </button>
  );
}
