"use client";

import { useState } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace("/");
      router.refresh();
    }
  };

  return (
    <button
      onClick={logout}
      disabled={loading}
      className="flex h-10 items-center gap-2 rounded-lg border border-digi-border px-4 text-[11px] font-bold text-digi-muted transition hover:border-brand hover:text-brand disabled:opacity-60"
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
      خروج از حساب
    </button>
  );
}
