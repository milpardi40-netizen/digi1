"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useToast } from "@/lib/toast";

const FAV_KEY = "digi-favorites";

export default function FavoriteToggle({ productId }: { productId: number }) {
  const { toast } = useToast();
  const [fav, setFav] = useState(false);

  useEffect(() => {
    try {
      const favs: number[] = JSON.parse(localStorage.getItem(FAV_KEY) ?? "[]");
      setFav(favs.includes(productId));
    } catch {
      /* ignore */
    }
  }, [productId]);

  const toggle = () => {
    try {
      const favs: number[] = JSON.parse(localStorage.getItem(FAV_KEY) ?? "[]");
      const next = favs.includes(productId) ? favs.filter((i) => i !== productId) : [...favs, productId];
      localStorage.setItem(FAV_KEY, JSON.stringify(next));
      setFav(!fav);
      toast(!fav ? "به علاقه‌مندی‌های شما اضافه شد" : "از علاقه‌مندی‌ها حذف شد");
    } catch {
      /* ignore */
    }
  };

  return (
    <button
      onClick={toggle}
      aria-pressed={fav}
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-all active:scale-95 ${
        fav ? "border-brand bg-red-50 text-brand" : "border-digi-border text-digi-muted hover:border-brand hover:text-brand"
      }`}
      aria-label="افزودن به علاقه‌مندی‌ها"
    >
      <Heart size={21} fill={fav ? "currentColor" : "none"} />
    </button>
  );
}
