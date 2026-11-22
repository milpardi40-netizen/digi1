"use client";

import { useEffect, useState } from "react";

export type PromoInfo = { code: string; percent: number; maxDiscount: number };

export function usePromo() {
  const [promo, setPromo] = useState<PromoInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("digi-promo");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as PromoInfo;
      fetch("/api/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: parsed.code }),
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => (d ? setPromo(d) : localStorage.removeItem("digi-promo")))
        .catch(() => {});
    } catch {
      /* ignore */
    }
  }, []);

  const apply = async (code: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "کد تخفیف نامعتبر است");
        return false;
      }
      setPromo(data);
      localStorage.setItem("digi-promo", JSON.stringify(data));
      return true;
    } catch {
      setError("ارتباط با سرور برقرار نشد");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removePromo = () => {
    setPromo(null);
    setError("");
    localStorage.removeItem("digi-promo");
  };

  return { promo, loading, error, apply, removePromo };
}
